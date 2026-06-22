export type EstadoSolicitud = 'En revisión' | 'Aprobado' | 'Observado';

export const ESTADO_EN_REVISION: EstadoSolicitud = 'En revisión';
export const ESTADO_APROBADO: EstadoSolicitud = 'Aprobado';
export const ESTADO_OBSERVADO: EstadoSolicitud = 'Observado';

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

  estado: EstadoSolicitud;
  fechaRegistro: string;

  archivoDniEstudiante?: string;
  archivoDniApoderado?: string;
  archivoCertificado?: string;
  observacion?: string;

}
