USE SistemaMatriculaDB;
GO

SELECT
    solicitud.codigo,
    estudiante.nombreEstudiante,
    estudiante.dniEstudiante,
    apoderado.nombreApoderado,
    apoderado.dniApoderado,
    solicitud.estado,
    solicitud.observacion,
    documentos.archivoDniEstudiante,
    documentos.archivoDniApoderado,
    documentos.archivoCertificado
FROM dbo.Solicitudes solicitud
INNER JOIN dbo.Estudiantes estudiante
    ON estudiante.idEstudiante = solicitud.idEstudiante
INNER JOIN dbo.Apoderados apoderado
    ON apoderado.idApoderado = solicitud.idApoderado
LEFT JOIN dbo.DocumentosSolicitud documentos
    ON documentos.codigoSolicitud = solicitud.codigo
WHERE solicitud.codigo = 'MAT-2024-000126'
   OR estudiante.nombreEstudiante LIKE N'%Antony%'
   OR apoderado.nombreApoderado LIKE N'%Maritza%'
   OR documentos.archivoDniEstudiante LIKE N'%ejemplo%'
   OR solicitud.observacion LIKE N'%Falta certificado%';
GO

-- Ejecutar este DELETE solo si los registros listados arriba son datos de prueba.
-- Al eliminar una solicitud, DocumentosSolicitud se elimina por la relacion ON DELETE CASCADE.
-- DELETE solicitud
-- FROM dbo.Solicitudes solicitud
-- INNER JOIN dbo.Estudiantes estudiante
--     ON estudiante.idEstudiante = solicitud.idEstudiante
-- INNER JOIN dbo.Apoderados apoderado
--     ON apoderado.idApoderado = solicitud.idApoderado
-- LEFT JOIN dbo.DocumentosSolicitud documentos
--     ON documentos.codigoSolicitud = solicitud.codigo
-- WHERE solicitud.codigo = 'MAT-2024-000126'
--    OR estudiante.nombreEstudiante LIKE N'%Antony%'
--    OR apoderado.nombreApoderado LIKE N'%Maritza%'
--    OR documentos.archivoDniEstudiante LIKE N'%ejemplo%'
--    OR solicitud.observacion LIKE N'%Falta certificado%';
-- GO
