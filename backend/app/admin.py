from django.contrib import admin
from django.contrib.auth.hashers import make_password
from .models import (
    Persona, MemoriaAnual, IntegranteMemoria, ProgramaActividades, TrabajoMemoria, 
    ActividadMemoria, PublicacionMemoria, PatenteMemoria, ProyectoMemoria,
    GrupoInvestigacion
)

# Register your models here.

@admin.register(Persona)
class PersonaAdmin(admin.ModelAdmin):
    list_display = ['oidpersona', 'nombre', 'apellido', 'correo', 'tipoDePersonal']
    search_fields = ['nombre', 'apellido', 'correo']
    list_filter = ['tipoDePersonal']

    def save_model(self, request, obj, form, change):
        if 'contrasena' in form.changed_data:
            obj.contrasena = make_password(obj.contrasena)
        super().save_model(request, obj, form, change)


@admin.register(GrupoInvestigacion)
class GrupoInvestigacionAdmin(admin.ModelAdmin):
    list_display = ['oidGrupoInvestigacion', 'nombre', 'sigla', 'correo']
    search_fields = ['nombre', 'sigla']


@admin.register(MemoriaAnual)
class MemoriaAnualAdmin(admin.ModelAdmin):
    list_display = ['oidMemoriaAnual', 'anio', 'GrupoInvestigacion', 'director', 'vicedirector', 'fechaCreacion']
    list_filter = ['anio', 'GrupoInvestigacion']
    search_fields = ['anio']
    date_hierarchy = 'fechaCreacion'


@admin.register(IntegranteMemoria)
class IntegranteMemoriaAdmin(admin.ModelAdmin):
    list_display = ['oidIntegranteMemoria', 'MemoriaAnual', 'persona', 'rol', 'horasSemanales']
    list_filter = ['rol', 'MemoriaAnual']
    search_fields = ['persona__nombre', 'persona__apellido']


@admin.register(TrabajoMemoria)
class TrabajoMemoriaAdmin(admin.ModelAdmin):
    list_display = ['oidTrabajoMemoria', 'titulo', 'ciudad', 'fecha', 'MemoriaAnual']
    list_filter = ['ciudad', 'fecha', 'MemoriaAnual']
    search_fields = ['titulo', 'nombreReunion']
    date_hierarchy = 'fecha'


@admin.register(ActividadMemoria)
class ActividadMemoriaAdmin(admin.ModelAdmin):
    list_display = ['oidActividadMemoria', 'titulo', 'tipo', 'fecha', 'MemoriaAnual']
    list_filter = ['tipo', 'fecha', 'MemoriaAnual']
    search_fields = ['titulo', 'descripcion']
    date_hierarchy = 'fecha'


@admin.register(PublicacionMemoria)
class PublicacionMemoriaAdmin(admin.ModelAdmin):
    list_display = ['oidPublicacionMemoria', 'titulo', 'autor', 'revista', 'anio', 'MemoriaAnual']
    list_filter = ['anio', 'MemoriaAnual']
    search_fields = ['titulo', 'autor', 'revista']


@admin.register(PatenteMemoria)
class PatenteMemoriaAdmin(admin.ModelAdmin):
    list_display = ['oidPatenteMemoria', 'titulo', 'numero', 'estado', 'fecha', 'MemoriaAnual']
    list_filter = ['estado', 'fecha', 'MemoriaAnual']
    search_fields = ['titulo', 'numero']
    date_hierarchy = 'fecha'


@admin.register(ProyectoMemoria)
class ProyectoMemoriaAdmin(admin.ModelAdmin):
    list_display = ['oidProyectoMemoria', 'nombre', 'estado', 'fechaInicio', 'fechaFin', 'MemoriaAnual']
    list_filter = ['estado', 'fechaInicio', 'MemoriaAnual']
    search_fields = ['nombre', 'responsable']
    date_hierarchy = 'fechaInicio'

admin.site.register(ProgramaActividades)