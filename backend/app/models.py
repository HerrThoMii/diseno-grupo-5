from django.db import models


class ProgramaActividades(models.Model):
    oidProgramaActividades = models.AutoField(primary_key=True, unique=True)
    anio = models.IntegerField()
    objetivosEstrategicos = models.TextField()

    def __str__(self):
        return f"Programa {self.anio}"


class GrupoInvestigacion(models.Model):
    oidGrupoInvestigacion = models.AutoField(primary_key=True, unique=True)
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

class Patente(models.Model):
    oidPatente = models.AutoField(primary_key=True, unique=True)
    descripcion = models.TextField()
    tipo = models.CharField(max_length=45)
    GrupoInvestigacion = models.ForeignKey(
        GrupoInvestigacion, on_delete=models.CASCADE
    )

class Registro(models.Model):
    oidRegistro = models.AutoField(primary_key=True, unique=True)
    descripcion = models.TextField()
    tipoRegistro = models.TextField(max_length=45)
    Patente = models.ForeignKey(
        Patente, on_delete=models.CASCADE
    )

class InformeRendicionCuentas(models.Model):
    oidInformeRendicionCuentas = models.AutoField(primary_key=True, unique=True)
    periodoReportado = models.CharField(max_length=50)
    GrupoInvestigacion = models.ForeignKey(
        GrupoInvestigacion, on_delete=models.CASCADE
    )


class Erogacion(models.Model):
    oidErogacion = models.AutoField(primary_key=True, unique=True)
    egresos = models.FloatField()
    ingresos = models.FloatField()
    numero = models.IntegerField()
    tipoErogacion = models.TextField()
    InformeRendicionCuentas = models.ForeignKey(
        InformeRendicionCuentas, on_delete=models.CASCADE
    )


class ProyectoInvestigacion(models.Model):
    oidProyectoInvestigacion = models.AutoField(primary_key=True, unique=True)
    codigoProyecto = models.CharField(max_length=50, unique=True)
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
    oidLineaDeInvestigacion = models.AutoField(primary_key=True, unique=True)
    nombre = models.CharField(max_length=45)
    descripcion = models.TextField()
    ProgramaActividades = models.ForeignKey(
        ProgramaActividades, on_delete=models.CASCADE
    )



class Actividad(models.Model):
    oidActividad = models.AutoField(primary_key=True, unique=True)
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
    oidpersona = models.AutoField(primary_key=True, unique=True)
    nombre = models.CharField(max_length=45)
    apellido = models.CharField(max_length=45)
    correo = models.EmailField(unique=True)
    contrasena = models.CharField(max_length=128)
    horasSemanales = models.IntegerField()
    tipoDePersonal = models.TextField()
    GrupoInvestigacion = models.ForeignKey(
        GrupoInvestigacion, on_delete=models.CASCADE
    )

    def __str__(self):
        return f"{self.nombre} {self.apellido}"


class ActividadDocente(models.Model):
    oidActividadDocente = models.AutoField(primary_key=True, unique=True)
    denominacionCursoCatedra = models.TextField()
    fechaPeriodoDictado = models.DateTimeField()
    rolDesenpeniado = models.TextField()


class InvestigadorDocente(models.Model):
    oidinvestigadorDocente = models.AutoField(primary_key=True, unique=True)
    gradoAcademico = models.TextField()
    persona = models.OneToOneField(Persona, on_delete=models.CASCADE)
    ActividadDocente = models.ForeignKey(
        ActividadDocente, on_delete=models.CASCADE
    )


class BecarioPersonalFormacion(models.Model):
    oidbecarioPersonalFormacioncol = models.AutoField(primary_key=True, unique=True)
    tipoFormacion = models.TextField()
    fuenteFinanciamiento = models.TextField()
    persona = models.OneToOneField(Persona, on_delete=models.CASCADE)


class Investigador(models.Model):
    oidInvestigador = models.AutoField(primary_key=True, unique=True)
    tipoInvestigador = models.TextField()
    categoriaUtn = models.TextField()
    dedicacion = models.TextField()
    programaDeInsentivos = models.TextField()
    persona = models.OneToOneField(Persona, on_delete=models.CASCADE)
    GrupoInvestigacion = models.ForeignKey(
        GrupoInvestigacion, on_delete=models.CASCADE
    )


class DocumentacionBiblioteca(models.Model):
    oidDocumentacionBiblioteca = models.AutoField(primary_key=True, unique=True)
    anio = models.IntegerField()
    editorial = models.TextField()
    titulo = models.TextField()
    autor = models.TextField()
    GrupoInvestigacion = models.ForeignKey(
        GrupoInvestigacion, on_delete=models.CASCADE
    )


class TrabajoPublicado(models.Model):
    oidTrabajoPublicado = models.AutoField(primary_key=True, unique=True)
    autor = models.TextField()
    titulo = models.TextField()
    tipoTrabajoPublicado = models.TextField()
    GrupoInvestigacion = models.ForeignKey(
        GrupoInvestigacion, on_delete=models.CASCADE
    )


class ActividadTransferencia(models.Model):
    oidActividadTransferencia = models.AutoField(primary_key=True, unique=True)
    descripcion = models.TextField()
    denominacion = models.TextField()
    monto = models.FloatField()
    nroActividadTransferencia = models.IntegerField()
    tipoActivdad = models.CharField(max_length=45)
    GrupoInvestigacion = models.ForeignKey(
        GrupoInvestigacion, on_delete=models.CASCADE
    )


class ParteExterna(models.Model):
    oidParteExterna = models.AutoField(primary_key=True, unique=True)
    descripcion = models.TextField()
    nombre = models.CharField(max_length=45)
    tipoParte = models.TextField()
    ActividadTransferencia = models.ForeignKey(
        ActividadTransferencia, on_delete=models.CASCADE
    )


class EquipamientoInfraestructura(models.Model):
    oidEquipamientoInfraestructura = models.AutoField(primary_key=True, unique=True)
    denominacion = models.TextField()
    descripcion = models.TextField()
    fechaIncoporacion = models.DateField()
    montoInvertido = models.FloatField()
    GrupoInvestigacion = models.ForeignKey(
        GrupoInvestigacion, on_delete=models.CASCADE
    )


class TrabajoPresentado(models.Model):
    oidTrabajoPresentado = models.AutoField(primary_key=True, unique=True)
    ciudad = models.TextField()
    fechaInicio = models.DateTimeField()
    nombreReunion = models.TextField()
    tituloTrabajo = models.TextField()
    GrupoInvestigacion = models.ForeignKey(
        GrupoInvestigacion, on_delete=models.CASCADE
    )


class ActividadXPersona(models.Model):
    oidActividadXPersona = models.AutoField(primary_key=True, unique=True)
    Actividad = models.ForeignKey(Actividad, on_delete=models.CASCADE)
    persona = models.ForeignKey(Persona, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("Actividad", "persona")


class MemoriaAnual(models.Model):
    oidMemoriaAnual = models.AutoField(primary_key=True, unique=True)
    anio = models.IntegerField()
    fechaCreacion = models.DateTimeField(auto_now_add=True)
    fechaActualizacion = models.DateTimeField(auto_now=True)
    GrupoInvestigacion = models.ForeignKey(
        GrupoInvestigacion, on_delete=models.CASCADE, related_name='memorias'
    )
    director = models.ForeignKey(
        Persona, on_delete=models.SET_NULL, null=True, related_name='memorias_como_director'
    )
    vicedirector = models.ForeignKey(
        Persona, on_delete=models.SET_NULL, null=True, related_name='memorias_como_vicedirector'
    )

    class Meta:
        unique_together = ('anio', 'GrupoInvestigacion')
        ordering = ['-anio']

    def __str__(self):
        return f"Memoria {self.anio} - {self.GrupoInvestigacion.nombre}"


class IntegranteMemoria(models.Model):
    oidIntegranteMemoria = models.AutoField(primary_key=True, unique=True)
    MemoriaAnual = models.ForeignKey(
        MemoriaAnual, on_delete=models.CASCADE, related_name='integrantes'
    )
    persona = models.ForeignKey(Persona, on_delete=models.CASCADE)
    rol = models.CharField(max_length=100)
    horasSemanales = models.IntegerField()

    def __str__(self):
        return f"{self.persona.nombre} {self.persona.apellido} - {self.rol}"


class TrabajoMemoria(models.Model):
    oidTrabajoMemoria = models.AutoField(primary_key=True, unique=True)
    MemoriaAnual = models.ForeignKey(
        MemoriaAnual, on_delete=models.CASCADE, related_name='trabajos'
    )
    ciudad = models.CharField(max_length=100)
    fecha = models.DateField()
    nombreReunion = models.TextField()
    titulo = models.TextField()

    def __str__(self):
        return self.titulo


class ActividadMemoria(models.Model):
    oidActividadMemoria = models.AutoField(primary_key=True, unique=True)
    MemoriaAnual = models.ForeignKey(
        MemoriaAnual, on_delete=models.CASCADE, related_name='actividades_memoria'
    )
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    fecha = models.DateField()
    tipo = models.CharField(max_length=50)

    def __str__(self):
        return self.titulo


class PublicacionMemoria(models.Model):
    oidPublicacionMemoria = models.AutoField(primary_key=True, unique=True)
    MemoriaAnual = models.ForeignKey(
        MemoriaAnual, on_delete=models.CASCADE, related_name='publicaciones_memoria'
    )
    titulo = models.TextField()
    autor = models.TextField()
    revista = models.CharField(max_length=200)
    anio = models.IntegerField()

    def __str__(self):
        return self.titulo


class PatenteMemoria(models.Model):
    oidPatenteMemoria = models.AutoField(primary_key=True, unique=True)
    MemoriaAnual = models.ForeignKey(
        MemoriaAnual, on_delete=models.CASCADE, related_name='patentes_memoria'
    )
    titulo = models.TextField()
    numero = models.CharField(max_length=100)
    fecha = models.DateField()
    estado = models.CharField(max_length=50)

    def __str__(self):
        return self.titulo


class ProyectoMemoria(models.Model):
    oidProyectoMemoria = models.AutoField(primary_key=True, unique=True)
    MemoriaAnual = models.ForeignKey(
        MemoriaAnual, on_delete=models.CASCADE, related_name='proyectos_memoria'
    )
    nombre = models.CharField(max_length=200)
    estado = models.CharField(max_length=50)
    fechaInicio = models.DateField()
    fechaFin = models.DateField(null=True, blank=True)
    responsable = models.TextField()
    responsableTitulo = models.CharField(max_length=200, blank=True)
    presupuesto = models.CharField(max_length=100, blank=True)
    colaboradores = models.TextField(blank=True)
    colaboradoresTitulo = models.CharField(max_length=200, blank=True)
    objetivos = models.TextField(blank=True)
    objetivosTitulo = models.CharField(max_length=200, blank=True)
    resultados = models.TextField(blank=True)
    resultadosTitulo = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return self.nombre
