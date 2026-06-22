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
  ) {
    const perfilUsuario = localStorage.getItem('perfilUsuario');
    const dniUsuario = localStorage.getItem('dniUsuario');
    const nombreUsuario = localStorage.getItem('nombreUsuario');

    if (perfilUsuario === 'apoderado') {
      this.solicitud.dniApoderado = dniUsuario || '';
      this.solicitud.nombreApoderado = nombreUsuario || '';
    }

    this.matriculaService.listarSolicitudesApi().subscribe({
      error: () => {}
    });
  }

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
    if (
      !this.solicitud.nombreEstudiante ||
      !this.solicitud.dniEstudiante ||
      !this.solicitud.grado ||
      !this.solicitud.institucion ||
      !this.solicitud.nombreApoderado ||
      !this.solicitud.dniApoderado ||
      !this.solicitud.telefono ||
      !this.archivoDniEstudiante ||
      !this.archivoDniApoderado 

    ) {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Por favor complete los datos obligatorios antes de finalizar.',
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#2868e8'
      });
      return;
    }

    this.solicitud.codigo = this.matriculaService.generarCodigo();
    this.solicitud.fechaRegistro = new Date().toLocaleDateString();
    this.solicitud.estado = 'En revisión';

    this.solicitud.archivoDniEstudiante = this.archivoDniEstudiante;
    this.solicitud.archivoDniApoderado = this.archivoDniApoderado;
    this.solicitud.archivoCertificado = this.archivoCertificado;

    this.matriculaService.registrarSolicitudApi(this.solicitud).subscribe({
      next: () => {
        this.mostrarRegistroExitoso();
      },
      error: () => {
        this.matriculaService.registrarSolicitud(this.solicitud);
        this.mostrarRegistroExitoso();
      }
    });
  }

  mostrarRegistroExitoso() {
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
  archivoDniEstudiante = '';
  archivoDniApoderado = '';
  archivoCertificado = '';

  seleccionarArchivo(event: any, tipo: string) {
    const archivo = event.target.files[0];

    if (!archivo) return;

    if (tipo === 'dniEstudiante') {
      this.archivoDniEstudiante = archivo.name;
    }

    if (tipo === 'dniApoderado') {
      this.archivoDniApoderado = archivo.name;
    }

    if (tipo === 'certificado') {
      this.archivoCertificado = archivo.name;
    }
  }

  eliminarArchivo(tipo: string) {
    if (tipo === 'dniEstudiante') {
      this.archivoDniEstudiante = '';
    }

    if (tipo === 'dniApoderado') {
      this.archivoDniApoderado = '';
    }

    if (tipo === 'certificado') {
      this.archivoCertificado = '';
    }
  }
}
