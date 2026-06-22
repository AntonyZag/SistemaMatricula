from pydantic import BaseModel, ConfigDict, Field


class SolicitudBase(BaseModel):
    nombreEstudiante: str
    dniEstudiante: str
    fechaNacimiento: str | None = None
    grado: str
    institucion: str

    nombreApoderado: str
    dniApoderado: str
    telefono: str
    correo: str | None = None
    parentesco: str | None = None

    archivoDniEstudiante: str | None = None
    archivoDniApoderado: str | None = None
    archivoCertificado: str | None = None


class SolicitudCrear(SolicitudBase):
    codigo: str
    estado: str = Field(default="En revision", max_length=30)
    fechaRegistro: str
    observacion: str | None = None


class SolicitudRespuesta(SolicitudCrear):
    model_config = ConfigDict(from_attributes=True)


class EstadoSolicitudActualizar(BaseModel):
    estado: str = Field(max_length=30)
    observacion: str | None = Field(default=None, max_length=4000)
