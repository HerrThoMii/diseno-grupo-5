from rest_framework import serializers
from .models import (
    ProgramaActividades, GrupoInvestigacion, InformeRendicionCuentas,
    Erogacion, ProyectoInvestigacion, LineaDeInvestigacion, Actividad,
    Persona, ActividadDocente, InvestigadorDocente, BecarioPersonalFormacion,
    Investigador, DocumentacionBiblioteca, TrabajoPublicado,
    ActividadTransferencia, ParteExterna, EquipamientoInfraestructura,
    TrabajoPresentado, ActividadXPersona, Patente, Registro,
    MemoriaAnual, IntegranteMemoria, TrabajoMemoria, ActividadMemoria,
    PublicacionMemoria, PatenteMemoria, ProyectoMemoria
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


class PatenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patente
        fields = '__all__'
        read_only_fields = ['id']


class RegistroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registro
        fields = '__all__'
        read_only_fields = ['id']


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


# Serializers para Memoria Anual

class IntegranteMemoriaSerializer(serializers.ModelSerializer):
    persona_nombre = serializers.CharField(source='persona.nombre', read_only=True)
    persona_apellido = serializers.CharField(source='persona.apellido', read_only=True)
    
    class Meta:
        model = IntegranteMemoria
        fields = [
            'oidIntegranteMemoria',
            'MemoriaAnual',
            'persona',
            'persona_nombre',
            'persona_apellido',
            'rol',
            'horasSemanales'
        ]


class TrabajoMemoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrabajoMemoria
        fields = [
            'oidTrabajoMemoria',
            'MemoriaAnual',
            'ciudad',
            'fecha',
            'nombreReunion',
            'titulo'
        ]


class ActividadMemoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActividadMemoria
        fields = [
            'oidActividadMemoria',
            'MemoriaAnual',
            'titulo',
            'descripcion',
            'fecha',
            'tipo'
        ]


class PublicacionMemoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PublicacionMemoria
        fields = [
            'oidPublicacionMemoria',
            'MemoriaAnual',
            'titulo',
            'autor',
            'revista',
            'anio'
        ]


class PatenteMemoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatenteMemoria
        fields = [
            'oidPatenteMemoria',
            'MemoriaAnual',
            'titulo',
            'numero',
            'fecha',
            'estado'
        ]


class ProyectoMemoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProyectoMemoria
        fields = [
            'oidProyectoMemoria',
            'MemoriaAnual',
            'nombre',
            'estado',
            'fechaInicio',
            'fechaFin',
            'responsable',
            'responsableTitulo',
            'presupuesto',
            'colaboradores',
            'colaboradoresTitulo',
            'objetivos',
            'objetivosTitulo',
            'resultados',
            'resultadosTitulo'
        ]


class MemoriaAnualSerializer(serializers.ModelSerializer):
    director_nombre = serializers.CharField(source='director.nombre', read_only=True)
    director_apellido = serializers.CharField(source='director.apellido', read_only=True)
    vicedirector_nombre = serializers.CharField(source='vicedirector.nombre', read_only=True)
    vicedirector_apellido = serializers.CharField(source='vicedirector.apellido', read_only=True)
    grupo_nombre = serializers.CharField(source='GrupoInvestigacion.nombre', read_only=True)
    
    integrantes = IntegranteMemoriaSerializer(many=True, read_only=True)
    trabajos = TrabajoMemoriaSerializer(many=True, read_only=True)
    actividades_memoria = ActividadMemoriaSerializer(many=True, read_only=True)
    publicaciones_memoria = PublicacionMemoriaSerializer(many=True, read_only=True)
    patentes_memoria = PatenteMemoriaSerializer(many=True, read_only=True)
    proyectos_memoria = ProyectoMemoriaSerializer(many=True, read_only=True)
    
    class Meta:
        model = MemoriaAnual
        fields = [
            'oidMemoriaAnual',
            'anio',
            'fechaCreacion',
            'fechaActualizacion',
            'GrupoInvestigacion',
            'grupo_nombre',
            'director',
            'director_nombre',
            'director_apellido',
            'vicedirector',
            'vicedirector_nombre',
            'vicedirector_apellido',
            'integrantes',
            'trabajos',
            'actividades_memoria',
            'publicaciones_memoria',
            'patentes_memoria',
            'proyectos_memoria'
        ]
        read_only_fields = ['fechaCreacion', 'fechaActualizacion']
