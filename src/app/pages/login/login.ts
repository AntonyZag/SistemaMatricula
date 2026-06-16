import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-login',
  imports: [Navbar, Footer, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  perfil: string = 'apoderado';

  constructor(private router: Router) {}

  ingresar() {
    if (this.perfil === 'apoderado') {
      this.router.navigate(['/inicio']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}