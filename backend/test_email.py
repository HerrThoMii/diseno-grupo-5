import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings

print("=" * 60)
print("PRUEBA DE ENVÍO DE EMAIL")
print("=" * 60)
print(f"EMAIL_BACKEND: {settings.EMAIL_BACKEND}")
print(f"EMAIL_HOST: {settings.EMAIL_HOST}")
print(f"EMAIL_PORT: {settings.EMAIL_PORT}")
print(f"EMAIL_USE_TLS: {settings.EMAIL_USE_TLS}")
print(f"EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}")
print(f"EMAIL_HOST_PASSWORD: {'*' * len(settings.EMAIL_HOST_PASSWORD) if settings.EMAIL_HOST_PASSWORD else '(vacío)'}")
print(f"DEFAULT_FROM_EMAIL: {settings.DEFAULT_FROM_EMAIL}")
print("=" * 60)

# Email de prueba
email_destino = input("Ingresa el email donde quieres recibir la prueba: ").strip()

try:
    print(f"\nEnviando email de prueba a {email_destino}...")
    
    send_mail(
        subject='Prueba de Email - UTN',
        message='Este es un email de prueba. Si lo recibes, la configuración está correcta.',
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email_destino],
        fail_silently=False,
    )
    
    print("✓ Email enviado exitosamente!")
    print(f"Revisa la bandeja de entrada de {email_destino}")
    print("Si no lo ves, revisa la carpeta de SPAM/No deseados")
    
except Exception as e:
    print(f"✗ Error al enviar email:")
    print(f"   {type(e).__name__}: {str(e)}")
    print("\nPosibles soluciones:")
    print("1. Verifica que la contraseña de aplicación sea correcta")
    print("2. Asegúrate de que la verificación en 2 pasos esté activada")
    print("3. Regenera la contraseña de aplicación en Google")
