# 🚗 UVAQ Parking Management System

Plataforma integral para la administración y control del estacionamiento de la **Universidad Vasco de Quiroga (UVAQ)**. Este sistema permite gestionar el flujo de vehículos, la asignación de espacios y el registro de usuarios (estudiantes y personal) de manera eficiente.

---

## 🛠️ Stack Tecnológico

El proyecto utiliza un stack moderno basado en JavaScript para garantizar velocidad y escalabilidad:

**Frontend:**
*   **Astro:** Framework orientado al rendimiento para una interfaz de usuario rápida y optimizada.

**Backend:**
*   **Node.js & Express:** Servidor robusto para el manejo de la lógica de negocio y APIs.
*   **Sequelize:** ORM para la gestión de modelos y relaciones.
*   **CORS:** Configuración de seguridad para el intercambio de recursos entre dominios.

**Base de Datos:**
*   **PostgreSQL:** Sistema de gestión de base de datos relacional para garantizar la integridad de los datos.

---

## 🚀 Características Principales

*   **Gestión de Usuarios:** Registro de alumnos y personal con datos académicos (matrícula, carrera, correo).
*   **Control de Vehículos:** Vinculación de uno o más vehículos por usuario.
*   **Monitoreo en Tiempo Real:** Visualización de espacios de estacionamiento disponibles y ocupados.
*   **Historial de Accesos:** Registro automático de entradas y salidas con marcas de tiempo.
*   **Panel Administrativo:** Interfaz para la gestión de permisos y estados de ocupación.

---

## 📂 Estructura del Proyecto

```text
├── backend
│   ├── src
│   │   ├── config     # Conexión a la DB (PostgreSQL)
│   │   ├── models     # Modelos de Sequelize (User, Vehicle, Log)
│   │   ├── controllers # Lógica de los endpoints
│   │   └── routes      # Definición de rutas de la API
│   └── index.js       # Punto de entrada del servidor
├── frontend
│   ├── src
│   │   ├── components # Componentes reutilizables
│   │   └── pages      # Vistas de la aplicación (Astro)
│   └── astro.config.mjs
└── .env               # Variables de entorno (no incluido en el repo)