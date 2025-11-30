# Endpoints de Memoria Anual

## Base URL
`http://localhost:8000/api/`

---

## 1. Memoria Anual (Principal)

### GET /memorias/
Listar todas las memorias anuales
- **Query params opcionales:**
  - `grupo`: Filtrar por ID de grupo
  - `anio`: Filtrar por año

**Respuesta:**
```json
[
  {
    "oidMemoriaAnual": 1,
    "anio": 2024,
    "fechaCreacion": "2024-01-15T10:30:00Z",
    "fechaActualizacion": "2024-01-20T14:45:00Z",
    "GrupoInvestigacion": 1,
    "grupo_nombre": "Grupo de Investigación 1",
    "director": 5,
    "director_nombre": "Juan",
    "director_apellido": "Pérez",
    "vicedirector": 8,
    "vicedirector_nombre": "María",
    "vicedirector_apellido": "González",
    "integrantes": [...],
    "trabajos": [...],
    "actividades_memoria": [...],
    "publicaciones_memoria": [...],
    "patentes_memoria": [...],
    "proyectos_memoria": [...]
  }
]
```

### POST /memorias/
Crear una nueva memoria anual

**Body:**
```json
{
  "anio": 2024,
  "GrupoInvestigacion": 1,
  "director": 5,
  "vicedirector": 8
}
```

### GET /memorias/{id}/
Obtener una memoria específica con todos sus datos relacionados

### PUT /memorias/{id}/
Actualizar una memoria anual

### DELETE /memorias/{id}/
Eliminar una memoria anual (elimina todos los datos relacionados en cascada)

---

## 2. Integrantes de Memoria

### GET /memorias-integrantes/
Listar todos los integrantes
- **Query param:** `memoria={id}` - Filtrar por memoria

**Respuesta:**
```json
[
  {
    "oidIntegranteMemoria": 1,
    "MemoriaAnual": 1,
    "persona": 10,
    "persona_nombre": "Carlos",
    "persona_apellido": "López",
    "rol": "Investigador",
    "horasSemanales": 40
  }
]
```

### POST /memorias-integrantes/
Agregar un integrante a la memoria

**Body:**
```json
{
  "MemoriaAnual": 1,
  "persona": 10,
  "rol": "Investigador",
  "horasSemanales": 40
}
```

### PUT /memorias-integrantes/{id}/
Actualizar un integrante

### DELETE /memorias-integrantes/{id}/
Eliminar un integrante

---

## 3. Trabajos de Memoria

### GET /memorias-trabajos/
Listar todos los trabajos
- **Query param:** `memoria={id}` - Filtrar por memoria

**Respuesta:**
```json
[
  {
    "oidTrabajoMemoria": 1,
    "MemoriaAnual": 1,
    "ciudad": "Buenos Aires",
    "fecha": "2024-05-15",
    "nombreReunion": "Congreso Internacional 2024",
    "titulo": "Investigación sobre IA"
  }
]
```

### POST /memorias-trabajos/
Agregar un trabajo

**Body:**
```json
{
  "MemoriaAnual": 1,
  "ciudad": "Buenos Aires",
  "fecha": "2024-05-15",
  "nombreReunion": "Congreso Internacional 2024",
  "titulo": "Investigación sobre IA"
}
```

### PUT /memorias-trabajos/{id}/
Actualizar un trabajo

### DELETE /memorias-trabajos/{id}/
Eliminar un trabajo

---

## 4. Actividades de Memoria

### GET /memorias-actividades/
Listar todas las actividades
- **Query param:** `memoria={id}` - Filtrar por memoria

**Respuesta:**
```json
[
  {
    "oidActividadMemoria": 1,
    "MemoriaAnual": 1,
    "titulo": "Seminario de IA",
    "descripcion": "Descripción detallada del seminario...",
    "fecha": "2024-03-20",
    "tipo": "Seminario"
  }
]
```

### POST /memorias-actividades/
Agregar una actividad

**Body:**
```json
{
  "MemoriaAnual": 1,
  "titulo": "Seminario de IA",
  "descripcion": "Descripción detallada...",
  "fecha": "2024-03-20",
  "tipo": "Seminario"
}
```

**Tipos disponibles:** Congreso, Seminario, Taller, Conferencia, Curso, Otro

### PUT /memorias-actividades/{id}/
Actualizar una actividad

### DELETE /memorias-actividades/{id}/
Eliminar una actividad

---

## 5. Publicaciones de Memoria

### GET /memorias-publicaciones/
Listar todas las publicaciones
- **Query param:** `memoria={id}` - Filtrar por memoria

**Respuesta:**
```json
[
  {
    "oidPublicacionMemoria": 1,
    "MemoriaAnual": 1,
    "titulo": "Avances en Machine Learning",
    "autor": "Juan Pérez, María González",
    "revista": "Journal of AI Research",
    "anio": 2024
  }
]
```

### POST /memorias-publicaciones/
Agregar una publicación

**Body:**
```json
{
  "MemoriaAnual": 1,
  "titulo": "Avances en Machine Learning",
  "autor": "Juan Pérez, María González",
  "revista": "Journal of AI Research",
  "anio": 2024
}
```

### PUT /memorias-publicaciones/{id}/
Actualizar una publicación

### DELETE /memorias-publicaciones/{id}/
Eliminar una publicación

---

## 6. Patentes de Memoria

### GET /memorias-patentes/
Listar todas las patentes
- **Query param:** `memoria={id}` - Filtrar por memoria

**Respuesta:**
```json
[
  {
    "oidPatenteMemoria": 1,
    "MemoriaAnual": 1,
    "titulo": "Sistema de reconocimiento facial",
    "numero": "AR-2024-001",
    "fecha": "2024-02-15",
    "estado": "Aprobada"
  }
]
```

### POST /memorias-patentes/
Agregar una patente

**Body:**
```json
{
  "MemoriaAnual": 1,
  "titulo": "Sistema de reconocimiento facial",
  "numero": "AR-2024-001",
  "fecha": "2024-02-15",
  "estado": "Aprobada"
}
```

### PUT /memorias-patentes/{id}/
Actualizar una patente

### DELETE /memorias-patentes/{id}/
Eliminar una patente

---

## 7. Proyectos de Memoria

### GET /memorias-proyectos/
Listar todos los proyectos
- **Query param:** `memoria={id}` - Filtrar por memoria

**Respuesta:**
```json
[
  {
    "oidProyectoMemoria": 1,
    "MemoriaAnual": 1,
    "nombre": "Proyecto IA Aplicada",
    "estado": "En curso",
    "fechaInicio": "2024-01-01",
    "fechaFin": "2024-12-31",
    "responsable": "Dr. Juan Pérez, PhD en Ciencias de la Computación",
    "responsableTitulo": "Dr. Juan Pérez",
    "presupuesto": "$500,000",
    "colaboradores": "María González, Carlos López, Ana Martínez",
    "colaboradoresTitulo": "Equipo de 3 investigadores",
    "objetivos": "Desarrollar algoritmos de IA para...",
    "objetivosTitulo": "Objetivos del proyecto",
    "resultados": "Se lograron implementar 5 módulos...",
    "resultadosTitulo": "Resultados obtenidos"
  }
]
```

### POST /memorias-proyectos/
Agregar un proyecto

**Body:**
```json
{
  "MemoriaAnual": 1,
  "nombre": "Proyecto IA Aplicada",
  "estado": "En curso",
  "fechaInicio": "2024-01-01",
  "fechaFin": "2024-12-31",
  "responsable": "Texto completo del responsable",
  "responsableTitulo": "Título corto",
  "presupuesto": "$500,000",
  "colaboradores": "Lista de colaboradores",
  "colaboradoresTitulo": "Título corto",
  "objetivos": "Descripción completa",
  "objetivosTitulo": "Título corto",
  "resultados": "Descripción completa",
  "resultadosTitulo": "Título corto"
}
```

### PUT /memorias-proyectos/{id}/
Actualizar un proyecto

### DELETE /memorias-proyectos/{id}/
Eliminar un proyecto

---

## Ejemplo de Uso Completo

### 1. Crear una memoria anual
```bash
POST http://localhost:8000/api/memorias/
Content-Type: application/json

{
  "anio": 2024,
  "GrupoInvestigacion": 1,
  "director": 5,
  "vicedirector": 8
}
```

### 2. Agregar integrantes
```bash
POST http://localhost:8000/api/memorias-integrantes/
Content-Type: application/json

{
  "MemoriaAnual": 1,
  "persona": 10,
  "rol": "Investigador Docente",
  "horasSemanales": 40
}
```

### 3. Agregar trabajos
```bash
POST http://localhost:8000/api/memorias-trabajos/
Content-Type: application/json

{
  "MemoriaAnual": 1,
  "ciudad": "Buenos Aires",
  "fecha": "2024-05-15",
  "nombreReunion": "Congreso Internacional",
  "titulo": "Avances en IA"
}
```

### 4. Obtener memoria completa con todos los datos
```bash
GET http://localhost:8000/api/memorias/1/
```

---

## Notas Importantes

1. **Autenticación:** Los endpoints están comentados con `# permission_classes = [IsAuthenticated]`. Para producción, descomenta estas líneas.

2. **Cascada:** Al eliminar una memoria, se eliminan automáticamente todos los datos relacionados (integrantes, trabajos, actividades, etc.)

3. **Filtrado:** Usa query params para filtrar, ej: `/api/memorias-trabajos/?memoria=1`

4. **Validaciones:** Los campos requeridos deben estar presentes en las peticiones POST/PUT

5. **CORS:** Está habilitado para desarrollo (`CORS_ALLOW_ALL_ORIGINS = True` en settings.py)
