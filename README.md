# Mobile App Pneumonia

Aplicación móvil Expo + React Native + TypeScript, ubicada como proyecto hermano del backend.

## Ejecutar

1. Copia `.env.example` como `.env` y cambia `EXPO_PUBLIC_API_URL` por la IP local del equipo que ejecuta FastAPI.
2. Inicia el backend con acceso desde la red local.
3. Ejecuta `npm start` y abre el proyecto con Expo Go o un emulador.

En un teléfono físico no uses `127.0.0.1` para el backend: esa dirección apunta al propio teléfono.

## Organización

- `src/api`: cliente HTTP y contratos compartidos.
- `src/components`: componentes reutilizables.
- `src/features`: módulos de negocio.
- `src/navigation`: navegación pública y autenticada.
- `src/screens`: pantallas de nivel superior.
- `src/storage`: almacenamiento seguro local.
- `src/theme`: identidad visual.
- `src/types`: tipos globales.
