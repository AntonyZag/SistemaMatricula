import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [Navbar, Footer, FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  perfil: string = 'apoderado';
  dni: string = '';
  password: string = '';
  nombreApoderado: string = '';

  constructor(private router: Router) { }

  ingresar() {
    if (!this.dni || this.dni.length !== 8) {
      Swal.fire({
        title: 'DNI inválido',
        text: 'Ingrese un DNI válido de 8 dígitos.',
        icon: 'warning',
        confirmButtonColor: '#2868e8'
      });
      return;
    }

    if (this.perfil === 'apoderado') {
      if (!this.nombreApoderado) {
        Swal.fire({
          title: 'Nombre requerido',
          text: 'Ingrese el nombre del apoderado para continuar.',
          icon: 'warning',
          confirmButtonColor: '#2868e8'
        });
        return;
      }

      localStorage.setItem('perfilUsuario', 'apoderado');
      localStorage.setItem('dniUsuario', this.dni);
      localStorage.setItem('nombreUsuario', this.nombreApoderado);

      this.router.navigate(['/inicio']);
      return;
    }

    if (this.perfil === 'administrativo') {
      if (this.password !== this.dni) {
        Swal.fire({
          title: 'Credenciales incorrectas',
          text: 'Para el prototipo, la contraseña del administrativo debe ser igual al DNI.',
          icon: 'error',
          confirmButtonColor: '#2868e8'
        });
        return;
      }

      localStorage.setItem('perfilUsuario', 'administrativo');
      localStorage.setItem('dniUsuario', this.dni);
      this.router.navigate(['/dashboard']);
    }
  }
}