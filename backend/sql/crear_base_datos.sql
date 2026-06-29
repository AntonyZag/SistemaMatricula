IF DB_ID('SistemaMatriculaDB') IS NULL
BEGIN
    CREATE DATABASE SistemaMatriculaDB;
END;
GO

USE SistemaMatriculaDB;
GO

IF OBJECT_ID('dbo.Solicitudes', 'U') IS NOT NULL
   AND COL_LENGTH('dbo.Solicitudes', 'idEstudiante') IS NULL
BEGIN
    IF OBJECT_ID('dbo.Solicitudes_Backup', 'U') IS NULL
    BEGIN
        SELECT *
        INTO dbo.Solicitudes_Backup
        FROM dbo.Solicitudes;
    END;

    IF OBJECT_ID('dbo.Solicitudes_Original', 'U') IS NULL
    BEGIN
        EXEC sp_rename 'dbo.Solicitudes', 'Solicitudes_Original';
    END;
END;
GO

IF OBJECT_ID('dbo.Apoderados', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Apoderados (
        idApoderado INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        nombreApoderado NVARCHAR(150) NOT NULL,
        dniApoderado NVARCHAR(20) NOT NULL,
        telefono NVARCHAR(30) NOT NULL,
        correo NVARCHAR(150) NULL,
        parentesco NVARCHAR(80) NULL,
        creadoEn DATETIME2 NOT NULL CONSTRAINT DF_Apoderados_creadoEn DEFAULT SYSDATETIME(),
        actualizadoEn DATETIME2 NULL
    );
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'UX_Apoderados_dniApoderado'
      AND object_id = OBJECT_ID('dbo.Apoderados')
)
BEGIN
    CREATE UNIQUE INDEX UX_Apoderados_dniApoderado
    ON dbo.Apoderados (dniApoderado);
END;
GO

IF OBJECT_ID('dbo.Estudiantes', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Estudiantes (
        idEstudiante INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        nombreEstudiante NVARCHAR(150) NOT NULL,
        dniEstudiante NVARCHAR(20) NOT NULL,
        fechaNacimiento NVARCHAR(20) NULL,
        grado NVARCHAR(80) NOT NULL,
        institucion NVARCHAR(180) NOT NULL,
        creadoEn DATETIME2 NOT NULL CONSTRAINT DF_Estudiantes_creadoEn DEFAULT SYSDATETIME(),
        actualizadoEn DATETIME2 NULL
    );
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'UX_Estudiantes_dniEstudiante'
      AND object_id = OBJECT_ID('dbo.Estudiantes')
)
BEGIN
    CREATE UNIQUE INDEX UX_Estudiantes_dniEstudiante
    ON dbo.Estudiantes (dniEstudiante);
END;
GO

IF OBJECT_ID('dbo.Solicitudes', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Solicitudes (
        codigo NVARCHAR(30) NOT NULL PRIMARY KEY,
        idEstudiante INT NOT NULL,
        idApoderado INT NOT NULL,
        estado NVARCHAR(30) NOT NULL CONSTRAINT DF_Solicitudes_Normalizada_estado DEFAULT N'En revisión',
        fechaRegistro NVARCHAR(30) NOT NULL,
        observacion NVARCHAR(MAX) NULL,
        creadoEn DATETIME2 NOT NULL CONSTRAINT DF_Solicitudes_Normalizada_creadoEn DEFAULT SYSDATETIME(),
        actualizadoEn DATETIME2 NULL,

        CONSTRAINT FK_Solicitudes_Estudiantes
            FOREIGN KEY (idEstudiante)
            REFERENCES dbo.Estudiantes (idEstudiante),

        CONSTRAINT FK_Solicitudes_Apoderados
            FOREIGN KEY (idApoderado)
            REFERENCES dbo.Apoderados (idApoderado),

        CONSTRAINT CK_Solicitudes_Normalizada_estado
            CHECK (estado IN (N'En revisión', N'Aprobado', N'Observado'))
    );
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_Solicitudes_idEstudiante'
      AND object_id = OBJECT_ID('dbo.Solicitudes')
)
BEGIN
    CREATE INDEX IX_Solicitudes_idEstudiante
    ON dbo.Solicitudes (idEstudiante);
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_Solicitudes_idApoderado'
      AND object_id = OBJECT_ID('dbo.Solicitudes')
)
BEGIN
    CREATE INDEX IX_Solicitudes_idApoderado
    ON dbo.Solicitudes (idApoderado);
END;
GO

IF OBJECT_ID('dbo.DocumentosSolicitud', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.DocumentosSolicitud (
        idDocumento INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        codigoSolicitud NVARCHAR(30) NOT NULL,
        archivoDniEstudiante NVARCHAR(255) NULL,
        archivoDniApoderado NVARCHAR(255) NULL,
        archivoCertificado NVARCHAR(255) NULL,
        creadoEn DATETIME2 NOT NULL CONSTRAINT DF_DocumentosSolicitud_creadoEn DEFAULT SYSDATETIME(),
        actualizadoEn DATETIME2 NULL,

        CONSTRAINT FK_DocumentosSolicitud_Solicitudes
            FOREIGN KEY (codigoSolicitud)
            REFERENCES dbo.Solicitudes (codigo)
            ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'UX_DocumentosSolicitud_codigoSolicitud'
      AND object_id = OBJECT_ID('dbo.DocumentosSolicitud')
)
BEGIN
    CREATE UNIQUE INDEX UX_DocumentosSolicitud_codigoSolicitud
    ON dbo.DocumentosSolicitud (codigoSolicitud);
END;
GO

IF OBJECT_ID('dbo.Solicitudes_Original', 'U') IS NOT NULL
BEGIN
    UPDATE dbo.Solicitudes_Original
    SET estado = N'En revisión'
    WHERE UPPER(REPLACE(estado, N'Ó', N'O')) IN (N'EN REVISION', N'EN REVISIÓN')
       OR estado IN (N'En revision', N'En revisiÃ³n', N'En revisiÃƒÂ³n');

    UPDATE dbo.Solicitudes_Original
    SET estado = N'Aprobado'
    WHERE UPPER(estado) = N'APROBADO';

    UPDATE dbo.Solicitudes_Original
    SET estado = N'Observado'
    WHERE UPPER(estado) = N'OBSERVADO';
END;
GO

IF OBJECT_ID('dbo.Solicitudes_Original', 'U') IS NOT NULL
BEGIN
    WITH ApoderadosOrigen AS (
        SELECT *,
            ROW_NUMBER() OVER (
                PARTITION BY dniApoderado
                ORDER BY codigo DESC
            ) AS fila
        FROM dbo.Solicitudes_Original
        WHERE dniApoderado IS NOT NULL
          AND LTRIM(RTRIM(dniApoderado)) <> ''
    )
    INSERT INTO dbo.Apoderados (
        nombreApoderado,
        dniApoderado,
        telefono,
        correo,
        parentesco
    )
    SELECT
        nombreApoderado,
        dniApoderado,
        telefono,
        correo,
        parentesco
    FROM ApoderadosOrigen origen
    WHERE fila = 1
      AND NOT EXISTS (
        SELECT 1
        FROM dbo.Apoderados destino
        WHERE destino.dniApoderado = origen.dniApoderado
      );
END;
GO

IF OBJECT_ID('dbo.Solicitudes_Original', 'U') IS NOT NULL
BEGIN
    WITH EstudiantesOrigen AS (
        SELECT *,
            ROW_NUMBER() OVER (
                PARTITION BY dniEstudiante
                ORDER BY codigo DESC
            ) AS fila
        FROM dbo.Solicitudes_Original
        WHERE dniEstudiante IS NOT NULL
          AND LTRIM(RTRIM(dniEstudiante)) <> ''
    )
    INSERT INTO dbo.Estudiantes (
        nombreEstudiante,
        dniEstudiante,
        fechaNacimiento,
        grado,
        institucion
    )
    SELECT
        nombreEstudiante,
        dniEstudiante,
        fechaNacimiento,
        grado,
        institucion
    FROM EstudiantesOrigen origen
    WHERE fila = 1
      AND NOT EXISTS (
        SELECT 1
        FROM dbo.Estudiantes destino
        WHERE destino.dniEstudiante = origen.dniEstudiante
      );
END;
GO

IF OBJECT_ID('dbo.Solicitudes_Original', 'U') IS NOT NULL
BEGIN
    INSERT INTO dbo.Solicitudes (
        codigo,
        idEstudiante,
        idApoderado,
        estado,
        fechaRegistro,
        observacion,
        creadoEn,
        actualizadoEn
    )
    SELECT
        origen.codigo,
        estudiante.idEstudiante,
        apoderado.idApoderado,
        origen.estado,
        origen.fechaRegistro,
        origen.observacion,
        origen.creadoEn,
        origen.actualizadoEn
    FROM dbo.Solicitudes_Original origen
    INNER JOIN dbo.Estudiantes estudiante
        ON estudiante.dniEstudiante = origen.dniEstudiante
    INNER JOIN dbo.Apoderados apoderado
        ON apoderado.dniApoderado = origen.dniApoderado
    WHERE NOT EXISTS (
        SELECT 1
        FROM dbo.Solicitudes destino
        WHERE destino.codigo = origen.codigo
    );
END;
GO

IF OBJECT_ID('dbo.Solicitudes_Original', 'U') IS NOT NULL
BEGIN
    INSERT INTO dbo.DocumentosSolicitud (
        codigoSolicitud,
        archivoDniEstudiante,
        archivoDniApoderado,
        archivoCertificado
    )
    SELECT
        origen.codigo,
        origen.archivoDniEstudiante,
        origen.archivoDniApoderado,
        origen.archivoCertificado
    FROM dbo.Solicitudes_Original origen
    INNER JOIN dbo.Solicitudes solicitud
        ON solicitud.codigo = origen.codigo
    WHERE NOT EXISTS (
        SELECT 1
        FROM dbo.DocumentosSolicitud destino
        WHERE destino.codigoSolicitud = origen.codigo
    );
END;
GO
