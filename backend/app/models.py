from django.db import models


class ProgramaActividades(models.Model):
    oidProgramaActividades = models.AutoField(primary_key=True)
    anio = models.IntegerField()
    objetivosEstrategicos = models.TextField()

    def __str__(self):
        return f"Programa {self.anio}"


class GrupoInvestigacion(models.Model):
    oidGrupoInvestigacion = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=45)
    facultadReginalAsignada = models.TextField()
    correo = models.TextField()
    organigrama = models.TextField()
    sigla = models.CharField(max_length=45)
    fuenteFinanciamiento = models.TextField()
    ProgramaActividades = models.ForeignKey(
        ProgramaActividades, on_delete=models.CASCADE
    )

    def __str__(self):
        return self.nombre


class InformeRendicionCuentas(models.Model):
    oidInformeRendicionCuentas = models.AutoField(primary_key=True)
    periodoReportado = models.CharField(max_length=50)
    GrupoInvestigacion = models.ForeignKey(
        GrupoInvestigacion, on_delete=models.CASCADE
    )


class Erogacion(models.Model):
    oidErogacion = models.AutoField(primary_key=True)
    egresos = models.FloatField()
    ingresos = models.FloatField()
    numero = models.IntegerField()
    tipoErogacion = models.TextField()
    InformeRendicionCuentas = models.ForeignKey(
        InformeRendicionCuentas, on_delete=models.CASCADE
    )


class ProyectoInvestigacion(models.Model):
    oidProyectoInvestigacion = models.AutoField(primary_key=True)
    codigoProyecto = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=50)
    objectType = models.CharField(max_length=45)
    fechaFinalizacion = models.DateField()
    fechaInicio = models.DateField()
    nombre = models.CharField(max_length=45)
    tipoProyecto = models.CharField(max_length=50)
    logrosObtenidos = models.CharField(max_length=50)
    fuenteFinanciamiento = models.TextField()
    GrupoInvestigacion = models.ForeignKey(
        GrupoInvestigacion, on_delete=models.CASCADE
    )

    def __str__(self):
        return self.nombre


class LineaDeInvestigacion(models.Model):
    oidLineaDeInvestigacion = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=45)
    descripcion = models.TextField()
    ProgramaActividades = models.ForeignKey(
        ProgramaActividades, on_delete=models.CASCADE
    )



class Actividad(models.Model):
    oidActividad = models.AutoField(primary_key=True)
    descripcion = models.TextField()
    fechaFin = models.DateField()
    fechaInicio = models.DateField()
    nro = models.IntegerField()
    presupuestoAsignado = models.FloatField()
    resultadosEsperados = models.TextField()
    LineaDeInvestigacion = models.ForeignKey(
        LineaDeInvestigacion, on_delete=models.CASCADE
    )


class Persona(models.Model):
    oidpersona = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=45)
    apellido = models.CharField(max_length=45)
    correo = models.EmailField()
    contrasena = models.CharField(max_length=128)
    horasSemanales = models.IntegerField()
    tipoDePersonal = models.TextField()
    GrupoInvestigacion = models.ForeignKey(
        GrupoInvestigacion, on_delete=models.CASCADE
    )

    def __str__(self):
        return f"{self.nombre} {self.apellido}"


class ActividadDocente(models.Model):
    oidActividadDocente = models.AutoField(primary_key=True)
    denominacionCursoCatedra = models.TextField()
    fechaPeriodoDictado = models.DateTimeField()
    rolDesenpeniado = models.TextField()


class InvestigadorDocente(models.Model):
    oidinvestigadorDocente = models.AutoField(primary_key=True)
    gradoAcademico = models.TextField()
    persona = models.OneToOneField(Persona, on_delete=models.CASCADE)
    ActividadDocente = models.ForeignKey(
        ActividadDocente, on_delete=models.CASCADE
    )


class BecarioPersonalFormacion(models.Model):
    oidbecarioPersonalFormacioncol = models.AutoField(primary_key=True)
    tipoFormacion = models.TextField()
    fuenteFinanciamiento = models.TextField()
    persona = models.OneToOneField(Persona, on_delete=models.CASCADE)


class Investigador(models.Model):
    oidInvestigador = models.AutoField(primary_key=True)
    tipoInvestigador = models.TextField()
    categoriaUtn = models.TextField()
    dedicacion = models.TextField()
    programaDeInsentivos = models.TextField()
    persona = models.OneToOneField(Persona, on_delete=models.CASCADE)
    GrupoInvestigacion = models.ForeignKey(
        GrupoInvestigacion, on_delete=models.CASCADE
    )


class DocumentacionBiblioteca(models.Model):
    oidDocumentacionBiblioteca = models.AutoField(primary_key=True)
    anio = models.IntegerField()
    editorial = models.TextField()
    titulo = models.TextField()
    autor = models.TextField()
    GrupoInvestigacion = models.ForeignKey(
        GrupoInvestigacion, on_delete=models.CASCADE
    )


class TrabajoPublicado(models.Model):
    oidTrabajoPublicado = models.AutoField(primary_key=True)
    autor = models.TextField()
    titulo = models.TextField()
    tipoTrabajoPublicado = models.TextField()
    GrupoInvestigacion = models.ForeignKey(
        GrupoInvestigacion, on_delete=models.CASCADE
    )


class ActividadTransferencia(models.Model):
    oidActividadTransferencia = models.AutoField(primary_key=True)
    descripcion = models.TextField()
    denominacion = models.TextField()
    monto = models.FloatField()
    nroActividadTransferencia = models.IntegerField()
    tipoActivdad = models.CharField(max_length=45)
    GrupoInvestigacion = models.ForeignKey(
        GrupoInvestigacion, on_delete=models.CASCADE
    )


class ParteExterna(models.Model):
    oidParteExterna = models.AutoField(primary_key=True)
    descripcion = models.TextField()
    nombre = models.CharField(max_length=45)
    tipoParte = models.TextField()
    ActividadTransferencia = models.ForeignKey(
        ActividadTransferencia, on_delete=models.CASCADE
    )


class EquipamientoInfraestructura(models.Model):
    oidEquipamientoInfraestructura = models.AutoField(primary_key=True)
    denominacion = models.TextField()
    descripcion = models.TextField()
    fechaIncoporacion = models.DateField()
    montoInvertido = models.FloatField()
    GrupoInvestigacion = models.ForeignKey(
        GrupoInvestigacion, on_delete=models.CASCADE
    )


class TrabajoPresentado(models.Model):
    oidTrabajoPresentado = models.AutoField(primary_key=True)
    ciudad = models.TextField()
    fechaInicio = models.DateTimeField()
    nombreReunion = models.TextField()
    tituloTrabajo = models.TextField()
    GrupoInvestigacion = models.ForeignKey(
        GrupoInvestigacion, on_delete=models.CASCADE
    )


class ActividadXPersona(models.Model):
    oidActividadXPersona = models.AutoField(primary_key=True)
    Actividad = models.ForeignKey(Actividad, on_delete=models.CASCADE)
    persona = models.ForeignKey(Persona, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("Actividad", "persona")

