from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from src.database.connection import Base


class EstudianteModel(Base):
    __tablename__ = "Estudiantes"

    idEstudiante = Column(Integer, primary_key=True, index=True)
    nombreEstudiante = Column(String(150), nullable=False)
    dniEstudiante = Column(String(20), nullable=False, unique=True, index=True)
    fechaNacimiento = Column(String(20), nullable=True)
    grado = Column(String(80), nullable=False)
    institucion = Column(String(180), nullable=False)
    creadoEn = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    actualizadoEn = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    solicitudes = relationship("SolicitudModel", back_populates="estudiante")
