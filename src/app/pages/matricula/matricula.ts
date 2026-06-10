import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { MatriculaService } from '../../services/matricula';
import { Solicitud } from '../../models/solicitud';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-matricula',
  imports: [Navbar, Footer,FormsModule,CommonModule],
  templateUrl: './matricula.html',
  styleUrl: './matricula.css'
})
export class Matricula {
  paso = 1;

  solicitud: Solicitud = {
    codigo: '',
    nombreEstudiante: '',
    dniEstudiante: '',
    fechaNacimiento: '',
    grado: '',
    institucion: '',
    nombreApoderado: '',
    dniApoderado: '',
    telefono: '',
    correo: '',
    parentesco: '',
    estado: 'En revisión',
    fechaRegistro: ''
  };

  constructor(
    private matriculaService: MatriculaService,
    private router: Router
  ) {}

  siguiente() {
    if (this.paso < 4) {
      this.paso++;
    }
  }

  anterior() {
    if (this.paso > 1) {
      this.paso--;
    }
  }

  finalizar() {
    this.solicitud.codigo = this.matriculaService.generarCodigo();
    this.solicitud.fechaRegistro = new Date().toLocaleDateString();

    this.matriculaService.registrarSolicitud(this.solicitud);

    this.router.navigate(['/seguimiento']);
  }
}