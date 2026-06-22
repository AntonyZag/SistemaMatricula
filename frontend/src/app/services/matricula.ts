import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  ESTADO_APROBADO,
  ESTADO_EN_REVISION,
  ESTADO_OBSERVADO,
  EstadoSolicitud,
  Solicitud
} from '../models/solicitud';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {


  private solicitudes: Solicitud[] = [];
  private apiUrl = 'http://127.0.0.1:8000/solicitudes';

  constructor(private http: HttpClient) {
    const datosGuardados = localStorage.getItem('solicitudes');

    if (datosGuardados) {
      this.solicitudes = this.normalizarSolicitudes(JSON.parse(datosGuardados));
      this.actualizarSolicitudes();
    }
  }

  registrarSolicitud(solicitud: Solicitud) {

    this.solicitudes.push(this.normalizarSolicitud(solicitud));

    localStorage.setItem(
      'solicitudes',
      JSON.stringify(this.solicitudes)
    );

  }

  listarSolicitudesApi(): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(this.apiUrl).pipe(
      tap(solicitudes => {
        this.solicitudes = this.normalizarSolicitudes(solicitudes);
        this.actualizarSolicitudes();
      })
    );
  }

  registrarSolicitudApi(solicitud: Solicitud): Observable<Solicitud> {
    return this.http.post<Solicitud>(this.apiUrl, this.normalizarSolicitud(solicitud)).pipe(
      tap(solicitudRegistrada => {
        this.solicitudes.push(this.normalizarSolicitud(solicitudRegistrada));
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
      { estado: this.normalizarEstado(estado), observacion: observacion || null }
    ).pipe(
      tap(solicitudActualizada => {
        const indice = this.solicitudes.findIndex(s => s.codigo === codigo);

        if (indice >= 0) {
          this.solicitudes[indice] = this.normalizarSolicitud(solicitudActualizada);
          this.actualizarSolicitudes();
        }
      })
    );
  }

  generarCodigoApi(): Observable<{ codigo: string }> {
    return this.http.get<{ codigo: string }>(`${this.apiUrl}/siguiente-codigo`);
  }

  eliminarSolicitudApi(codigo: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${codigo}`).pipe(
      tap(() => {
        this.eliminarSolicitud(codigo);
      })
    );
  }

  listarSolicitudes(): Solicitud[] {
    return this.normalizarSolicitudes(this.solicitudes);
  }

  actualizarSolicitudes() {
    localStorage.setItem('solicitudes', JSON.stringify(this.solicitudes));
  }

  eliminarSolicitud(codigo: string) {
    this.solicitudes = this.solicitudes.filter(s => s.codigo !== codigo);
    this.actualizarSolicitudes();
  }

  generarCodigo(): string {
    const numeros = this.solicitudes
      .map(s => this.obtenerNumeroCodigo(s.codigo))
      .filter(numero => numero > 0);
    const numero = Math.max(125, ...numeros) + 1;
    return `MAT-2024-${numero.toString().padStart(6, '0')}`;
  }

  normalizarSolicitud(solicitud: Solicitud): Solicitud {
    return {
      ...solicitud,
      estado: this.normalizarEstado(solicitud.estado)
    };
  }

  normalizarSolicitudes(solicitudes: Solicitud[]): Solicitud[] {
    return solicitudes.map(solicitud => this.normalizarSolicitud(solicitud));
  }

  normalizarEstado(estado: string): EstadoSolicitud {
    const estadoNormalizado = estado
      .trim()
      .toLowerCase()
      .replace('ãƒâ³', 'ó')
      .replace('ã³', 'ó')
      .replace('ã­', 'í')
      .replace('revision', 'revisión');

    if (estadoNormalizado === 'aprobado') {
      return ESTADO_APROBADO;
    }

    if (estadoNormalizado === 'observado') {
      return ESTADO_OBSERVADO;
    }

    return ESTADO_EN_REVISION;
  }

  obtenerNumeroCodigo(codigo: string): number {
    const coincidencia = /^MAT-2024-(\d+)$/.exec(codigo);
    return coincidencia ? Number(coincidencia[1]) : 0;
  }
}

