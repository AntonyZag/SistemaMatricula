import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-informacion',
  imports: [Navbar, Footer],
  templateUrl: './informacion.html',
  styleUrl: './informacion.css'
})
export class Informacion {
  constructor(private router: Router) {}

  volverInicio() {
    this.router.navigate(['/inicio']);
  }
}