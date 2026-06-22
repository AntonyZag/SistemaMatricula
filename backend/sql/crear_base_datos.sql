IF DB_ID('SistemaMatriculaDB') IS NULL
BEGIN
    CREATE DATABASE SistemaMatriculaDB;
END;
GO

USE SistemaMatriculaDB;
GO

IF OBJECT_ID('dbo.Solicitudes', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Solicitudes (
        codigo NVARCHAR(30) NOT NULL PRIMARY KEY,
        nombreEstudiante NVARCHAR(150) NOT NULL,
        dniEstudiante NVARCHAR(20) NOT NULL,
        fechaNacimiento NVARCHAR(20) NULL,
        grado NVARCHAR(80) NOT NULL,
        institucion NVARCHAR(180) NOT NULL,

        nombreApoderado NVARCHAR(150) NOT NULL,
        dniApoderado NVARCHAR(20) NOT NULL,
        telefono NVARCHAR(30) NOT NULL,
        correo NVARCHAR(150) NULL,
        parentesco NVARCHAR(80) NULL,

        estado NVARCHAR(30) NOT NULL CONSTRAINT DF_Solicitudes_estado DEFAULT 'En revision',
        fechaRegistro NVARCHAR(30) NOT NULL,

        archivoDniEstudiante NVARCHAR(255) NULL,
        archivoDniApoderado NVARCHAR(255) NULL,
        archivoCertificado NVARCHAR(255) NULL,
        observacion NVARCHAR(MAX) NULL,

        creadoEn DATETIME2 NOT NULL CONSTRAINT DF_Solicitudes_creadoEn DEFAULT SYSDATETIME(),
        actualizadoEn DATETIME2 NULL
    );
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_Solicitudes_dniApoderado'
      AND object_id = OBJECT_ID('dbo.Solicitudes')
)
BEGIN
    CREATE INDEX IX_Solicitudes_dniApoderado
    ON dbo.Solicitudes (dniApoderado);
END;
GO
