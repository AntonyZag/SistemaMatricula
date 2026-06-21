import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { MatriculaService } from '../../services/matricula';
import { Solicitud } from '../../models/solicitud';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seguimiento',
  imports: [CommonModule, Navbar, Footer],
  templateUrl: './seguimiento.html',
  styleUrl: './seguimiento.css'
})
export class Seguimiento {
  solicitudes: Solicitud[] = [];

  constructor(
    private matriculaService: MatriculaService,
    private router: Router
  ) {
    const perfilUsuario = localStorage.getItem('perfilUsuario');
    const dniUsuario = localStorage.getItem('dniUsuario');

    if (perfilUsuario === 'administrativo') {
      this.solicitudes = this.matriculaService.listarSolicitudes();
    } else {
      this.solicitudes = this.matriculaService
        .listarSolicitudes()
        .filter(s => s.dniApoderado === dniUsuario);
    }
  }

  volverInicio() {
    this.router.navigate(['/inicio']);
  }
}
