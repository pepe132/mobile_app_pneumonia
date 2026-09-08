# Plan de implementación del frontend móvil

Última actualización: 2026-08-31.

## 1. Objetivo

Construir una aplicación móvil en React Native con Expo para consumir el backend
de apoyo clínico de neumonía pediátrica. La aplicación permitirá autenticar
usuarios, gestionar pacientes, registrar evaluaciones clínicas, cargar
radiografías opcionales y consultar los resultados tabulares, radiográficos e
integrados que genera el servidor.

La aplicación es una herramienta auxiliar. No sustituye el juicio clínico ni
debe implementar por su cuenta reglas para diagnosticar, clasificar severidad o
producir recomendaciones médicas.

## 2. Decisión sobre el proyecto existente

Se conservará y evolucionará el proyecto actual `mobile_app_pneumonia`.

Razones:

- Ya utiliza Expo SDK 57, React Native y TypeScript.
- Su código actual es pequeño y puede reorganizarse sin una migración costosa.
- No contiene una arquitectura heredada que justifique recrearlo.
- Ya tiene configuración, recursos gráficos y una estructura inicial por
  módulos.

Se permite modificar, mover o reemplazar cualquier parte del esqueleto actual
cuando la arquitectura definitiva lo requiera. No se conservarán contratos o
componentes solo por compatibilidad con el prototipo.

### Enfoque de producto SaaS

La aplicación tendrá una experiencia de producto tipo SaaS: interfaz pulida,
dashboard, navegación modular, sesión persistente, permisos por rol, estados de
carga y error consistentes y una base preparada para crecer.

La primera versión no será multiempresa. El backend actual no posee entidades
de organización, membresía o `tenant_id`, por lo que todos los usuarios
autenticados comparten el mismo ámbito clínico según su rol. Convertirla en un
SaaS multi-tenant requerirá diseñar aislamiento de datos y autorización primero
en el backend; no se simulará esa separación únicamente en el cliente.

Antes de escribir código se consultará la documentación exacta de Expo SDK 57:

- <https://docs.expo.dev/versions/v57.0.0/>

## 3. Fuente de verdad

La fuente de verdad funcional y contractual será, en este orden:

1. El código y el OpenAPI del backend actual.
2. `backend_app_pneumonia/docs/seguimiento_backend.md`.
3. Las pruebas automatizadas del backend.
4. Los documentos históricos del backend.

Los mocks del móvil no definirán el contrato. Se actualizarán cuando cambie el
OpenAPI o el comportamiento validado del servidor.

## 4. Backend y URL base

Backend local:

```text
D:\respaldo\todo\python\fast_api_flask\backend_app_pneumonia
```

Frontend local:

```text
D:\respaldo\todo\python\fast_api_flask\mobile_app_pneumonia
```

La aplicación nueva consumirá exclusivamente la API versionada:

```text
{EXPO_PUBLIC_API_URL}/api/v1
```

Las rutas sin `/api/v1` son contratos heredados del backend y no se usarán para
nuevas funcionalidades.

En un dispositivo físico, `127.0.0.1` apunta al teléfono y no al equipo donde
se ejecuta FastAPI. En desarrollo se configurará la IP alcanzable del equipo o
una alternativa segura de conexión. En producción se usará HTTPS.

## 5. Estado inicial encontrado

El frontend utiliza actualmente:

- Expo `~57.0.16`.
- React Native `0.86.2`.
- React `19.2.3`.
- TypeScript `~6.0.3`.

El proyecto contiene una pantalla inicial, colores, un cliente HTTP mínimo y
tipos provisionales. Todavía no cuenta con navegación, manejo de sesión,
formularios, caché de servidor, almacenamiento seguro ni carga de imágenes.

Los tipos actuales no coinciden con el backend. Por ejemplo, los identificadores
reales de usuarios y pacientes son cadenas, y los DTO usan nombres como
`user_id`, `patient_id`, `full_name` y `age_months`.

El cliente HTTP actual también deberá reemplazarse porque todavía no maneja:

- El prefijo `/api/v1`.
- `Authorization: Bearer`.
- El formato uniforme de errores.
- Respuestas `204 No Content`.
- Solicitudes `multipart/form-data`.
- Cancelación y expiración de sesión.

## 6. Alcance funcional

### Autenticación y usuarios

- Inicio de sesión mediante `POST /auth/login`.
- Restauración y validación de sesión con `GET /auth/me`.
- Cierre de sesión local seguro.
- Cambio de contraseña propia.
- Administración de usuarios únicamente para administradores.
- El registro público no formará parte del flujo normal de producción.

### Pacientes

- Listado paginado mediante `GET /patients/page`.
- Búsqueda, filtros y ordenamiento.
- Alta, detalle y edición.
- Desactivación lógica con confirmación.
- Acciones condicionadas por rol, sin sustituir la autorización del backend.

### Evaluaciones

- Registro de datos clínicos con `POST /evaluations`.
- Presentación de severidad y probabilidades tabulares.
- Historial paginado y filtrado.
- Detalle de evaluación.
- Prevención de envíos duplicados.

### Radiografías

- Selección inicial desde archivos o galería.
- Validación de formato y tamaño antes de enviar.
- Carga como `multipart/form-data`.
- Presentación del resultado CNN y de la integración clínica.
- Consulta autenticada de metadatos e imagen.
- Manejo explícito de imagen duplicada, inválida y modelo no disponible.

La captura directa con cámara se evaluará después de validar el flujo clínico
con usuarios reales.

### Resultados, reportes y dashboard

- Resultado tabular y radiográfico presentados por separado.
- Severidad final, concordancia, explicación y recomendación del backend.
- Aviso visible de apoyo a la decisión clínica.
- Reporte consolidado por evaluación.
- Dashboard y administración después de cerrar el flujo clínico principal.

## 7. Roles y permisos

| Rol | ID | Lectura clínica | Escritura clínica | Usuarios |
|---|---:|---|---|---|
| Administrador | 1 | Sí | Sí | Administración completa |
| Especialista | 2 | Sí | Sí | No |
| Lectura | 3 | Sí | No | No |

La interfaz ocultará o deshabilitará acciones no aplicables, pero siempre
procesará correctamente un `403` porque el servidor es la autoridad final.

## 8. Arquitectura propuesta

La navegación se organizará con Expo Router y la lógica por funcionalidad.

```text
app/
├── _layout.tsx
├── (public)/
│   └── login.tsx
└── (authenticated)/
    ├── _layout.tsx
    ├── patients/
    ├── evaluations/
    ├── dashboard/
    └── administration/

src/
├── api/
│   ├── client.ts
│   ├── errors.ts
│   ├── contracts/
│   └── endpoints/
├── components/
├── features/
│   ├── auth/
│   ├── patients/
│   ├── evaluations/
│   ├── radiographs/
│   ├── reports/
│   ├── dashboard/
│   └── users/
├── storage/
├── theme/
├── validation/
└── testing/
    ├── fixtures/
    └── handlers/
```

Se distinguirán tres tipos de estructuras:

- DTO: contrato exacto de la API en `snake_case`.
- Payload: cuerpo exacto enviado al backend.
- Modelo de interfaz: representación derivada para componentes cuando resulte
  necesaria.

Las conversiones entre estructuras serán explícitas y estarán probadas.

## 9. Stack previsto

La selección final y las versiones se confirmarán con la documentación de Expo
SDK 57 antes de instalarlas:

- Expo Router para navegación.
- TanStack Query para estado remoto, caché y mutaciones.
- React Hook Form para formularios.
- Zod para validación estructural del cliente.
- Expo SecureStore para el token.
- Expo ImagePicker o la alternativa adecuada de SDK 57 para seleccionar
  imágenes.
- `fetch` mediante un cliente centralizado, salvo que aparezca una necesidad
  concreta que justifique Axios.
- Jest y React Native Testing Library para pruebas.

No se duplicarán reglas clínicas en Zod. Solo se validarán tipos, campos
obligatorios y rangos estructurales publicados por el backend.

## 10. Estrategia de integración y mocks

Se trabajará contra el backend real desde el primer corte vertical. Los mocks se
usarán como herramienta de desarrollo y pruebas, no como backend principal.

Fixtures mínimas requeridas:

- Login válido e inválido.
- Token vencido y respuesta `401`.
- Permiso insuficiente `403`.
- Errores de validación `422`.
- Listas vacías y paginadas.
- Red lenta o desconectada.
- Severidad baja, media y alta.
- Resultado con y sin radiografía.
- Concordancia y discordancia.
- Radiografía duplicada `409`.
- CNN no disponible `503`.

Cuando sea posible, los contratos de prueba se contrastarán con un snapshot de
`openapi.json` y con una instancia de backend destinada a pruebas.

## 11. Fases de implementación

### Fase M0 — Contrato y conectividad

- Consultar las secciones aplicables de Expo SDK 57.
- Obtener un snapshot de `/openapi.json`.
- Inventariar DTO, payloads, errores y códigos HTTP.
- Definir ambientes y URL base.
- Probar conectividad desde emulador y teléfono físico.
- Confirmar ejecución local segura del backend sin exponer SQL Server.

El avance y los hallazgos de esta fase se registran en
`docs/fase_m0_contrato_y_conectividad.md`.

### Fase M1 — Fundación técnica

- Reorganizar el proyecto para Expo Router.
- Configurar alias, lint y formato.
- Implementar cliente HTTP tipado.
- Incorporar SecureStore y restauración de sesión.
- Incorporar TanStack Query.
- Incorporar formularios y validación.
- Crear tema y estados comunes de carga, vacío y error.
- Configurar pruebas.

### Fase M2 — Primer corte vertical

```text
Login real
  → almacenamiento seguro del token
  → validación con /auth/me
  → listado paginado real de pacientes
  → detalle de paciente
  → cierre de sesión
```

Este corte validará red, sesión, autorización, errores, navegación y caché antes
de implementar formularios clínicos complejos.

### Fase M3 — Gestión de pacientes

- Alta, edición y desactivación.
- Búsqueda con espera controlada.
- Filtros y paginación.
- Permisos por rol.
- Pruebas de validación y mutaciones.

### Fase M4 — Evaluación clínica

- Formulario dividido en secciones clínicas.
- Controles numéricos y booleanos adecuados.
- Confirmación previa y bloqueo de doble envío.
- Resultado tabular y probabilidades.
- Historial del paciente.

### Fase M5 — Radiografía e integración

- Selección, vista previa y reemplazo.
- Validación JPG/PNG y límite vigente del backend.
- Carga multipart y progreso cuando la plataforma lo permita de forma fiable.
- Resultado CNN, resultado integrado y decisión auxiliar.
- Gestión segura de archivos temporales y caché.

### Fase M6 — Reporte y módulos secundarios

- Reporte consolidado por evaluación.
- Dashboard por periodo.
- Administración de usuarios para rol administrador.
- Cambio y restablecimiento de contraseña.

### Fase M7 — Endurecimiento y distribución

- Pruebas de integración y componentes.
- Pruebas con red lenta, desconexión y expiración de token.
- Accesibilidad y usabilidad clínica.
- Revisión de privacidad, logs y almacenamiento.
- Perfiles development, preview y production.
- Builds y pruebas en dispositivos Android objetivo.

## 12. Decisiones aplazadas

- Captura de radiografías con cámara.
- Modo offline y cola de mutaciones clínicas.
- Autenticación biométrica o bloqueo por inactividad.
- Prevención de capturas de pantalla en vistas sensibles.
- Exportación PDF.
- Recuperación de contraseña por correo.
- Analítica o monitoreo móvil.

Estas decisiones requieren validación clínica, operativa o de seguridad antes de
incorporarse.

## 13. Riesgos y restricciones

- Las recomendaciones clínicas continúan sujetas a validación formal.
- No existe todavía una política definitiva de auditoría y retención de
  radiografías.
- El modo offline puede almacenar datos clínicos sensibles y no se habilitará
  sin cifrado y reglas de sincronización aprobadas.
- No se registrarán tokens, contraseñas, radiografías ni datos clínicos en logs.
- Las imágenes protegidas necesitarán una estrategia autenticada que evite caché
  persistente innecesaria.
- La app nunca se conectará directamente a SQL Server.
- Producción requerirá HTTPS y registro público deshabilitado.

## 14. Criterio de terminado

Una pantalla o flujo se considerará terminado cuando:

- Consuma `/api/v1` y el contrato vigente.
- Contemple carga, vacío, éxito y error.
- Procese `401`, `403`, `409`, `422` y `503` cuando sean aplicables.
- Evite envíos duplicados.
- Respete roles y permisos.
- No exponga información sensible.
- Tenga pruebas proporcionales a su riesgo.
- Funcione en al menos un dispositivo Android objetivo.
- Sea accesible y no comunique severidad únicamente mediante color.
- Esté clasificado como estable o provisional.

## 15. Próximo paso aprobado

Comenzar la Fase M0 y, al cerrarla, ejecutar el primer corte vertical:

```text
Contrato/OpenAPI
  → cliente HTTP
  → sesión segura
  → login real
  → pacientes reales
```

El plan es un documento vivo. Cada fase cerrada debe registrar fecha, cambios,
pruebas ejecutadas, decisiones tomadas, pendientes y siguiente fase.
