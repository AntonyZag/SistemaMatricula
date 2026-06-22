from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from src.repository.solicitud_repository import SolicitudRepository
from src.schema.solicitud_schema import EstadoSolicitudActualizar, SolicitudCrear


class SolicitudService:
    def __init__(self, db: Session):
        self.repository = SolicitudRepository(db)

    def listar(self):
        return self.repository.listar()

    def crear(self, solicitud: SolicitudCrear):
        if self.repository.obtener_por_codigo(solicitud.codigo):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ya existe una solicitud con ese codigo.",
            )

        try:
            return self.repository.crear(solicitud)
        except IntegrityError as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No se pudo registrar la solicitud.",
            ) from exc

    def actualizar_estado(self, codigo: str, datos_estado: EstadoSolicitudActualizar):
        solicitud = self.repository.obtener_por_codigo(codigo)

        if not solicitud:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Solicitud no encontrada.",
            )

        return self.repository.actualizar_estado(solicitud, datos_estado)

    def eliminar(self, codigo: str):
        solicitud = self.repository.obtener_por_codigo(codigo)

        if not solicitud:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Solicitud no encontrada.",
            )

        self.repository.eliminar(solicitud)
