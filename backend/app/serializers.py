from rest_framework import serializers
from .models import (
    ProgramaActividades, GrupoInvestigacion, InformeRendicionCuentas,
    Erogacion, ProyectoInvestigacion, LineaDeInvestigacion, Actividad,
    Persona, ActividadDocente, InvestigadorDocente, BecarioPersonalFormacion,
    Investigador, DocumentacionBiblioteca, TrabajoPublicado,
    ActividadTransferencia, ParteExterna, EquipamientoInfraestructura,
    TrabajoPresentado, ActividadXPersona
)


class ProgramaActividadesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramaActividades
        fields = '__all__'


class GrupoInvestigacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GrupoInvestigacion
        fields = '__all__'
        depth = 1


class InformeRendicionCuentasSerializer(serializers.ModelSerializer):
    class Meta:
        model = InformeRendicionCuentas
        fields = '__all__'


class ErogacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Erogacion
        fields = '__all__'


class ProyectoInvestigacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProyectoInvestigacion
        fields = '__all__'


class LineaDeInvestigacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LineaDeInvestigacion
        fields = '__all__'


class ActividadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actividad
        fields = '__all__'


class PersonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Persona
        fields = '__all__'


class ActividadDocenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActividadDocente
        fields = '__all__'


class InvestigadorDocenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvestigadorDocente
        fields = '__all__'


class BecarioPersonalFormacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = BecarioPersonalFormacion
        fields = '__all__'


class InvestigadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Investigador
        fields = '__all__'


class DocumentacionBibliotecaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentacionBiblioteca
        fields = '__all__'


class TrabajoPublicadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrabajoPublicado
        fields = '__all__'


class ActividadTransferenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActividadTransferencia
        fields = '__all__'


class ParteExternaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParteExterna
        fields = '__all__'


class EquipamientoInfraestructuraSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipamientoInfraestructura
        fields = '__all__'


class TrabajoPresentadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrabajoPresentado
        fields = '__all__'


class ActividadXPersonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActividadXPersona
        fields = '__all__'
