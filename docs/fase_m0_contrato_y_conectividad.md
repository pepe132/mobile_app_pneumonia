# Fase M0 — Contrato y conectividad

Última actualización: 2026-09-06.

Estado: **en progreso**.

## Objetivo

Cerrar las decisiones técnicas mínimas antes de implementar navegación, sesión
y pantallas: versión de Expo, contrato HTTP, URL base, autenticación, errores,
roles y capacidad real de ejecutar el backend.

## Decisiones confirmadas

- Se conserva el proyecto Expo existente.
- La aplicación tendrá experiencia de producto tipo SaaS.
- La v1 será de una sola organización; no existe aislamiento multi-tenant en el
  backend actual.
- El frontend consumirá exclusivamente rutas bajo `/api/v1`.
- `EXPO_PUBLIC_API_URL` contendrá el origen del servidor, sin `/api/v1`; el
  cliente HTTP añadirá el prefijo versionado en un único lugar.
- La API real será la fuente de verdad y los mocks solo cubrirán pruebas y
  estados excepcionales.
- La lógica clínica seguirá exclusivamente en el backend.

## Verificación de Expo SDK 57

Se consultó la documentación oficial versionada el 2026-09-06:

- <https://docs.expo.dev/versions/v57.0.0/>
- <https://docs.expo.dev/versions/v57.0.0/sdk/router/>
- <https://docs.expo.dev/versions/v57.0.0/sdk/securestore/>
- <https://docs.expo.dev/versions/v57.0.0/sdk/imagepicker/>

Conclusiones aplicables:

- Expo Router 57 usa rutas por archivos y debe configurarse como plugin.
- Desde SDK 56, el código de la aplicación no debe importar directamente las
  integraciones de navegación desde paquetes externos `@react-navigation/*`;
  se usarán los puntos de entrada compatibles de Expo Router.
- SecureStore es adecuado para persistir el token, pero no es fuente única para
  datos irremplazables. En Android sus valores desaparecen al desinstalar; en
  iOS pueden persistir al reinstalar con el mismo bundle ID.
- ImagePicker está incluido en Expo Go y permite seleccionar imágenes o usar la
  cámara. La primera versión habilitará selección de imagen y no solicitará
  permisos de cámara innecesarios.
- El plugin de ImagePicker permite bloquear permisos de cámara y micrófono. Se
  configurará el mínimo de permisos requerido para radiografías.

## Estado verificado del frontend

| Componente | Resultado |
|---|---|
| Node.js | `v22.12.0` |
| npm | `10.9.0` |
| Expo instalado | `57.0.16` |
| Expo configurado | SDK `57.0.0` |
| React Native | `0.86.2` |
| React | `19.2.3` |
| TypeScript | `6.0.3` |
| Plataformas declaradas | Android e iOS |

La configuración pública de Expo se puede resolver correctamente. Todavía no
se ha validado el backend en ejecución. Las dependencias de navegación, sesión,
imágenes, consultas y formularios se instalaron al comenzar M1.

React Native 0.86.2 declara como mínimo Node `22.13.0` dentro de la rama 22. La
versión local `22.12.0` logró compilar el proyecto, pero debe actualizarse antes
de considerar estable el entorno de desarrollo.

## Convención de URL

Ejemplo de desarrollo:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.100:8000
```

URL construida por el cliente:

```text
http://192.168.1.100:8000/api/v1/auth/login
```

Reglas:

- No usar `127.0.0.1` desde un teléfono físico.
- No incluir secretos en variables `EXPO_PUBLIC_*`; quedan embebidas en la app.
- Producción debe usar HTTPS.
- SQL Server nunca será accesible directamente desde el dispositivo.

## Contrato HTTP consolidado

Todas las rutas clínicas requieren JWT Bearer salvo registro e inicio de sesión.

### Autenticación

| Método | Ruta | Acceso | Uso móvil |
|---|---|---|---|
| POST | `/auth/login` | Público | Login JSON |
| GET | `/auth/me` | Autenticado | Validar/restaurar sesión |
| POST | `/auth/change-password` | Autenticado | Cambio propio |
| GET | `/auth/users` | Administrador | Listado de usuarios |
| POST | `/auth/users` | Administrador | Alta de usuario |
| GET | `/auth/users/{user_id}` | Administrador | Detalle de usuario |
| PATCH | `/auth/users/{user_id}` | Administrador | Edición |
| DELETE | `/auth/users/{user_id}` | Administrador | Desactivación |
| POST | `/auth/users/{user_id}/reset-password` | Administrador | Restablecimiento |

`POST /auth/token` se conserva para OAuth2/formularios, pero el móvil usará
`POST /auth/login`.

### Pacientes

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/patients/page` | Roles 1, 2 y 3 |
| POST | `/patients/` | Roles 1 y 2 |
| GET | `/patients/{patient_id}` | Roles 1, 2 y 3 |
| PATCH | `/patients/{patient_id}` | Roles 1 y 2 |
| DELETE | `/patients/{patient_id}` | Roles 1 y 2 |

Las rutas no paginadas permanecen por compatibilidad, pero no serán la base de
las pantallas nuevas.

### Evaluaciones y radiografías

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/evaluations/page` | Roles 1, 2 y 3 |
| POST | `/evaluations` | Roles 1 y 2 |
| GET | `/evaluations/{evaluation_id}` | Roles 1, 2 y 3 |
| GET | `/patients/{patient_id}/evaluations` | Roles 1, 2 y 3 |
| POST | `/evaluations/{evaluation_id}/radiograph` | Roles 1 y 2 |
| GET | `/evaluations/{evaluation_id}/radiograph` | Roles 1, 2 y 3 |
| GET | `/evaluations/{evaluation_id}/radiograph/image` | Roles 1, 2 y 3 |
| GET | `/evaluations/{evaluation_id}/auxiliary-decision` | Roles 1, 2 y 3 |

El archivo de radiografía se enviará en el campo multipart `file`. No se fijará
manualmente `Content-Type` para `FormData`, porque la plataforma debe generar el
boundary.

### Consultas agregadas

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/reports/evaluations/{evaluation_id}` | Roles 1, 2 y 3 |
| GET | `/dashboard/summary` | Roles 1, 2 y 3 |

`POST /decision/auxiliary` requiere rol 1 o 2, pero no forma parte del flujo
normal después de cargar una radiografía: esa carga ya devuelve y persiste la
decisión auxiliar.

## Roles

| ID | Rol | Lectura clínica | Escritura clínica | Usuarios |
|---:|---|---|---|---|
| 1 | Administrador | Sí | Sí | Sí |
| 2 | Especialista | Sí | Sí | No |
| 3 | Lectura | Sí | No | No |

## Errores que consumirá el cliente

Formato esperado:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Los datos enviados no son válidos",
    "details": []
  }
}
```

Casos mínimos:

| HTTP | Tratamiento |
|---:|---|
| 400 | Error de solicitud o regla operativa |
| 401 | Invalidar sesión y volver al acceso |
| 403 | Informar permiso insuficiente |
| 404 | Recurso inexistente o ya no disponible |
| 409 | Conflicto, incluido recurso duplicado |
| 422 | Asociar detalles de validación a campos cuando sea posible |
| 503 | Backend, base o modelo temporalmente no disponible |

## Bloqueos operativos encontrados

1. El backend no estaba disponible en `http://127.0.0.1:8000` durante la
   revisión del 2026-09-06.
2. El entorno virtual del backend referencia una instalación inexistente:
   `D:\joseg\AppData\Local\Programs\Python\Python311\python.exe`.
3. Por lo anterior todavía no se pudo exportar un snapshot vivo de
   `/openapi.json` ni ejecutar la prueba real de login/conectividad.
4. La IP `192.168.1.100` de `.env.example` es un ejemplo y debe sustituirse por
   la IP vigente del equipo.
5. Node.js debe actualizarse de `22.12.0` a `22.13.0` o superior compatible.

Estos bloqueos no impiden diseñar los DTO desde los esquemas actuales, pero M0
no se cerrará hasta validar el OpenAPI ejecutable.

## Checklist de cierre

- [x] Confirmar Expo SDK y dependencias base instaladas.
- [x] Consultar documentación oficial exacta de SDK 57.
- [x] Adoptar `/api/v1` como contrato móvil.
- [x] Consolidar endpoints, roles y errores desde el código actual.
- [x] Definir convención para `EXPO_PUBLIC_API_URL`.
- [x] Definir alcance SaaS de una sola organización para v1.
- [ ] Reparar o recrear el entorno Python del backend.
- [ ] Levantar FastAPI y verificar `/health/db`.
- [ ] Exportar y revisar `/openapi.json`.
- [ ] Probar login y `/auth/me` con un usuario de desarrollo.
- [ ] Confirmar conectividad desde emulador Android.
- [ ] Confirmar conectividad desde un teléfono físico.

## Siguiente acción

Reparar el entorno de ejecución del backend y completar las verificaciones HTTP.
Una vez cerrado M0, comenzar M1 instalando dependencias compatibles mediante
`npx expo install` cuando correspondan y reorganizando la entrada para Expo
Router.
