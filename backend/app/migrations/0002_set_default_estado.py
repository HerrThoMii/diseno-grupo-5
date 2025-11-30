from django.db import migrations, models


def set_estados(apps, schema_editor):
    TrabajoPublicado = apps.get_model('app', 'TrabajoPublicado')
    # Set empty or null estado to the default value for existing records
    TrabajoPublicado.objects.filter(estado__isnull=True).update(estado='Realizado')
    TrabajoPublicado.objects.filter(estado='').update(estado='Realizado')


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(set_estados, reverse_code=migrations.RunPython.noop),
        migrations.AlterField(
            model_name='trabajopublicado',
            name='estado',
            field=models.CharField(max_length=55, default='Realizado'),
        ),
    ]
