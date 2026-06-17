import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { MatriculaService } from '../../services/matricula';
import { Solicitud } from '../../models/solicitud';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-matricula',
  imports: [Navbar, Footer, FormsModule, CommonModule],
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
  ) { }

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

  volverInicio() {
    this.router.navigate(['/inicio']);
  }

  finalizar() {
    this.solicitud.codigo = this.matriculaService.generarCodigo();
    this.solicitud.fechaRegistro = new Date().toLocaleDateString();

    this.matriculaService.registrarSolicitud(this.solicitud);

    Swal.fire({
      title: 'Solicitud registrada correctamente',
      html: `
      <p>La solicitud de matrícula fue guardada con éxito.</p>
      <strong>Código de solicitud:</strong><br>
      <span style="font-size: 22px; color: #2868e8; font-weight: bold;">
        ${this.solicitud.codigo}
      </span>
    `,
      icon: 'success',
      confirmButtonText: 'Ver seguimiento',
      confirmButtonColor: '#2868e8'
    }).then(() => {
      this.router.navigate(['/seguimiento']);
    });
  }
}