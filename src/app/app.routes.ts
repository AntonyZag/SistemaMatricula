import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Inicio } from './pages/inicio/inicio';
import { Matricula } from './pages/matricula/matricula';
import { Seguimiento } from './pages/seguimiento/seguimiento';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'inicio', component: Inicio },
  { path: 'matricula', component: Matricula },
  { path: 'seguimiento', component: Seguimiento },
  { path: 'dashboard', component: Dashboard },
  { path: '**', redirectTo: '' }
];