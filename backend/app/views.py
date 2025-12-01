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
    Autor, TipoTrabajoPublicado, TrabajoPublicado, ActividadTransferencia, ParteExterna,
    EquipamientoInfraestructura, TrabajoPresentado, ActividadXPersona, Patente, TipoDeRegistro, Registro
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
    TrabajoPresentadoSerializer, ActividadXPersonaSerializer, LoginSerializer, PatenteSerializer, TipoDeRegistroSerializer, RegistroSerializer,
    AutorSerializer, TipoTrabajoPublicadoSerializer
)

# Create your views here.
def get_token_for_user(persona):
    # Attach tokens to the persona model using for_user so standard claims are present
    # and also include a custom 'oidpersona' claim (used by our custom auth class).
    refresh = RefreshToken.for_user(persona)
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
def refresh_token(request):
    # Expecting body { "refresh": "<refresh token>" }
    refresh_token = request.data.get('refresh')
    if not refresh_token:
        return Response({'error': 'Missing refresh token'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        token = RefreshToken(refresh_token)
        # produce a fresh access token
        access = str(token.access_token)
        return Response({'access': access}, status=status.HTTP_200_OK)
    except Exception:
        return Response({'error': 'Invalid refresh token'}, status=status.HTTP_401_UNAUTHORIZED)

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
        serializer.save()
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

@api_view(['GET'])
@permission_classes([AllowAny])
def get_opciones_perfil(request):
    """
    Retorna las opciones disponibles para los campos del perfil
    """
    from .models import TipoDePersonal, GrupoInvestigacion
    
    tipos_personal = TipoDePersonal.objects.all()
    grupos = GrupoInvestigacion.objects.all()
    
    return Response({
        'tiposPersonal': [{'id': tp.id, 'nombre': tp.nombre} for tp in tipos_personal],
        'grupos': [{'id': g.oidGrupoInvestigacion, 'nombre': g.nombre} for g in grupos],
        'gradosAcademicos': [
            {'id': 1, 'nombre': 'Licenciatura'},
            {'id': 2, 'nombre': 'Maestría'},
            {'id': 3, 'nombre': 'Doctorado'},
            {'id': 4, 'nombre': 'Post-Doctorado'}
        ],
        'categoriasUTN': [
            {'id': 1, 'nombre': 'Categoría I'},
            {'id': 2, 'nombre': 'Categoría II'},
            {'id': 3, 'nombre': 'Categoría III'},
            {'id': 4, 'nombre': 'Categoría IV'},
            {'id': 5, 'nombre': 'Categoría V'}
        ],
        'dedicaciones': [
            {'id': 1, 'nombre': 'Simple'},
            {'id': 2, 'nombre': 'Semi-Exclusiva'},
            {'id': 3, 'nombre': 'Exclusiva'}
        ],
        'programasIncentivos': [
            {'id': 1, 'nombre': 'Programa Nacional de Incentivos'},
            {'id': 2, 'nombre': 'Programa Provincial'},
            {'id': 3, 'nombre': 'Otro'}
        ],
        'cursosCatedras': [
            {'id': 1, 'nombre': 'Análisis Matemático'},
            {'id': 2, 'nombre': 'Álgebra'},
            {'id': 3, 'nombre': 'Física'},
            {'id': 4, 'nombre': 'Química'},
            {'id': 5, 'nombre': 'Programación'}
        ],
        'roles': [
            {'id': 1, 'nombre': 'Profesor Titular'},
            {'id': 2, 'nombre': 'Profesor Adjunto'},
            {'id': 3, 'nombre': 'Jefe de Trabajos Prácticos'},
            {'id': 4, 'nombre': 'Auxiliar Docente'}
        ]
    }, status=status.HTTP_200_OK)

# ViewSets for models
class ProgramaActividadesViewSet(viewsets.ModelViewSet):
    queryset = ProgramaActividades.objects.all()
    serializer_class = ProgramaActividadesSerializer


class GrupoInvestigacionViewSet(viewsets.ModelViewSet):
    queryset = GrupoInvestigacion.objects.all()
    serializer_class = GrupoInvestigacionSerializer
    permission_classes = [AllowAny]


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
    permission_classes = [AllowAny]


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


class PatenteViewSet(viewsets.ModelViewSet):
    queryset = Patente.objects.all()
    serializer_class = PatenteSerializer


class AutorViewSet(viewsets.ModelViewSet):
    queryset = Autor.objects.all()
    serializer_class = AutorSerializer
    permission_classes = [AllowAny]


class TipoTrabajoPublicadoViewSet(viewsets.ModelViewSet):
    queryset = TipoTrabajoPublicado.objects.all()
    serializer_class = TipoTrabajoPublicadoSerializer
    permission_classes = [AllowAny]

class RegistroViewSet(viewsets.ModelViewSet):
    queryset = Registro.objects.all()
    serializer_class = RegistroSerializer


class TipoDeRegistroViewSet(viewsets.ModelViewSet):
    queryset = TipoDeRegistro.objects.all()
    serializer_class = TipoDeRegistroSerializer