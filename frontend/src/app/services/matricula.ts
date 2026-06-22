import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Solicitud } from '../models/solicitud';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {


  private solicitudes: Solicitud[] = [];
  private apiUrl = 'http://127.0.0.1:8000/solicitudes';

  constructor(private http: HttpClient) {
    const datosGuardados = localStorage.getItem('solicitudes');

    if (datosGuardados) {
      this.solicitudes = JSON.parse(datosGuardados);
    }
  }

  registrarSolicitud(solicitud: Solicitud) {

    this.solicitudes.push(solicitud);

    localStorage.setItem(
      'solicitudes',
      JSON.stringify(this.solicitudes)
    );

  }

  listarSolicitudesApi(): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(this.apiUrl).pipe(
      tap(solicitudes => {
        this.solicitudes = solicitudes;
        this.actualizarSolicitudes();
      })
    );
  }

  registrarSolicitudApi(solicitud: Solicitud): Observable<Solicitud> {
    return this.http.post<Solicitud>(this.apiUrl, solicitud).pipe(
      tap(solicitudRegistrada => {
        this.solicitudes.push(solicitudRegistrada);
        this.actualizarSolicitudes();
      })
    );
  }

  actualizarEstadoSolicitudApi(
    codigo: string,
    estado: Solicitud['estado'],
    observacion?: string
  ): Observable<Solicitud> {
    return this.http.patch<Solicitud>(
      `${this.apiUrl}/${codigo}/estado`,
      { estado, observacion: observacion || null }
    ).pipe(
      tap(solicitudActualizada => {
        const indice = this.solicitudes.findIndex(s => s.codigo === codigo);

        if (indice >= 0) {
          this.solicitudes[indice] = solicitudActualizada;
          this.actualizarSolicitudes();
        }
      })
    );
  }

  eliminarSolicitudApi(codigo: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${codigo}`).pipe(
      tap(() => {
        this.eliminarSolicitud(codigo);
      })
    );
  }

  listarSolicitudes(): Solicitud[] {
    return this.solicitudes;
  }

  actualizarSolicitudes() {
    localStorage.setItem('solicitudes', JSON.stringify(this.solicitudes));
  }

  eliminarSolicitud(codigo: string) {
    this.solicitudes = this.solicitudes.filter(s => s.codigo !== codigo);
    this.actualizarSolicitudes();
  }

  generarCodigo(): string {
    const numero = this.solicitudes.length + 126;
    return `MAT-2024-${numero.toString().padStart(6, '0')}`;
  }
}

