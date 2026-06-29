from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from src.database.connection import Base


class DocumentoSolicitudModel(Base):
    __tablename__ = "DocumentosSolicitud"

    idDocumento = Column(Integer, primary_key=True, index=True)
    codigoSolicitud = Column(
        String(30),
        ForeignKey("Solicitudes.codigo", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    archivoDniEstudiante = Column(String(255), nullable=True)
    archivoDniApoderado = Column(String(255), nullable=True)
    archivoCertificado = Column(String(255), nullable=True)
    creadoEn = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    actualizadoEn = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    solicitud = relationship("SolicitudModel", back_populates="documentos")
