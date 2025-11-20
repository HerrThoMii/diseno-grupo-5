from django.contrib import admin
from .models import (
    ProgramaActividades, GrupoInvestigacion, InformeRendicionCuentas,
    Erogacion, ProyectoInvestigacion, LineaDeInvestigacion, Actividad,
    Persona, ActividadDocente, InvestigadorDocente,
    BecarioPersonalFormacion, Investigador, DocumentacionBiblioteca,
    TrabajoPublicado, ActividadTransferencia, ParteExterna,
    EquipamientoInfraestructura, TrabajoPresentado, ActividadXPersona
)

models = [
    ProgramaActividades, GrupoInvestigacion, InformeRendicionCuentas,
    Erogacion, ProyectoInvestigacion, LineaDeInvestigacion, Actividad,
    Persona, ActividadDocente, InvestigadorDocente,
    BecarioPersonalFormacion, Investigador, DocumentacionBiblioteca,
    TrabajoPublicado, ActividadTransferencia, ParteExterna,
    EquipamientoInfraestructura, TrabajoPresentado, ActividadXPersona
]

for m in models:
    admin.site.register(m)
