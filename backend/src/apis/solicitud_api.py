from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from src.database.connection import get_db
from src.schema.solicitud_schema import (
    EstadoSolicitudActualizar,
    SolicitudCrear,
    SolicitudRespuesta,
)
from src.services.solicitud_service import SolicitudService

router = APIRouter(prefix="/solicitudes", tags=["Solicitudes"])


@router.get("", response_model=list[SolicitudRespuesta])
def listar_solicitudes(db: Session = Depends(get_db)):
    return SolicitudService(db).listar()


@router.post("", response_model=SolicitudRespuesta, status_code=status.HTTP_201_CREATED)
def crear_solicitud(solicitud: SolicitudCrear, db: Session = Depends(get_db)):
    return SolicitudService(db).crear(solicitud)


@router.patch("/{codigo}/estado", response_model=SolicitudRespuesta)
def actualizar_estado_solicitud(
    codigo: str,
    datos_estado: EstadoSolicitudActualizar,
    db: Session = Depends(get_db),
):
    return SolicitudService(db).actualizar_estado(codigo, datos_estado)


@router.delete("/{codigo}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_solicitud(codigo: str, db: Session = Depends(get_db)):
    SolicitudService(db).eliminar(codigo)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
