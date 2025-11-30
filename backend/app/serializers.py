from rest_framework import serializers
from .models import (
    ProgramaActividades, GrupoInvestigacion, InformeRendicionCuentas,
    Erogacion, ProyectoInvestigacion, LineaDeInvestigacion, Actividad,
    Persona, ActividadDocente, InvestigadorDocente, BecarioPersonalFormacion,
    Investigador, DocumentacionBiblioteca, TrabajoPublicado, Autor, TipoTrabajoPublicado,
    ActividadTransferencia, ParteExterna, EquipamientoInfraestructura,
    TrabajoPresentado, ActividadXPersona, Patente, TipoDeRegistro, Registro,
    MemoriaAnual, IntegranteMemoria, TrabajoMemoria, ActividadMemoria,
    PublicacionMemoria, PatenteMemoria, ProyectoMemoria, TipoDePersonal,
    GradoAcademico, CategoriaUtn, Dedicacion, ProgramaDeIncentivos,
    DenominacionCursoCatedra, RolDesempenado
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


class TipoDeRegistroSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoDeRegistro
        fields = '__all__'
        read_only_fields = ['id']


class RegistroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registro
        fields = '__all__'
        read_only_fields = ['id']


class AutorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Autor
        fields = '__all__'
        read_only_fields = ['oidAutor']


class TipoTrabajoPublicadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoTrabajoPublicado
        fields = '__all__'
        read_only_fields = ['oidTipoTrabajoPublicado']


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
    tipoDePersonal_nombres = serializers.SerializerMethodField()
    gradoAcademico_nombres = serializers.SerializerMethodField()
    categoriaUtn_nombres = serializers.SerializerMethodField()
    dedicacion_nombre = serializers.CharField(source='dedicacion.nombre', read_only=True)
    programaDeIncentivos_nombre = serializers.CharField(source='programaDeIncentivos.nombre', read_only=True)
    denominacionCursoCatedra_nombres = serializers.SerializerMethodField()
    rolDesempenado_nombres = serializers.SerializerMethodField()
    
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
            'tipoDePersonal_nombres',
            'GrupoInvestigacion',
            'gradoAcademico',
            'gradoAcademico_nombres',
            'categoriaUtn',
            'categoriaUtn_nombres',
            'dedicacion',
            'dedicacion_nombre',
            'programaDeIncentivos',
            'programaDeIncentivos_nombre',
            'denominacionCursoCatedra',
            'denominacionCursoCatedra_nombres',
            'rolDesempenado',
            'rolDesempenado_nombres',
            'fechaPeriodoDictadoInicio',
            'fechaPeriodoDictadoFin'
        ]
        extra_kwargs = {
            'contrasena': {'write_only': True}
        }
    
    def get_tipoDePersonal_nombres(self, obj):
        return [t.nombre for t in obj.tipoDePersonal.all()]
    
    def get_gradoAcademico_nombres(self, obj):
        return [g.nombre for g in obj.gradoAcademico.all()]
    
    def get_categoriaUtn_nombres(self, obj):
        return [c.nombre for c in obj.categoriaUtn.all()]
    
    def get_denominacionCursoCatedra_nombres(self, obj):
        return [d.nombre for d in obj.denominacionCursoCatedra.all()]
    
    def get_rolDesempenado_nombres(self, obj):
        return [r.nombre for r in obj.rolDesempenado.all()]
    
    def update(self, instance, validated_data):
        # Extract ManyToMany fields
        tipos_personal = validated_data.pop('tipoDePersonal', None)
        grados_academicos = validated_data.pop('gradoAcademico', None)
        categorias_utn = validated_data.pop('categoriaUtn', None)
        cursos_catedra = validated_data.pop('denominacionCursoCatedra', None)
        roles_desempenados = validated_data.pop('rolDesempenado', None)
        
        # Update regular fields (including ForeignKeys)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update ManyToMany fields
        if tipos_personal is not None:
            instance.tipoDePersonal.set(tipos_personal)
        if grados_academicos is not None:
            instance.gradoAcademico.set(grados_academicos)
        if categorias_utn is not None:
            instance.categoriaUtn.set(categorias_utn)
        if cursos_catedra is not None:
            instance.denominacionCursoCatedra.set(cursos_catedra)
        if roles_desempenados is not None:
            instance.rolDesempenado.set(roles_desempenados)
        
        return instance


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
        # estado is managed by backend and defaults to 'Realizado' — treat it as read-only for clients
        read_only_fields = ['id', 'estado']


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
    class Meta:
        model = IntegranteMemoria
        fields = '__all__'


class TrabajoMemoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrabajoMemoria
        fields = '__all__'


class ActividadMemoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActividadMemoria
        fields = '__all__'


class PublicacionMemoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PublicacionMemoria
        fields = '__all__'


class PatenteMemoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatenteMemoria
        fields = '__all__'


class ProyectoMemoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProyectoMemoria
        fields = '__all__'


class MemoriaAnualSerializer(serializers.ModelSerializer):
    integrantes = IntegranteMemoriaSerializer(many=True, read_only=True)
    trabajos = TrabajoMemoriaSerializer(many=True, read_only=True)
    actividades = ActividadMemoriaSerializer(many=True, read_only=True)
    publicaciones = PublicacionMemoriaSerializer(many=True, read_only=True)
    patentes = PatenteMemoriaSerializer(many=True, read_only=True)
    proyectos = ProyectoMemoriaSerializer(many=True, read_only=True)

    class Meta:
        model = MemoriaAnual
        fields = '__all__'
