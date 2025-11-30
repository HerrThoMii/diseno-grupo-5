import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from app.models import GrupoInvestigacion, ProgramaActividades

def crear_datos_iniciales():
    """Crea datos iniciales necesarios para que la aplicación funcione"""
    
    # Crear Programa de Actividades
    programa, created = ProgramaActividades.objects.get_or_create(
        anio=2025,
        defaults={
            'objetivosEstrategicos': 'Objetivos estratégicos del programa 2025'
        }
    )
    
    if created:
        print(f"✅ Creado Programa de Actividades: {programa}")
    else:
        print(f"ℹ️  Programa de Actividades ya existe: {programa}")
    
    # Crear Grupo de Investigación
    grupo, created = GrupoInvestigacion.objects.get_or_create(
        nombre='Grupo de Investigación Principal',
        defaults={
            'facultadReginalAsignada': 'Facultad Regional Buenos Aires',
            'correo': 'grupo@utn.edu.ar',
            'organigrama': 'Organigrama del grupo',
            'sigla': 'GIP',
            'fuenteFinanciamiento': 'Universidad',
            'ProgramaActividades': programa
        }
    )
    
    if created:
        print(f"✅ Creado Grupo de Investigación: {grupo}")
    else:
        print(f"ℹ️  Grupo de Investigación ya existe: {grupo}")
    
    print("\n🎉 Datos iniciales creados correctamente!")
    print(f"📊 Total de Grupos: {GrupoInvestigacion.objects.count()}")
    print(f"📊 Total de Programas: {ProgramaActividades.objects.count()}")

if __name__ == '__main__':
    crear_datos_iniciales()
