import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from app.models import MemoriaAnual

# Actualizar la memoria ID 1 para que tenga vicedirector
memoria = MemoriaAnual.objects.get(oidMemoriaAnual=1)
memoria.vicedirector = '3'  # ID de Javier Marchesini
memoria.save()

print(f'Memoria actualizada:')
print(f'  Director: {memoria.director}')
print(f'  Vicedirector: {memoria.vicedirector}')
print('Ahora recarga Ver Memorias y verás el vicedirector')
