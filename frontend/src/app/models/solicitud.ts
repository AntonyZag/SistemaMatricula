export interface Solicitud {
  codigo: string;
  nombreEstudiante: string;
  dniEstudiante: string;
  fechaNacimiento: string;
  grado: string;
  institucion: string;

  nombreApoderado: string;
  dniApoderado: string;
  telefono: string;
  correo: string;
  parentesco: string;

  estado: 'En revisión' | 'En revision' | 'En revisiÃ³n' | 'Aprobado' | 'Observado';
  fechaRegistro: string;

  archivoDniEstudiante?: string;
  archivoDniApoderado?: string;
  archivoCertificado?: string;
  observacion?: string;

}
