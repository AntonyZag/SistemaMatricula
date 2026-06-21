import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-inicio',
  imports: [Navbar, Footer],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio {

  constructor(private router: Router) { }

  irMatricula() {
    this.router.navigate(['/matricula']);
  }

  irSeguimiento() {
    this.router.navigate(['/seguimiento']);
  }

  irInformacion() {
    this.router.navigate(['/informacion']);
  }

  cambiarUsuario() {
    localStorage.removeItem('perfilUsuario');
    localStorage.removeItem('dniUsuario');
    localStorage.removeItem('nombreUsuario');

    this.router.navigate(['/']);
  }

}