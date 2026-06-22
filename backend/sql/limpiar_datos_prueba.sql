USE SistemaMatriculaDB;
GO

SELECT *
FROM dbo.Solicitudes
WHERE codigo = 'MAT-2024-000126'
   OR nombreEstudiante LIKE N'%Antony%'
   OR nombreApoderado LIKE N'%Maritza%'
   OR archivoDniEstudiante LIKE N'%ejemplo%'
   OR observacion LIKE N'%Falta certificado%';
GO

-- Ejecutar este DELETE solo si los registros listados arriba son datos de prueba.
-- DELETE FROM dbo.Solicitudes
-- WHERE codigo = 'MAT-2024-000126'
--    OR nombreEstudiante LIKE N'%Antony%'
--    OR nombreApoderado LIKE N'%Maritza%'
--    OR archivoDniEstudiante LIKE N'%ejemplo%'
--    OR observacion LIKE N'%Falta certificado%';
-- GO
