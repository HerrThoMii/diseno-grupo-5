from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password, check_password
from .models import (
    ProgramaActividades, GrupoInvestigacion, InformeRendicionCuentas,
    Erogacion, ProyectoInvestigacion, LineaDeInvestigacion, Actividad,
    Persona, ActividadDocente, InvestigadorDocente,
    BecarioPersonalFormacion, Investigador, DocumentacionBiblioteca,
    TrabajoPublicado, ActividadTransferencia, ParteExterna,
    EquipamientoInfraestructura, TrabajoPresentado, ActividadXPersona,
    MemoriaAnual, IntegranteMemoria, TrabajoMemoria, ActividadMemoria,
    PublicacionMemoria, PatenteMemoria, ProyectoMemoria
)
from .serializers import (
    ProgramaActividadesSerializer, GrupoInvestigacionSerializer,
    InformeRendicionCuentasSerializer, ErogacionSerializer,
    ProyectoInvestigacionSerializer, LineaDeInvestigacionSerializer,
    ActividadSerializer, PersonaSerializer, ActividadDocenteSerializer,
    InvestigadorDocenteSerializer, BecarioPersonalFormacionSerializer,
    InvestigadorSerializer, DocumentacionBibliotecaSerializer,
    TrabajoPublicadoSerializer, ActividadTransferenciaSerializer,
    ParteExternaSerializer, EquipamientoInfraestructuraSerializer,
    TrabajoPresentadoSerializer, ActividadXPersonaSerializer, LoginSerializer,
    MemoriaAnualSerializer, IntegranteMemoriaSerializer, TrabajoMemoriaSerializer,
    ActividadMemoriaSerializer, PublicacionMemoriaSerializer, PatenteMemoriaSerializer,
    ProyectoMemoriaSerializer
)

# Create your views here.
def get_token_for_user(persona):
    refresh = RefreshToken()
    refresh['oidpersona'] = persona.oidpersona
    refresh['correo'] = persona.correo
    refresh['nombre'] = persona.nombre
    refresh['apellido'] = persona.apellido

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    correo = serializer.validated_data['correo']
    contrasena = serializer.validated_data['contrasena']
    
    try:
        persona = Persona.objects.get(correo = correo)
    except Persona.DoesNotExist:
        return Response(
            {'error': 'Credenciales inválidas'},
            status = status.HTTP_401_UNAUTHORIZED
        )
    
    if not check_password(contrasena, persona.contrasena):
        return Response(
            {'error': 'Credenciales inválidas'},
            status = status.HTTP_401_UNAUTHORIZED
        )
    
    tokens = get_token_for_user(persona)
    serializer = PersonaSerializer(persona)

    return Response({
        'mensaje': 'Login exitoso',
        'persona': serializer.data,
        'tokens': tokens
    }, status = status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    data = request.data.copy()
    
    # Validar campos requeridos
    required_fields = ['nombre', 'apellido', 'correo', 'contrasena', 'GrupoInvestigacion']
    for field in required_fields:
        if field not in data:
            return Response(
                {'error': f'El campo {field} es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    # Verificar si el correo ya existe
    if Persona.objects.filter(correo=data['correo']).exists():
        return Response(
            {'error': 'El correo ya está registrado'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Hashear la contraseña
    data['contrasena'] = make_password(data['contrasena'])
    
    # Valores por defecto si no se proporcionan
    if 'horasSemanales' not in data:
        data['horasSemanales'] = 0
    if 'tipoDePersonal' not in data:
        data['tipoDePersonal'] = 'Investigador'
    
    # Crear el usuario
    serializer = PersonaSerializer(data=data)
    
    if serializer.is_valid():
        persona = serializer.save()
        tokens = get_token_for_user(persona)
        
        return Response({
            'mensaje': 'Registro exitoso',
            'persona': serializer.data,
            'tokens': tokens
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def perfil(request, oidpersona):
    try:
        persona = Persona.objects.get(oidpersona = oidpersona)
        serializer = PersonaSerializer(persona)
        return Response({
            'persona': serializer.data
        }, status=status.HTTP_200_OK)
    except Persona.DoesNotExist:
        return Response(
            {'error': 'Persona no encontrada'},
            status=status.HTTP_404_NOT_FOUND
        )
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def actualizar_perfil(request, oidpersona):
    try:
        persona = Persona.objects.get(oidpersona=oidpersona)
    except Persona.DoesNotExist:
        return Response(
            {'error': 'Persona no encontrada'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = PersonaSerializer(persona, data=request.data, partial=True)

    if serializer.is_valid():
        return Response({
            'mensaje': 'Perfil actualizado exitosamente',
            'persona': serializer.data
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def eliminar_persona(request, oidpersona):
    try: 
        persona = Persona.objects.get(oidpersona=oidpersona)
        persona.delete()
        return Response(
            {'mensaje': 'Persona eliminada exitosamente'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Persona.DoesNotExist:
        return Response(
            {'error': 'Persona no encontrada'},
            status=status.HTTP_404_NOT_FOUND
        )
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_personas(request):
    personas = Persona.objects.all()
    serializer = PersonaSerializer(personas, many=True)
    return Response({
        'personas': serializer.data
    }, status=status.HTTP_200_OK)

# ViewSets for models
class ProgramaActividadesViewSet(viewsets.ModelViewSet):
    queryset = ProgramaActividades.objects.all()
    serializer_class = ProgramaActividadesSerializer


class GrupoInvestigacionViewSet(viewsets.ModelViewSet):
    queryset = GrupoInvestigacion.objects.all()
    serializer_class = GrupoInvestigacionSerializer


class InformeRendicionCuentasViewSet(viewsets.ModelViewSet):
    queryset = InformeRendicionCuentas.objects.all()
    serializer_class = InformeRendicionCuentasSerializer


class ErogacionViewSet(viewsets.ModelViewSet):
    queryset = Erogacion.objects.all()
    serializer_class = ErogacionSerializer


class ProyectoInvestigacionViewSet(viewsets.ModelViewSet):
    queryset = ProyectoInvestigacion.objects.all()
    serializer_class = ProyectoInvestigacionSerializer


class LineaDeInvestigacionViewSet(viewsets.ModelViewSet):
    queryset = LineaDeInvestigacion.objects.all()
    serializer_class = LineaDeInvestigacionSerializer


class ActividadViewSet(viewsets.ModelViewSet):
    queryset = Actividad.objects.all()
    serializer_class = ActividadSerializer


class PersonaViewSet(viewsets.ModelViewSet):
    queryset = Persona.objects.all()
    serializer_class = PersonaSerializer


class ActividadDocenteViewSet(viewsets.ModelViewSet):
    queryset = ActividadDocente.objects.all()
    serializer_class = ActividadDocenteSerializer


class InvestigadorDocenteViewSet(viewsets.ModelViewSet):
    queryset = InvestigadorDocente.objects.all()
    serializer_class = InvestigadorDocenteSerializer


class BecarioPersonalFormacionViewSet(viewsets.ModelViewSet):
    queryset = BecarioPersonalFormacion.objects.all()
    serializer_class = BecarioPersonalFormacionSerializer


class InvestigadorViewSet(viewsets.ModelViewSet):
    queryset = Investigador.objects.all()
    serializer_class = InvestigadorSerializer


class DocumentacionBibliotecaViewSet(viewsets.ModelViewSet):
    queryset = DocumentacionBiblioteca.objects.all()
    serializer_class = DocumentacionBibliotecaSerializer


class TrabajoPublicadoViewSet(viewsets.ModelViewSet):
    queryset = TrabajoPublicado.objects.all()
    serializer_class = TrabajoPublicadoSerializer


class ActividadTransferenciaViewSet(viewsets.ModelViewSet):
    queryset = ActividadTransferencia.objects.all()
    serializer_class = ActividadTransferenciaSerializer


class ParteExternaViewSet(viewsets.ModelViewSet):
    queryset = ParteExterna.objects.all()
    serializer_class = ParteExternaSerializer


class EquipamientoInfraestructuraViewSet(viewsets.ModelViewSet):
    queryset = EquipamientoInfraestructura.objects.all()
    serializer_class = EquipamientoInfraestructuraSerializer


class TrabajoPresentadoViewSet(viewsets.ModelViewSet):
    queryset = TrabajoPresentado.objects.all()
    serializer_class = TrabajoPresentadoSerializer


class ActividadXPersonaViewSet(viewsets.ModelViewSet):
    queryset = ActividadXPersona.objects.all()
    serializer_class = ActividadXPersonaSerializer


# ViewSets para Memoria Anual

class MemoriaAnualViewSet(viewsets.ModelViewSet):
    queryset = MemoriaAnual.objects.all()
    serializer_class = MemoriaAnualSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = MemoriaAnual.objects.all()
        grupo_id = self.request.query_params.get('grupo', None)
        anio = self.request.query_params.get('anio', None)
        
        if grupo_id:
            queryset = queryset.filter(GrupoInvestigacion_id=grupo_id)
        if anio:
            queryset = queryset.filter(anio=anio)
        
        return queryset


class IntegranteMemoriaViewSet(viewsets.ModelViewSet):
    queryset = IntegranteMemoria.objects.all()
    serializer_class = IntegranteMemoriaSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = IntegranteMemoria.objects.all()
        memoria_id = self.request.query_params.get('memoria', None)
        
        if memoria_id:
            queryset = queryset.filter(MemoriaAnual_id=memoria_id)
        
        return queryset


class TrabajoMemoriaViewSet(viewsets.ModelViewSet):
    queryset = TrabajoMemoria.objects.all()
    serializer_class = TrabajoMemoriaSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = TrabajoMemoria.objects.all()
        memoria_id = self.request.query_params.get('memoria', None)
        
        if memoria_id:
            queryset = queryset.filter(MemoriaAnual_id=memoria_id)
        
        return queryset


class ActividadMemoriaViewSet(viewsets.ModelViewSet):
    queryset = ActividadMemoria.objects.all()
    serializer_class = ActividadMemoriaSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = ActividadMemoria.objects.all()
        memoria_id = self.request.query_params.get('memoria', None)
        
        if memoria_id:
            queryset = queryset.filter(MemoriaAnual_id=memoria_id)
        
        return queryset


class PublicacionMemoriaViewSet(viewsets.ModelViewSet):
    queryset = PublicacionMemoria.objects.all()
    serializer_class = PublicacionMemoriaSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = PublicacionMemoria.objects.all()
        memoria_id = self.request.query_params.get('memoria', None)
        
        if memoria_id:
            queryset = queryset.filter(MemoriaAnual_id=memoria_id)
        
        return queryset


class PatenteMemoriaViewSet(viewsets.ModelViewSet):
    queryset = PatenteMemoria.objects.all()
    serializer_class = PatenteMemoriaSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = PatenteMemoria.objects.all()
        memoria_id = self.request.query_params.get('memoria', None)
        
        if memoria_id:
            queryset = queryset.filter(MemoriaAnual_id=memoria_id)
        
        return queryset


class ProyectoMemoriaViewSet(viewsets.ModelViewSet):
    queryset = ProyectoMemoria.objects.all()
    serializer_class = ProyectoMemoriaSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = ProyectoMemoria.objects.all()
        memoria_id = self.request.query_params.get('memoria', None)
        
        if memoria_id:
            queryset = queryset.filter(MemoriaAnual_id=memoria_id)
        
        return queryset
