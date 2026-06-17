import { Injectable } from '@angular/core';
import { Solicitud } from '../models/solicitud';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {


  private solicitudes: Solicitud[] = [];

  constructor() {
    const datosGuardados = localStorage.getItem('solicitudes');

    if (datosGuardados) {
      this.solicitudes = JSON.parse(datosGuardados);
    }
  }

  registrarSolicitud(solicitud: Solicitud) {

    this.solicitudes.push(solicitud);

    localStorage.setItem(
      'solicitudes',
      JSON.stringify(this.solicitudes)
    );

  }

  listarSolicitudes(): Solicitud[] {
    return this.solicitudes;
  }

  actualizarSolicitudes() {
    localStorage.setItem('solicitudes', JSON.stringify(this.solicitudes));
  }

  eliminarSolicitud(codigo: string) {
    this.solicitudes = this.solicitudes.filter(s => s.codigo !== codigo);
    this.actualizarSolicitudes();
  }

  generarCodigo(): string {
    const numero = this.solicitudes.length + 126;
    return `MAT-2024-${numero.toString().padStart(6, '0')}`;
  }
}

