from pydantic import BaseModel, ConfigDict, Field, field_validator

ESTADO_EN_REVISION = "En revisión"
ESTADO_APROBADO = "Aprobado"
ESTADO_OBSERVADO = "Observado"

ESTADOS_VALIDOS = {
    ESTADO_EN_REVISION,
    ESTADO_APROBADO,
    ESTADO_OBSERVADO,
}


def normalizar_estado(valor: str | None) -> str:
    if not valor:
        return ESTADO_EN_REVISION

    estado = valor.strip().lower()
    estado = (
        estado.replace("ãƒâ³", "ó")
        .replace("ã³", "ó")
        .replace("ã­", "í")
        .replace("revision", "revisión")
    )

    if estado == "en revisión":
        return ESTADO_EN_REVISION

    if estado == "aprobado":
        return ESTADO_APROBADO

    if estado == "observado":
        return ESTADO_OBSERVADO

    raise ValueError("Estado de solicitud no válido.")


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
    codigo: str = ""
    estado: str = Field(default=ESTADO_EN_REVISION, max_length=30)
    fechaRegistro: str
    observacion: str | None = None

    @field_validator("estado")
    @classmethod
    def validar_estado(cls, valor: str) -> str:
        return normalizar_estado(valor)


class SolicitudRespuesta(SolicitudCrear):
    model_config = ConfigDict(from_attributes=True)


class EstadoSolicitudActualizar(BaseModel):
    estado: str = Field(max_length=30)
    observacion: str | None = Field(default=None, max_length=4000)

    @field_validator("estado")
    @classmethod
    def validar_estado(cls, valor: str) -> str:
        return normalizar_estado(valor)
