import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { MatriculaService } from '../../services/matricula';
import { Solicitud } from '../../models/solicitud';

@Component({
  selector: 'app-seguimiento',
  imports: [CommonModule, Navbar, Footer],
  templateUrl: './seguimiento.html',
  styleUrl: './seguimiento.css'
})
export class Seguimiento {
  solicitudes: Solicitud[] = [];

  constructor(private matriculaService: MatriculaService) {
    this.solicitudes = this.matriculaService.listarSolicitudes();
  }
}