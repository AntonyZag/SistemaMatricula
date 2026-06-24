# SistemaMatricula

Sistema local de matrícula escolar desarrollado para Programación Web.

## Tecnologías

- Frontend: Angular 21
- Backend: FastAPI
- Base de datos: SQL Server local
- Conexión: Angular -> FastAPI -> SQL Server

## Base de datos

La base usada por el proyecto es:

```txt
SistemaMatriculaDB
```

Tabla principal:

```txt
dbo.Solicitudes
```

Para ver los registros en SQL Server Management Studio:

```sql
USE SistemaMatriculaDB;

SELECT *
FROM dbo.Solicitudes;
```

El script de creación y actualización de la base está en:

```txt
backend/sql/crear_base_datos.sql
```

## Levantar backend

Desde una terminal:

```powershell
cd backend
uv run uvicorn main:app
```

URLs útiles:

```txt
http://127.0.0.1:8000
http://127.0.0.1:8000/docs
```

Swagger (`/docs`) permite probar la API FastAPI.

## Levantar frontend

Desde otra terminal:

```powershell
cd frontend
npm start
```

Abrir:

```txt
http://localhost:4200
```

## Flujo de prueba recomendado

1. Ingresar como apoderado.
2. Registrar una solicitud de matrícula.
3. Revisar la solicitud en Seguimiento.
4. Ingresar como administrativo.
5. Revisar Dashboard.
6. Aprobar, observar o eliminar una solicitud.
7. Confirmar cambios en SQL Server con `SELECT * FROM dbo.Solicitudes;`.

## Estados válidos

El sistema usa estos estados:

```txt
En revisión
Aprobado
Observado
```

## Limpieza de datos de prueba

Existe un script de apoyo en:

```txt
backend/sql/limpiar_datos_prueba.sql
```

Primero muestra posibles datos de prueba. El bloque `DELETE` está comentado para evitar borrados accidentales.
