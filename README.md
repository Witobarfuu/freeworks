# FreeWorks

**FreeWorks** es una aplicación web orientada a la gestión de proyectos para trabajadores freelance. Permite centralizar proyectos, clientes, entregables, estados, prioridades, fechas límite y alertas dentro de una misma plataforma.

El proyecto fue desarrollado utilizando una arquitectura separada entre frontend y backend, implementando **Angular** para la interfaz de usuario y **Django REST Framework** para la API REST.

---

## Características principales

FreeWorks incorpora las siguientes funcionalidades:

- Dashboard general con indicadores de proyectos.
- Registro, edición y visualización de proyectos.
- Gestión de clientes.
- Gestión de entregables asociados a proyectos.
- Seguimiento del progreso de los proyectos.
- Estados de proyectos y entregables.
- Clasificación por prioridad.
- Búsqueda y filtrado de proyectos.
- Detección automática de proyectos atrasados.
- Detección automática de entregables atrasados.
- Sistema de alertas.
- Contadores y estadísticas generales.
- Preferencias de usuario.
- Interfaz responsive.
- Comunicación entre Angular y Django mediante API REST.
- Ejecución mediante Docker y Docker Compose.

---

## Tecnologías utilizadas

### Frontend

- Angular
- TypeScript
- HTML5
- CSS3
- Angular Router
- HttpClient

### Backend

- Python
- Django
- Django REST Framework
- SQLite

### Herramientas

- Git
- GitHub
- Docker
- Docker Compose
- Visual Studio Code

---

## Arquitectura

FreeWorks utiliza una arquitectura cliente-servidor.

```text
┌──────────────────────┐
│       Angular        │
│      Frontend        │
│     Puerto 4200      │
└──────────┬───────────┘
           │
           │ HTTP / API REST
           ▼
┌──────────────────────┐
│ Django REST Framework│
│       Backend        │
│     Puerto 8000      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│       SQLite         │
│   Base de datos      │
└──────────────────────┘
```

El frontend consume los recursos proporcionados por la API REST desarrollada con Django REST Framework.

---

## Estructura del proyecto

```text
freeworks/
│
├── backend/
│   ├── config/
│   ├── projects/
│   │   ├── migrations/
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views.py
│   │
│   ├── db.sqlite3
│   ├── Dockerfile
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   └── app/
│   │       ├── features/
│   │       └── shared/
│   │
│   ├── Dockerfile
│   ├── angular.json
│   ├── package.json
│   └── package-lock.json
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## Módulos principales

### Dashboard

Entrega una visión general del estado de los proyectos mediante indicadores como:

- Proyectos totales.
- Proyectos en progreso.
- Proyectos finalizados.
- Proyectos atrasados.
- Progreso general.
- Entregables completados y pendientes.
- Distribución de proyectos por estado.
- Actividad reciente.

### Proyectos

Permite:

- Crear proyectos.
- Editar proyectos.
- Consultar detalles.
- Asignar clientes.
- Definir prioridades.
- Definir estados.
- Establecer fechas límite.
- Visualizar progreso.
- Buscar proyectos.
- Filtrar por cliente.
- Filtrar por estado.
- Filtrar por prioridad.

### Entregables

Cada proyecto puede contener entregables que permiten dividir y controlar el trabajo realizado.

El módulo permite administrar:

- Nombre del entregable.
- Descripción.
- Proyecto asociado.
- Fecha límite.
- Estado.
- Cumplimiento.

El progreso de los proyectos puede calcularse utilizando el estado de sus entregables.

### Clientes

Permite registrar y administrar los clientes relacionados con los proyectos.

Entre la información manejada se encuentra:

- Nombre.
- Empresa.
- Correo electrónico.
- Proyectos asociados.

### Alertas

FreeWorks detecta elementos que requieren atención, incluyendo:

- Proyectos atrasados.
- Entregables atrasados.
- Fechas límite superadas.

El sistema presenta un contador de alertas y permite acceder al elemento relacionado.

### Preferencias

Incluye opciones relacionadas con el perfil y comportamiento visual del sistema, tales como:

- Información del freelancer.
- Preferencias de notificaciones.
- Visualización del estado del sistema.
- Modo compacto.

---

## Ejecución local

### Requisitos

Para ejecutar el proyecto localmente se requiere:

- Python 3
- Node.js
- npm
- Angular CLI

---

### Backend

Desde la raíz del proyecto:

```powershell
cd backend
```

Crear un entorno virtual:

```powershell
python -m venv venv
```

Activarlo en Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Instalar dependencias:

```powershell
pip install -r requirements.txt
```

Aplicar migraciones:

```powershell
python manage.py migrate
```

Ejecutar Django:

```powershell
python manage.py runserver
```

El backend estará disponible en:

```text
http://localhost:8000
```

---

### Frontend

Abrir otra terminal y ejecutar:

```powershell
cd frontend
npm install
npm start
```

El frontend estará disponible en:

```text
http://localhost:4200
```

---

# Ejecución con Docker

FreeWorks puede ejecutarse utilizando Docker Compose, evitando tener que iniciar manualmente el frontend y backend.

## Requisitos

- Docker Desktop
- Docker Compose

Desde la raíz del proyecto ejecutar:

```powershell
docker compose up --build
```

Docker construirá e iniciará los servicios:

```text
freeworks-backend
freeworks-frontend
```

Una vez iniciados:

### Frontend

```text
http://localhost:4200
```

### Backend

```text
http://localhost:8000
```

Para verificar el estado de los contenedores:

```powershell
docker compose ps
```

Para detener FreeWorks:

```powershell
docker compose down
```

Para reconstruir completamente los servicios:

```powershell
docker compose down
docker compose up --build
```

---

## API REST

El frontend se comunica con Django mediante una API REST.

Entre los recursos principales se encuentran:

```text
/api/projects/
/api/clients/
/api/deliverables/
```

La API permite realizar operaciones de consulta, creación, modificación y gestión de los recursos utilizados por FreeWorks.

---

## Lógica de negocio

FreeWorks incorpora lógica de negocio tanto en backend como en frontend.

Entre las principales reglas implementadas se encuentran:

- Relación entre clientes y proyectos.
- Relación entre proyectos y entregables.
- Cálculo de progreso.
- Clasificación de proyectos por estado.
- Gestión de prioridades.
- Identificación de fechas límite.
- Detección de proyectos atrasados.
- Detección de entregables atrasados.
- Generación de indicadores para el dashboard.
- Generación de alertas.

---

## Control de versiones

El desarrollo se realizó utilizando **Git y GitHub**.

Se utilizó una estrategia basada en ramas por funcionalidad, incluyendo:

```text
feature/project-setup
feature/backend-models
feature/backend-api
feature/frontend-layout
feature/projects
feature/deliverables
feature/comments
feature/clients
feature/alerts
feature/preferences
```

Las funcionalidades terminadas fueron posteriormente integradas en la rama:

```text
develop
```

Esto permite mantener un historial de desarrollo organizado y separar cada funcionalidad durante su implementación.

---

## Flujo general de FreeWorks

```text
Cliente
   │
   ▼
Proyecto
   │
   ├── Estado
   ├── Prioridad
   ├── Fecha límite
   └── Progreso
          │
          ▼
     Entregables
          │
          ├── Pendientes
          ├── Completados
          └── Atrasados
                 │
                 ▼
               Alertas
```

---

## Objetivo del proyecto

FreeWorks busca entregar a un trabajador freelance una herramienta sencilla para organizar sus compromisos profesionales desde una única plataforma.

El sistema permite mantener una visión centralizada del trabajo pendiente, proyectos activos, clientes, entregables y fechas límite, facilitando el seguimiento y priorización de las actividades.

---

## Estado del proyecto

**MVP funcional finalizado.**

Actualmente FreeWorks dispone de:

- Frontend Angular funcional.
- Backend Django REST funcional.
- Persistencia de datos.
- Gestión de proyectos.
- Gestión de clientes.
- Gestión de entregables.
- Dashboard.
- Alertas.
- Preferencias.
- API REST.
- Dockerización del frontend y backend.
- Control de versiones mediante Git y GitHub.

---

## Autor

**William Tobar**

Proyecto desarrollado como parte de un proceso académico de aplicación práctica de desarrollo frontend, backend, APIs REST, control de versiones y contenerización.