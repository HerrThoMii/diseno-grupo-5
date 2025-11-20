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

<<<<<<< HEAD
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
=======
The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from app.views import (
    login, perfil, actualizar_perfil, eliminar_persona, listar_personas
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/login/', login, name='login'),
    path('api/auth/personas/', listar_personas, name='listar_personas'),
    path('api/auth/perfil/<int:oidpersona>/', perfil, name='perfil'),
    path('api/auth/perfil/<int:oidpersona>/actualizar/', actualizar_perfil, name='actualizar_perfil'),
    path('api/auth/persona/<int:oidpersona>/eliminar/', eliminar_persona, name='eliminar_persona'),
]
>>>>>>> ed9c687a39a49d4f94e4fc003793aba238625c9d
