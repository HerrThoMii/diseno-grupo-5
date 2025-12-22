# Guía de Integración Frontend-Backend

## 🚀 Servidor Backend Iniciado

El servidor Django está corriendo en: **http://127.0.0.1:8000/**

## 📡 Endpoints Disponibles

### Memoria Anual
- `GET /api/memorias-anuales/` - Obtener todas las memorias
- `POST /api/memorias-anuales/` - Crear nueva memoria
- `GET /api/memorias-anuales/{id}/` - Obtener memoria específica
- `PUT /api/memorias-anuales/{id}/` - Actualizar memoria
- `DELETE /api/memorias-anuales/{id}/` - Eliminar memoria

### Integrantes
- `GET /api/integrantes-memoria/` - Obtener todos los integrantes
- `POST /api/integrantes-memoria/` - Crear nuevo integrante
- `GET /api/integrantes-memoria/{id}/` - Obtener integrante específico
- `PUT /api/integrantes-memoria/{id}/` - Actualizar integrante
- `DELETE /api/integrantes-memoria/{id}/` - Eliminar integrante

### Trabajos
- `GET /api/trabajos-memoria/` - Obtener todos los trabajos
- `POST /api/trabajos-memoria/` - Crear nuevo trabajo
- `GET /api/trabajos-memoria/{id}/` - Obtener trabajo específico
- `PUT /api/trabajos-memoria/{id}/` - Actualizar trabajo
- `DELETE /api/trabajos-memoria/{id}/` - Eliminar trabajo

### Actividades
- `GET /api/actividades-memoria/` - Obtener todas las actividades
- `POST /api/actividades-memoria/` - Crear nueva actividad
- Etc...

### Publicaciones
- `GET /api/publicaciones-memoria/` - Obtener todas las publicaciones
- `POST /api/publicaciones-memoria/` - Crear nueva publicación
- Etc...

### Patentes
- `GET /api/patentes-memoria/` - Obtener todas las patentes
- `POST /api/patentes-memoria/` - Crear nueva patente
- Etc...

### Proyectos
- `GET /api/proyectos-memoria/` - Obtener todos los proyectos
- `POST /api/proyectos-memoria/` - Crear nuevo proyecto
- Etc...

## 💻 Cómo usar en el componente MemoriaAnual

### 1. Importar el servicio

```javascript
import { MemoriaAnualService } from '../services/memoriaAnualService';
```

### 2. Agregar función para guardar

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const resultado = await MemoriaAnualService.guardarMemoriaCompleta(formData);
    
    if (resultado.success) {
      alert('Memoria anual guardada exitosamente!');
      console.log('Datos guardados:', resultado.data);
      // Limpiar formulario o redirigir
    } else {
      alert('Error al guardar: ' + resultado.message);
      console.error('Error:', resultado.error);
    }
  } catch (error) {
    alert('Error inesperado al guardar');
    console.error('Error:', error);
  }
};
```

### 3. Agregar botón de guardar en el componente

```javascript
<button 
  type="button" 
  className="btn-submit" 
  onClick={handleSubmit}
>
  Guardar Memoria Anual
</button>
```

## 🔧 Ejemplo completo de integración

```javascript
// En MemoriaAnual.jsx, agregar al final del archivo antes del export:

const handleGuardar = async () => {
  try {
    // Validar que haya datos mínimos
    if (!formData.anio || !formData.numero) {
      alert('Por favor complete año y número de memoria');
      return;
    }

    const resultado = await MemoriaAnualService.guardarMemoriaCompleta(formData);
    
    if (resultado.success) {
      alert('✅ Memoria anual guardada exitosamente!');
      console.log('Memoria guardada:', resultado.data);
      
      // Opcional: Limpiar formulario
      // setFormData({ ...estadoInicial });
    } else {
      alert('❌ Error al guardar: ' + resultado.message);
      console.error('Detalles del error:', resultado.error);
    }
  } catch (error) {
    alert('❌ Error inesperado');
    console.error('Error:', error);
  }
};
```

## 📝 Ejemplo de cargar datos existentes

```javascript
// Cargar una memoria existente al montar el componente
useEffect(() => {
  const cargarMemoria = async () => {
    const resultado = await MemoriaAnualService.obtenerMemoriaPorId(1);
    
    if (resultado.success) {
      // Mapear los datos del backend al formato del frontend
      setFormData({
        anio: resultado.data.anio,
        numero: resultado.data.numero,
        // ... resto de campos
        integrantes: resultado.data.integrantes || [],
        trabajos: resultado.data.trabajos || [],
        // etc.
      });
    }
  };
  
  cargarMemoria();
}, []);
```

## 🎯 Próximos pasos sugeridos

1. **Agregar botón de guardar** en el componente MemoriaAnual
2. **Validar datos** antes de enviar al backend
3. **Mostrar indicadores de carga** mientras se guardan los datos
4. **Implementar manejo de errores** con mensajes amigables
5. **Crear página de listado** de memorias anuales guardadas
6. **Agregar funcionalidad de edición** de memorias existentes

## 🔍 Probar las APIs

Puedes probar las APIs directamente en el navegador:

- Lista de memorias: http://127.0.0.1:8000/api/memorias-anuales/
- Admin de Django: http://127.0.0.1:8000/admin/

## ⚠️ Notas Importantes

- El servidor backend debe estar corriendo en el puerto 8000
- El servidor frontend debe estar corriendo en el puerto 5173
- CORS ya está configurado para permitir peticiones entre ambos servidores
- Los datos se guardan en SQLite (`backend/db.sqlite3`)
