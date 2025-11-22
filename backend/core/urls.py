"""
URL configuration for core project.

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
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from app.views import (
    login, perfil, actualizar_perfil, eliminar_persona, listar_personas, TrabajoPublicadoViewSet, TrabajoPresentadoSerializer
)

router = DefaultRouter()
router.register(r'trabajos-publicados', TrabajoPublicadoViewSet, basename='trabajo-publicado')
router.register(r'trabajos-presentados', TrabajoPresentadoSerializer, basename='trabajo-presentado')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/login/', login, name='login'),
    path('api/auth/personas/', listar_personas, name='listar_personas'),
    path('api/auth/perfil/<int:oidpersona>/', perfil, name='perfil'),
    path('api/auth/perfil/<int:oidpersona>/actualizar/', actualizar_perfil, name='actualizar_perfil'),
    path('api/auth/persona/<int:oidpersona>/eliminar/', eliminar_persona, name='eliminar_persona'),
    path('api/', include(router.urls)),
]
