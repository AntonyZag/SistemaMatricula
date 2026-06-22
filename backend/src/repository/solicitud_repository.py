from sqlalchemy.orm import Session

from src.models.solicitud_model import SolicitudModel
from src.schema.solicitud_schema import EstadoSolicitudActualizar, SolicitudCrear


class SolicitudRepository:
    def __init__(self, db: Session):
        self.db = db

    def listar(self) -> list[SolicitudModel]:
        return (
            self.db.query(SolicitudModel)
            .order_by(SolicitudModel.creadoEn.desc())
            .all()
        )

    def obtener_por_codigo(self, codigo: str) -> SolicitudModel | None:
        return (
            self.db.query(SolicitudModel)
            .filter(SolicitudModel.codigo == codigo)
            .first()
        )

    def crear(self, solicitud: SolicitudCrear) -> SolicitudModel:
        nueva_solicitud = SolicitudModel(**solicitud.model_dump())
        self.db.add(nueva_solicitud)
        self.db.commit()
        self.db.refresh(nueva_solicitud)
        return nueva_solicitud

    def actualizar_estado(
        self,
        solicitud: SolicitudModel,
        datos_estado: EstadoSolicitudActualizar,
    ) -> SolicitudModel:
        solicitud.estado = datos_estado.estado
        solicitud.observacion = datos_estado.observacion
        self.db.commit()
        self.db.refresh(solicitud)
        return solicitud

    def eliminar(self, solicitud: SolicitudModel) -> None:
        self.db.delete(solicitud)
        self.db.commit()
