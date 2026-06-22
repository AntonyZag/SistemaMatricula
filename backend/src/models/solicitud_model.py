from sqlalchemy import Column, DateTime, String, Text
from sqlalchemy.sql import func

from src.database.connection import Base


class SolicitudModel(Base):
    __tablename__ = "Solicitudes"

    codigo = Column(String(30), primary_key=True, index=True)
    nombreEstudiante = Column(String(150), nullable=False)
    dniEstudiante = Column(String(20), nullable=False)
    fechaNacimiento = Column(String(20), nullable=True)
    grado = Column(String(80), nullable=False)
    institucion = Column(String(180), nullable=False)

    nombreApoderado = Column(String(150), nullable=False)
    dniApoderado = Column(String(20), nullable=False, index=True)
    telefono = Column(String(30), nullable=False)
    correo = Column(String(150), nullable=True)
    parentesco = Column(String(80), nullable=True)

    estado = Column(String(30), nullable=False, default="En revision")
    fechaRegistro = Column(String(30), nullable=False)

    archivoDniEstudiante = Column(String(255), nullable=True)
    archivoDniApoderado = Column(String(255), nullable=True)
    archivoCertificado = Column(String(255), nullable=True)
    observacion = Column(Text, nullable=True)

    creadoEn = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    actualizadoEn = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
