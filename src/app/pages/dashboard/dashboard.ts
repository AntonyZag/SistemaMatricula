import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { MatriculaService } from '../../services/matricula';
import { Solicitud } from '../../models/solicitud';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, Navbar, Footer],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  solicitudes: Solicitud[] = [];

  constructor(private matriculaService: MatriculaService) {
    this.solicitudes = this.matriculaService.listarSolicitudes();
  }

  contarPorEstado(estado: string): number {
    return this.solicitudes.filter(s => s.estado === estado).length;
  }

  totalSolicitudes(): number {
    return this.solicitudes.length;
  }
}