from django.contrib import admin
from django.contrib.auth.hashers import make_password
from .models import Persona, GrupoInvestigacion, TipoDePersonal, ProgramaActividades, TipoDeRegistro

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

admin.site.register(GrupoInvestigacion)
admin.site.register(TipoDePersonal)
admin.site.register(ProgramaActividades)
admin.site.register(TipoDeRegistro)