import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from app.models import Persona, TipoDePersonal, MemoriaAnual

print('=== Tipos de Personal ===')
for t in TipoDePersonal.objects.all():
    print(f'{t.id}: {t.nombre}')

print('\n=== Personas ===')
for p in Persona.objects.all():
    tipo = p.tipoDePersonal.nombre if p.tipoDePersonal else 'Sin tipo'
    print(f'{p.oidpersona}: {p.nombre} {p.apellido} - Tipo: {tipo}')

print('\n=== Memorias Anuales ===')
for m in MemoriaAnual.objects.all():
    print(f'ID: {m.oidMemoriaAnual}, Año: {m.ano}')
    print(f'  Director: {m.director}')
    print(f'  Vicedirector: {m.vicedirector}')
    print()
