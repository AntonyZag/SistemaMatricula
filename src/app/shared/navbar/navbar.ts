import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  perfil: string = localStorage.getItem('perfilUsuario') || 'apoderado';
  dni: string = localStorage.getItem('dniUsuario') || '';
  nombre: string = localStorage.getItem('nombreUsuario') || '';

  constructor(private router: Router) { }

  estaEnLogin() {
    return this.router.url === '/';
  }

  obtenerNombreUsuario() {
    if (this.perfil === 'administrativo') {
      return 'Administrador';
    }

    return this.nombre || 'Apoderado';
  }

  obtenerRolUsuario() {
    if (this.perfil === 'administrativo') {
      return 'Personal administrativo';
    }

    return this.dni ? `DNI: ${this.dni}` : 'Apoderado';
  }
}