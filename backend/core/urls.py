from rest_framework.routers import DefaultRouter
from .views import (
    ProgramaActividadesViewSet, GrupoInvestigacionViewSet,
    InformeRendicionCuentasViewSet, ErogacionViewSet,
    ProyectoInvestigacionViewSet, LineaDeInvestigacionViewSet,
    ActividadViewSet, PersonaViewSet, ActividadDocenteViewSet,
    InvestigadorDocenteViewSet, BecarioPersonalFormacionViewSet,
    InvestigadorViewSet, DocumentacionBibliotecaViewSet,
    TrabajoPublicadoViewSet, ActividadTransferenciaViewSet,
    ParteExternaViewSet, EquipamientoInfraestructuraViewSet,
    TrabajoPresentadoViewSet, ActividadXPersonaViewSet
)

router = DefaultRouter()

router.register(r'programa-actividades', ProgramaActividadesViewSet)
router.register(r'grupos', GrupoInvestigacionViewSet)
router.register(r'informes-rendicion', InformeRendicionCuentasViewSet)
router.register(r'erogaciones', ErogacionViewSet)
router.register(r'proyectos', ProyectoInvestigacionViewSet)
router.register(r'lineas-investigacion', LineaDeInvestigacionViewSet)
router.register(r'actividades', ActividadViewSet)
router.register(r'personas', PersonaViewSet)
router.register(r'actividades-docentes', ActividadDocenteViewSet)
router.register(r'investigadores-docentes', InvestigadorDocenteViewSet)
router.register(r'becarios', BecarioPersonalFormacionViewSet)
router.register(r'investigadores', InvestigadorViewSet)
router.register(r'documentacion', DocumentacionBibliotecaViewSet)
router.register(r'trabajos-publicados', TrabajoPublicadoViewSet)
router.register(r'actividades-transferencia', ActividadTransferenciaViewSet)
router.register(r'partes-externas', ParteExternaViewSet)
router.register(r'equipamiento', EquipamientoInfraestructuraViewSet)
router.register(r'trabajos-presentados', TrabajoPresentadoViewSet)
router.register(r'actividades-persona', ActividadXPersonaViewSet)

urlpatterns = router.urls
