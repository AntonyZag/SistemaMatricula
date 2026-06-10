import { Component } from '@angular/core';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-login',
  imports: [Navbar, Footer],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

}