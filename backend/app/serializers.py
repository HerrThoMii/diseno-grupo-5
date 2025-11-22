from rest_framework import serializers
from .models import (
    ProgramaActividades, GrupoInvestigacion, InformeRendicionCuentas,
    Erogacion, ProyectoInvestigacion, LineaDeInvestigacion, Actividad,
    Persona, ActividadDocente, InvestigadorDocente, BecarioPersonalFormacion,
    Investigador, DocumentacionBiblioteca, TrabajoPublicado,
    ActividadTransferencia, ParteExterna, EquipamientoInfraestructura,
    TrabajoPresentado, ActividadXPersona
)


class LoginSerializer(serializers.Serializer):
    correo = serializers.EmailField()
    contrasena = serializers.CharField(write_only=True, style={'input_type': 'password'})


class ProgramaActividadesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramaActividades
        fields = [
            'oidProgramaActividades',
            'anio',
            'objetivosEstrategicos'
        ]


class GrupoInvestigacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GrupoInvestigacion
        fields = [
            'oidGrupoInvestigacion',
            'nombre',
            'facultadReginalAsignada',
            'correo',
            'organigrama',
            'sigla',
            'fuenteFinanciamiento',
            'ProgramaActividades'
        ]


class InformeRendicionCuentasSerializer(serializers.ModelSerializer):
    class Meta:
        model = InformeRendicionCuentas
        fields = [
            'oidInformeRendicionCuentas',
            'periodoReportado',
            'GrupoInvestigacion'
        ]


class ErogacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Erogacion
        fields = [
            'oidErogacion',
            'egresos',
            'ingresos',
            'numero',
            'tipoErogacion',
            'InformeRendicionCuentas'
        ]


class ProyectoInvestigacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProyectoInvestigacion
        fields = [
            'oidProyectoInvestigacion',
            'codigoProyecto',
            'descripcion',
            'objectType',
            'fechaFinalizacion',
            'fechaInicio',
            'nombre',
            'tipoProyecto',
            'logrosObtenidos',
            'fuenteFinanciamiento',
            'GrupoInvestigacion'
        ]


class LineaDeInvestigacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LineaDeInvestigacion
        fields = [
            'oidLineaDeInvestigacion',
            'nombre',
            'descripcion',
            'ProgramaActividades'
        ]


class ActividadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actividad
        fields = [
            'oidActividad',
            'descripcion',
            'fechaFin',
            'fechaInicio',
            'nro',
            'presupuestoAsignado',
            'resultadosEsperados',
            'LineaDeInvestigacion'
        ]


class PersonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Persona
        fields = [
            'oidpersona',
            'nombre',
            'correo',
            'contrasena',
            'apellido',
            'horasSemanales',
            'tipoDePersonal',
            'GrupoInvestigacion'
        ]


class ActividadDocenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActividadDocente
        fields = [
            'oidActividadDocente',
            'denominacionCursoCatedra',
            'fechaPeriodoDictado',
            'rolDesenpeniado'
        ]


class InvestigadorDocenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvestigadorDocente
        fields = [
            'oidinvestigadorDocente',
            'gradoAcademico',
            'persona',
            'ActividadDocente'
        ]


class BecarioPersonalFormacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = BecarioPersonalFormacion
        fields = [
            'oidbecarioPersonalFormacioncol',
            'tipoFormacion',
            'fuenteFinanciamiento',
            'persona'
        ]


class InvestigadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Investigador
        fields = [
            'oidInvestigador',
            'tipoInvestigador',
            'categoriaUtn',
            'dedicacion',
            'programaDeInsentivos',
            'persona',
            'GrupoInvestigacion'
        ]


class DocumentacionBibliotecaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentacionBiblioteca
        fields = [
            'oidDocumentacionBiblioteca',
            'anio',
            'editorial',
            'titulo',
            'autor',
            'GrupoInvestigacion'
        ]


class TrabajoPublicadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrabajoPublicado
        fields = '__all__'
        read_only_fields = ['id']


class ActividadTransferenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActividadTransferencia
        fields = [
            'oidActividadTransferencia',
            'descripcion',
            'denominacion',
            'monto',
            'nroActividadTransferencia',
            'tipoActivdad',
            'GrupoInvestigacion'
        ]


class ParteExternaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParteExterna
        fields = [
            'oidParteExterna',
            'descripcion',
            'nombre',
            'tipoParte',
            'ActividadTransferencia'
        ]


class EquipamientoInfraestructuraSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipamientoInfraestructura
        fields = [
            'oidEquipamientoInfraestructura',
            'denominacion',
            'descripcion',
            'fechaIncoporacion',
            'montoInvertido',
            'GrupoInvestigacion'
        ]


class TrabajoPresentadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrabajoPresentado
        fields = '__all__'
        read_only_fields = ['id']


class ActividadXPersonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActividadXPersona
        fields = [
            'oidActividadXPersona',
            'Actividad',
            'persona'
        ]
