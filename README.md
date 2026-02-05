# dashboard-app

Aplicación web desarrollada con Angular e Ionic.

## ¿Qué es?

Es una app donde puedes:

- Registrarte y acceder con usuario y contraseña.
- Ver y editar tu perfil.
- Crear, ver y gestionar tareas en tu dashboard personal.
- Personalizar tu logo.
- Usar filtros y ver tareas importantes seleccionadas por IA.

## Características principales

- **Login y registro**: Acceso seguro con autenticación.
- **Dashboard**: Visualiza y organiza tus tareas.
- **Edición de perfil**: Cambia tus datos y personaliza tu logo.
- **Interfaz moderna**: Basada en Ionic.
- **Protección de rutas**: Solo usuarios autenticados pueden acceder al dashboard.

## ¿Cómo usar?

1. Instala las dependencias:
   ```
   npm install
   ```
2. Inicia la app en modo desarrollo:
   ```
   ionic serve
   ```
3. Abre en tu navegador: [http://localhost:8100]

## Notas

- Necesita una API backend para funcionar [https://github.com/BryanJChuquimarca/dashboard-api] (verifica la URL en `src/environments/environment.ts`).
- Puedes personalizar el logo desde la sección de perfil.
