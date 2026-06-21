import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { MatriculaService } from '../../services/matricula';
import { Solicitud } from '../../models/solicitud';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, Navbar, Footer],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  solicitudes: Solicitud[] = [];

  constructor(
    private matriculaService: MatriculaService,
    private router: Router
  ) {
    this.solicitudes = this.matriculaService.listarSolicitudes();
  }

  contarPorEstado(estado: string): number {
    return this.solicitudes.filter(s => s.estado === estado).length;
  }

  totalSolicitudes(): number {
    return this.solicitudes.length;
  }
  verSolicitud(solicitud: Solicitud) {
    Swal.fire({
      title: 'Detalle de solicitud',
      html: `
       <p><strong>Código:</strong> ${solicitud.codigo}</p>
       <p><strong>Estudiante:</strong> ${solicitud.nombreEstudiante}</p>
       <p><strong>DNI estudiante:</strong> ${solicitud.dniEstudiante}</p>
       <p><strong>Grado:</strong> ${solicitud.grado}</p>
       <p><strong>Institución:</strong> ${solicitud.institucion}</p>

       <p><strong>Apoderado:</strong> ${solicitud.nombreApoderado}</p>
       <p><strong>DNI apoderado:</strong> ${solicitud.dniApoderado}</p>
       <p><strong>Teléfono:</strong> ${solicitud.telefono}</p>

       <p><strong>Estado:</strong> ${solicitud.estado}</p>
       <p><strong>Observación:</strong> ${solicitud.observacion || 'Sin observaciones comentadas'}</p>

       <hr>

       <p><strong>Documentos enviados</strong></p>

       <p><strong>DNI estudiante:</strong> ${solicitud.archivoDniEstudiante || 'No registrado'}</p>

       <p><strong>DNI apoderado:</strong> ${solicitud.archivoDniApoderado || 'No registrado'}</p>

       <p><strong>Certificado:</strong> ${solicitud.archivoCertificado || 'No registrado'}</p>
    `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#2868e8'
    });
  }

  cerrarSesion() {
    Swal.fire({
      title: '¿Desea cerrar sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2868e8',
      cancelButtonColor: '#6b7280'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/']);
      }
    });
  }

  filtroActual: string = 'todas';

  obtenerTituloDashboard(): string {
    if (this.filtroActual === 'pendientes') {
      return 'Solicitudes pendientes de aprobación';
    }

    if (this.filtroActual === 'observadas') {
      return 'Solicitudes observadas';
    }

    if (this.filtroActual === 'aprobadas') {
      return 'Solicitudes aprobadas';
    }

    if (this.filtroActual === 'reportes') {
      return 'Reportes de matrícula';
    }

    return 'Dashboard administrativo';
  }

  obtenerSubtituloDashboard(): string {
    if (this.filtroActual === 'pendientes') {
      return 'Revise las solicitudes que aún necesitan aprobación.';
    }

    if (this.filtroActual === 'observadas') {
      return 'Revise las solicitudes que tienen observaciones.';
    }

    if (this.filtroActual === 'aprobadas') {
      return 'Revise las solicitudes aprobadas correctamente.';
    }

    if (this.filtroActual === 'reportes') {
      return 'Resumen general de estados de matrícula.';
    }

    return 'Resumen general de solicitudes de matrícula escolar.';
  }

  filtrarSolicitudes(filtro: string) {
    this.filtroActual = filtro;
  }

  obtenerSolicitudesFiltradas(): Solicitud[] {
    let solicitudesFiltradas = this.solicitudes;

    if (this.filtroActual === 'pendientes') {
      solicitudesFiltradas = this.solicitudes.filter(s => s.estado === 'En revisión');
    }

    if (this.filtroActual === 'observadas') {
      solicitudesFiltradas = this.solicitudes.filter(s => s.estado === 'Observado');
    }

    if (this.filtroActual === 'aprobadas') {
      solicitudesFiltradas = this.solicitudes.filter(s => s.estado === 'Aprobado');
    }

    return solicitudesFiltradas.slice().reverse();
  }


  aprobarSolicitud(solicitud: Solicitud) {
    solicitud.estado = 'Aprobado';
    this.matriculaService.actualizarSolicitudes();


    Swal.fire({
      title: 'Solicitud aprobada',
      text: 'La matrícula fue aprobada correctamente.',
      icon: 'success',
      confirmButtonColor: '#2868e8'
    });
  }

  observarSolicitud(solicitud: Solicitud) {
    Swal.fire({
      title: 'Motivo de observación',
      input: 'textarea',
      inputPlaceholder: 'Ejemplo: DNI borroso, falta certificado, documento incorrecto...',
      showCancelButton: true,
      confirmButtonText: 'Guardar observación',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2868e8',
      cancelButtonColor: '#6b7280',
      inputValidator: (value) => {
        if (!value) {
          return 'Debe escribir un motivo de observación';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        solicitud.estado = 'Observado';
        solicitud.observacion = result.value;

        this.matriculaService.actualizarSolicitudes();

        Swal.fire({
          title: 'Solicitud observada',
          text: 'La observación fue guardada correctamente.',
          icon: 'warning',
          confirmButtonColor: '#2868e8'
        });
      }
    });
  }

  eliminarSolicitud(solicitud: Solicitud) {
    Swal.fire({
      title: '¿Eliminar solicitud?',
      text: 'Esta acción quitará la solicitud del sistema.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280'
    }).then((result) => {
      if (result.isConfirmed) {
        this.matriculaService.eliminarSolicitud(solicitud.codigo);
        this.solicitudes = this.matriculaService.listarSolicitudes();

        Swal.fire({
          title: 'Solicitud eliminada',
          icon: 'success',
          confirmButtonColor: '#2868e8'
        });
      }
    });
  }

}