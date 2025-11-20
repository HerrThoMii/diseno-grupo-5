from django.shortcuts import render
from rest_framework import viewsets
from .models import (
    ProgramaActividades, GrupoInvestigacion, InformeRendicionCuentas,
    Erogacion, ProyectoInvestigacion, LineaDeInvestigacion, Actividad,
    Persona, ActividadDocente, InvestigadorDocente,
    BecarioPersonalFormacion, Investigador, DocumentacionBiblioteca,
    TrabajoPublicado, ActividadTransferencia, ParteExterna,
    EquipamientoInfraestructura, TrabajoPresentado, ActividadXPersona
)
from .serializers import (
    ProgramaActividadesSerializer, GrupoInvestigacionSerializer,
    InformeRendicionCuentasSerializer, ErogacionSerializer,
    ProyectoInvestigacionSerializer, LineaDeInvestigacionSerializer,
    ActividadSerializer, PersonaSerializer, ActividadDocenteSerializer,
    InvestigadorDocenteSerializer, BecarioPersonalFormacionSerializer,
    InvestigadorSerializer, DocumentacionBibliotecaSerializer,
    TrabajoPublicadoSerializer, ActividadTransferenciaSerializer,
    ParteExternaSerializer, EquipamientoInfraestructuraSerializer,
    TrabajoPresentadoSerializer, ActividadXPersonaSerializer
)


class ProgramaActividadesViewSet(viewsets.ModelViewSet):
    queryset = ProgramaActividades.objects.all()
    serializer_class = ProgramaActividadesSerializer


class GrupoInvestigacionViewSet(viewsets.ModelViewSet):
    queryset = GrupoInvestigacion.objects.all()
    serializer_class = GrupoInvestigacionSerializer


class InformeRendicionCuentasViewSet(viewsets.ModelViewSet):
    queryset = InformeRendicionCuentas.objects.all()
    serializer_class = InformeRendicionCuentasSerializer


class ErogacionViewSet(viewsets.ModelViewSet):
    queryset = Erogacion.objects.all()
    serializer_class = ErogacionSerializer


class ProyectoInvestigacionViewSet(viewsets.ModelViewSet):
    queryset = ProyectoInvestigacion.objects.all()
    serializer_class = ProyectoInvestigacionSerializer


class LineaDeInvestigacionViewSet(viewsets.ModelViewSet):
    queryset = LineaDeInvestigacion.objects.all()
    serializer_class = LineaDeInvestigacionSerializer


class ActividadViewSet(viewsets.ModelViewSet):
    queryset = Actividad.objects.all()
    serializer_class = ActividadSerializer


class PersonaViewSet(viewsets.ModelViewSet):
    queryset = Persona.objects.all()
    serializer_class = PersonaSerializer


class ActividadDocenteViewSet(viewsets.ModelViewSet):
    queryset = ActividadDocente.objects.all()
    serializer_class = ActividadDocenteSerializer


class InvestigadorDocenteViewSet(viewsets.ModelViewSet):
    queryset = InvestigadorDocente.objects.all()
    serializer_class = InvestigadorDocenteSerializer


class BecarioPersonalFormacionViewSet(viewsets.ModelViewSet):
    queryset = BecarioPersonalFormacion.objects.all()
    serializer_class = BecarioPersonalFormacionSerializer


class InvestigadorViewSet(viewsets.ModelViewSet):
    queryset = Investigador.objects.all()
    serializer_class = InvestigadorSerializer


class DocumentacionBibliotecaViewSet(viewsets.ModelViewSet):
    queryset = DocumentacionBiblioteca.objects.all()
    serializer_class = DocumentacionBibliotecaSerializer


class TrabajoPublicadoViewSet(viewsets.ModelViewSet):
    queryset = TrabajoPublicado.objects.all()
    serializer_class = TrabajoPublicadoSerializer


class ActividadTransferenciaViewSet(viewsets.ModelViewSet):
    queryset = ActividadTransferencia.objects.all()
    serializer_class = ActividadTransferenciaSerializer


class ParteExternaViewSet(viewsets.ModelViewSet):
    queryset = ParteExterna.objects.all()
    serializer_class = ParteExternaSerializer


class EquipamientoInfraestructuraViewSet(viewsets.ModelViewSet):
    queryset = EquipamientoInfraestructura.objects.all()
    serializer_class = EquipamientoInfraestructuraSerializer


class TrabajoPresentadoViewSet(viewsets.ModelViewSet):
    queryset = TrabajoPresentado.objects.all()
    serializer_class = TrabajoPresentadoSerializer


class ActividadXPersonaViewSet(viewsets.ModelViewSet):
    queryset = ActividadXPersona.objects.all()
    serializer_class = ActividadXPersonaSerializer
