import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from app.models import TipoDePersonal

def init_tipo_personal():
    """
    Inicializa tipos de personal si no existen.
    """
    tipos = [
        'Investigador',
        'Docente',
        'Becario',
        'Personal de Apoyo',
        'Director',
        'Coordinador',
    ]
    
    for tipo_nombre in tipos:
        tipo, created = TipoDePersonal.objects.get_or_create(nombre=tipo_nombre)
        if created:
            print(f'✓ Tipo de personal creado: {tipo_nombre}')
        else:
            print(f'- Tipo de personal ya existe: {tipo_nombre}')
    
    print(f'\nTotal de tipos de personal: {TipoDePersonal.objects.count()}')

if __name__ == '__main__':
    init_tipo_personal()
