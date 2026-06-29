from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from src.database.connection import Base


class SolicitudModel(Base):
    __tablename__ = "Solicitudes"

    codigo = Column(String(30), primary_key=True, index=True)
    idEstudiante = Column(Integer, ForeignKey("Estudiantes.idEstudiante"), nullable=False)
    idApoderado = Column(Integer, ForeignKey("Apoderados.idApoderado"), nullable=False)
    estado = Column(String(30), nullable=False, default="En revisión")
    fechaRegistro = Column(String(30), nullable=False)
    observacion = Column(Text, nullable=True)
    creadoEn = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    actualizadoEn = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    estudiante = relationship("EstudianteModel", back_populates="solicitudes")
    apoderado = relationship("ApoderadoModel", back_populates="solicitudes")
    documentos = relationship(
        "DocumentoSolicitudModel",
        back_populates="solicitud",
        cascade="all, delete-orphan",
        uselist=False,
    )
