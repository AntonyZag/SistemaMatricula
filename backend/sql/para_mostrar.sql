
/*USAREMOS ESTO SOLO PARA PODER MOSTRAR, BUENO PARA NO ESCRIBIR Y DEMORARNOS EN EXPOSICION

ESTO PARA MOSTRAR TABLAS POR SEPARADO 

USE SistemaMatriculaDB;
GO

SELECT * FROM dbo.Apoderados;
SELECT * FROM dbo.Estudiantes;
SELECT * FROM dbo.Solicitudes;
SELECT * FROM dbo.DocumentosSolicitud;
GO

############################################

Y AQUI USAMOS ESTO PARA UNIR LAS TABLAS Y MOSTRAR EN FILA TODO.

SELECT
    s.codigo,
    e.nombreEstudiante,
    e.dniEstudiante,
    e.fechaNacimiento,
    e.grado,
    e.institucion,
    a.nombreApoderado,
    a.dniApoderado,
    a.telefono,
    a.correo,
    a.parentesco,
    s.estado,
    s.fechaRegistro,
    d.archivoDniEstudiante,
    d.archivoDniApoderado,
    d.archivoCertificado,
    s.observacion
FROM dbo.Solicitudes AS s
INNER JOIN dbo.Estudiantes AS e
    ON e.idEstudiante = s.idEstudiante
INNER JOIN dbo.Apoderados AS a
    ON a.idApoderado = s.idApoderado
LEFT JOIN dbo.DocumentosSolicitud AS d
    ON d.codigoSolicitud = s.codigo;
GO