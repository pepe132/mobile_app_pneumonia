# Fase M1 — Fundación técnica

Última actualización: 2026-09-06.

Estado: **en progreso**.

## Implementado

- Expo Router como entrada principal mediante `expo-router/entry`.
- Grupos iniciales de rutas públicas y autenticadas.
- Provider global de TanStack Query.
- Safe Area Provider.
- Cliente HTTP centralizado con `/api/v1`.
- Inyección opcional de JWT Bearer.
- Soporte diferenciado para JSON y `FormData`.
- Interpretación del sobre uniforme de errores del backend.
- Soporte para respuestas `204 No Content`.
- Persistencia del token mediante Expo SecureStore.
- Plugin de ImagePicker con cámara y micrófono deshabilitados.
- Alias TypeScript `@/*`.
- Pantallas provisionales de entrada, acceso y espacio autenticado.
- Formulario real de login con React Hook Form y Zod.
- Restauración de sesión mediante `/auth/me`.
- Protección de rutas públicas y autenticadas.
- Pantalla autenticada mínima con usuario, rol y cierre de sesión.
- Identidad visual SaaS pediátrica en azul cielo.
- Navegación inferior para inicio, pacientes, evaluaciones y perfil.
- Dashboard inicial con resumen de pacientes.
- Listado real paginado de pacientes con búsqueda.
- Detalle real del paciente.
- Estados de carga, vacío y error en el listado clínico.
- Formulario reutilizable para alta y edición de pacientes.
- Desactivación lógica con confirmación y conservación del historial.
- Acciones de escritura ocultas para el rol de lectura.

## Dependencias instaladas

- Expo Router.
- Expo SecureStore.
- Expo ImagePicker.
- TanStack Query.
- React Hook Form.
- Zod.
- Dependencias nativas y web compatibles resueltas por Expo 57.

## Verificaciones

- `npx tsc --noEmit`: aprobado.
- `npx expo config --type public --json`: aprobado.
- Exportación web de humo con Metro y Expo Router: aprobada.
- El directorio generado por la prueba fue eliminado después de verificarlo.
- Conectividad con FastAPI y SQL Server: aprobada.
- Login real con usuario especialista: aprobado.
- Consulta paginada real de pacientes: aprobada; el servidor devolvió dos
  pacientes activos durante la verificación.

## Pendientes

- Actualizar Node.js a una versión admitida por React Native 0.86.2.
- Revisar las 13 vulnerabilidades moderadas reportadas por npm sin aplicar
  correcciones automáticas destructivas.
- Validar restauración y logout manualmente desde Expo Go.
- Definir contratos TypeScript completos de pacientes.
- Añadir configuración y pruebas automatizadas.
- Validar Android y dispositivo físico.

## Nota sobre archivos anteriores

`App.tsx` se conserva temporalmente porque tenía modificaciones previas. Ya no
es la entrada de ejecución: `package.json` apunta a `expo-router/entry`.
