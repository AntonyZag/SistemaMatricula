import { Injectable } from '@angular/core';
import { Solicitud } from '../models/solicitud';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {

  private solicitudes: Solicitud[] = [
    {
      codigo: 'MAT-2024-000125',
      nombreEstudiante: 'María Pérez Gómez',
      dniEstudiante: '74581236',
      fechaNacimiento: '2017-05-10',
      grado: '1° Primaria',
      institucion: 'I.E. Mariscal Castilla',
      nombreApoderado: 'Juan Pérez',
      dniApoderado: '45678912',
      telefono: '987654321',
      correo: 'juanperez@gmail.com',
      parentesco: 'Padre',
      estado: 'En revisión',
      fechaRegistro: '23/11/2024'
    }
  ];

  registrarSolicitud(solicitud: Solicitud) {
    this.solicitudes.push(solicitud);
  }

  listarSolicitudes(): Solicitud[] {
    return this.solicitudes;
  }

  generarCodigo(): string {
    const numero = this.solicitudes.length + 126;
    return `MAT-2024-${numero.toString().padStart(6, '0')}`;
  }
}