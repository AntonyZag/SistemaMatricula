import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { MatriculaService } from '../../services/matricula';
import {
  ESTADO_APROBADO,
  ESTADO_EN_REVISION,
  ESTADO_OBSERVADO,
  Solicitud
} from '../../models/solicitud';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seguimiento',
  imports: [CommonModule, Navbar, Footer],
  templateUrl: './seguimiento.html',
  styleUrl: './seguimiento.css'
})
export class Seguimiento {
  solicitudes: Solicitud[] = [];
  estadoEnRevision = ESTADO_EN_REVISION;
  estadoAprobado = ESTADO_APROBADO;
  estadoObservado = ESTADO_OBSERVADO;

  constructor(
    private matriculaService: MatriculaService,
    private router: Router
  ) {
    this.cargarSolicitudes();
  }

  cargarSolicitudes() {
    const perfilUsuario = localStorage.getItem('perfilUsuario');
    const dniUsuario = localStorage.getItem('dniUsuario');
    const solicitudesGuardadas = this.matriculaService.listarSolicitudes();

    this.solicitudes = this.filtrarSolicitudesPorUsuario(
      solicitudesGuardadas,
      perfilUsuario,
      dniUsuario
    );

    this.matriculaService.listarSolicitudesApi().subscribe({
      next: (solicitudes) => {
        this.solicitudes = this.filtrarSolicitudesPorUsuario(solicitudes, perfilUsuario, dniUsuario);
      },
      error: () => {
        this.solicitudes = this.filtrarSolicitudesPorUsuario(
          this.matriculaService.listarSolicitudes(),
          perfilUsuario,
          dniUsuario
        );
      }
    });
  }

  filtrarSolicitudesPorUsuario(
    solicitudes: Solicitud[],
    perfilUsuario: string | null,
    dniUsuario: string | null
  ): Solicitud[] {
    if (perfilUsuario === 'administrativo') {
      return solicitudes;
    }

    const dniNormalizado = this.normalizarDni(dniUsuario);

    if (!dniNormalizado) {
      return [];
    }

    return solicitudes.filter(solicitud => {
      return this.normalizarDni(solicitud.dniApoderado) === dniNormalizado;
    });
  }

  esSolicitudDelApoderado(solicitud: Solicitud, dniUsuario: string | null): boolean {
    return this.normalizarDni(solicitud.dniApoderado) === this.normalizarDni(dniUsuario);
  }

  normalizarDni(dni: string | null | undefined): string {
    return (dni || '').replace(/\D/g, '');
  }

  volverInicio() {
    this.router.navigate(['/inicio']);
  }
}
