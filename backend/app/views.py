from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework_simplejwt. tokens import RefreshToken
from django.contrib.auth.hashers import make_password, check_password
from .models import Persona, TrabajoPublicado, TrabajoPresentado, Patente, Registro
from .serializers import PersonaSerializer, LoginSerializer, TrabajoPublicadoSerializer, TrabajoPresentadoSerializer, PatenteSerializer, RegistroSerializer

# Create your views here.

# endpoint del login
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

#endpoint trabajo publicado
class TrabajoPublicadoViewSet(viewsets.ModelViewSet):
    queryset = TrabajoPublicado.objects.all()
    serializer_class = TrabajoPublicadoSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
#endpoint trabajo presentado
class TrabajoPresentadoViewSet(viewsets.ModelViewSet):
    queryset = TrabajoPresentado.object.all()
    serializer_class = TrabajoPresentadoSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
#endpoint patente
class PatenteViewSet(viewsets.ModelViewSet):
    queryset = Patente.objects.all()
    serializer_class = PatenteSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

#endpoint registro
class RegistroViewSet(viewsets.ModelViewSet):
    queryset = Registro.objects.all()
    serializer_class = RegistroSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)