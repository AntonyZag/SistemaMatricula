import re

from sqlalchemy.orm import Session, joinedload

from src.models.apoderado_model import ApoderadoModel
from src.models.documento_solicitud_model import DocumentoSolicitudModel
from src.models.estudiante_model import EstudianteModel
from src.models.solicitud_model import SolicitudModel
from src.schema.solicitud_schema import EstadoSolicitudActualizar, SolicitudCrear


class SolicitudRepository:
    def __init__(self, db: Session):
        self.db = db

    def listar(self) -> list[dict]:
        solicitudes = (
            self.db.query(SolicitudModel)
            .options(
                joinedload(SolicitudModel.estudiante),
                joinedload(SolicitudModel.apoderado),
                joinedload(SolicitudModel.documentos),
            )
            .order_by(SolicitudModel.creadoEn.desc())
            .all()
        )
        return [self._formatear_respuesta(solicitud) for solicitud in solicitudes]

    def obtener_por_codigo(self, codigo: str) -> SolicitudModel | None:
        return (
            self.db.query(SolicitudModel)
            .options(
                joinedload(SolicitudModel.estudiante),
                joinedload(SolicitudModel.apoderado),
                joinedload(SolicitudModel.documentos),
            )
            .filter(SolicitudModel.codigo == codigo)
            .first()
        )

    def generar_siguiente_codigo(self) -> str:
        prefijo = "MAT-2024-"
        numero_inicial = 126
        patron = re.compile(rf"^{prefijo}(\d+)$")
        codigos = self.db.query(SolicitudModel.codigo).all()
        numeros = []

        for (codigo,) in codigos:
            coincidencia = patron.match(codigo or "")

            if coincidencia:
                numeros.append(int(coincidencia.group(1)))

        siguiente_numero = max(numeros, default=numero_inicial - 1) + 1
        return f"{prefijo}{siguiente_numero:06d}"

    def crear(self, solicitud: SolicitudCrear) -> dict:
        try:
            apoderado = self._obtener_o_crear_apoderado(solicitud)
            estudiante = self._obtener_o_crear_estudiante(solicitud)

            nueva_solicitud = SolicitudModel(
                codigo=solicitud.codigo,
                idEstudiante=estudiante.idEstudiante,
                idApoderado=apoderado.idApoderado,
                estado=solicitud.estado,
                fechaRegistro=solicitud.fechaRegistro,
                observacion=solicitud.observacion,
            )

            documentos = DocumentoSolicitudModel(
                codigoSolicitud=solicitud.codigo,
                archivoDniEstudiante=solicitud.archivoDniEstudiante,
                archivoDniApoderado=solicitud.archivoDniApoderado,
                archivoCertificado=solicitud.archivoCertificado,
            )

            nueva_solicitud.documentos = documentos
            self.db.add(nueva_solicitud)
            self.db.commit()
            self.db.refresh(nueva_solicitud)
            return self._formatear_respuesta(
                self.obtener_por_codigo(nueva_solicitud.codigo)
            )
        except Exception:
            self.db.rollback()
            raise

    def actualizar_estado(
        self,
        solicitud: SolicitudModel,
        datos_estado: EstadoSolicitudActualizar,
    ) -> dict:
        solicitud.estado = datos_estado.estado
        solicitud.observacion = datos_estado.observacion
        self.db.commit()
        self.db.refresh(solicitud)
        return self._formatear_respuesta(self.obtener_por_codigo(solicitud.codigo))

    def eliminar(self, solicitud: SolicitudModel) -> None:
        self.db.delete(solicitud)
        self.db.commit()

    def _obtener_o_crear_apoderado(self, solicitud: SolicitudCrear) -> ApoderadoModel:
        apoderado = (
            self.db.query(ApoderadoModel)
            .filter(ApoderadoModel.dniApoderado == solicitud.dniApoderado)
            .first()
        )

        if not apoderado:
            apoderado = ApoderadoModel(
                nombreApoderado=solicitud.nombreApoderado,
                dniApoderado=solicitud.dniApoderado,
                telefono=solicitud.telefono,
                correo=solicitud.correo,
                parentesco=solicitud.parentesco,
            )
            self.db.add(apoderado)
            self.db.flush()
            return apoderado

        apoderado.nombreApoderado = solicitud.nombreApoderado
        apoderado.telefono = solicitud.telefono
        apoderado.correo = solicitud.correo
        apoderado.parentesco = solicitud.parentesco
        self.db.flush()
        return apoderado

    def _obtener_o_crear_estudiante(self, solicitud: SolicitudCrear) -> EstudianteModel:
        estudiante = (
            self.db.query(EstudianteModel)
            .filter(EstudianteModel.dniEstudiante == solicitud.dniEstudiante)
            .first()
        )

        if not estudiante:
            estudiante = EstudianteModel(
                nombreEstudiante=solicitud.nombreEstudiante,
                dniEstudiante=solicitud.dniEstudiante,
                fechaNacimiento=solicitud.fechaNacimiento,
                grado=solicitud.grado,
                institucion=solicitud.institucion,
            )
            self.db.add(estudiante)
            self.db.flush()
            return estudiante

        estudiante.nombreEstudiante = solicitud.nombreEstudiante
        estudiante.fechaNacimiento = solicitud.fechaNacimiento
        estudiante.grado = solicitud.grado
        estudiante.institucion = solicitud.institucion
        self.db.flush()
        return estudiante

    def _formatear_respuesta(self, solicitud: SolicitudModel | None) -> dict:
        if not solicitud:
            return {}

        estudiante = solicitud.estudiante
        apoderado = solicitud.apoderado
        documentos = solicitud.documentos

        return {
            "nombreEstudiante": estudiante.nombreEstudiante,
            "dniEstudiante": estudiante.dniEstudiante,
            "fechaNacimiento": estudiante.fechaNacimiento,
            "grado": estudiante.grado,
            "institucion": estudiante.institucion,
            "nombreApoderado": apoderado.nombreApoderado,
            "dniApoderado": apoderado.dniApoderado,
            "telefono": apoderado.telefono,
            "correo": apoderado.correo,
            "parentesco": apoderado.parentesco,
            "archivoDniEstudiante": (
                documentos.archivoDniEstudiante if documentos else None
            ),
            "archivoDniApoderado": (
                documentos.archivoDniApoderado if documentos else None
            ),
            "archivoCertificado": documentos.archivoCertificado if documentos else None,
            "codigo": solicitud.codigo,
            "estado": solicitud.estado,
            "fechaRegistro": solicitud.fechaRegistro,
            "observacion": solicitud.observacion,
        }
