from django.contrib import admin
from django.contrib.auth.hashers import make_password
from .models import (
    Persona, GrupoInvestigacion, TipoDePersonal, ProgramaActividades, TipoDeRegistro,
    GradoAcademico, CategoriaUtn, Dedicacion, ProgramaDeIncentivos,
    DenominacionCursoCatedra, RolDesempenado
)

# Register your models here.

@admin.register(Persona)
class PersonaAdmin(admin.ModelAdmin):
    list_display = ['oidpersona', 'nombre', 'apellido', 'correo']
    search_fields = ['nombre', 'apellido', 'correo']
    list_filter = ['dedicacion', 'programaDeIncentivos']
    filter_horizontal = ['tipoDePersonal', 'gradoAcademico', 'categoriaUtn', 'denominacionCursoCatedra', 'rolDesempenado']
    fieldsets = (
        ('Información Personal', {
            'fields': ('nombre', 'apellido', 'correo', 'contrasena')
        }),
        ('Información Laboral', {
            'fields': ('tipoDePersonal', 'horasSemanales', 'GrupoInvestigacion')
        }),
        ('Información Académica', {
            'fields': ('gradoAcademico', 'categoriaUtn', 'dedicacion', 'programaDeIncentivos')
        }),
        ('Actividad Docente', {
            'fields': ('denominacionCursoCatedra', 'rolDesempenado', 'fechaPeriodoDictadoInicio', 'fechaPeriodoDictadoFin')
        }),
    )

    def save_model(self, request, obj, form, change):
        if 'contrasena' in form.changed_data:
            obj.contrasena = make_password(obj.contrasena)
        super().save_model(request, obj, form, change)

admin.site.register(GrupoInvestigacion)
admin.site.register(TipoDePersonal)
admin.site.register(ProgramaActividades)
admin.site.register(TipoDeRegistro)
admin.site.register(GradoAcademico)
admin.site.register(CategoriaUtn)
admin.site.register(Dedicacion)
admin.site.register(ProgramaDeIncentivos)
admin.site.register(DenominacionCursoCatedra)
admin.site.register(RolDesempenado)