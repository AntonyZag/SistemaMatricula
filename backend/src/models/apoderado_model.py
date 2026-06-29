from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from src.database.connection import Base


class ApoderadoModel(Base):
    __tablename__ = "Apoderados"

    idApoderado = Column(Integer, primary_key=True, index=True)
    nombreApoderado = Column(String(150), nullable=False)
    dniApoderado = Column(String(20), nullable=False, unique=True, index=True)
    telefono = Column(String(30), nullable=False)
    correo = Column(String(150), nullable=True)
    parentesco = Column(String(80), nullable=True)
    creadoEn = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    actualizadoEn = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    solicitudes = relationship("SolicitudModel", back_populates="apoderado")
