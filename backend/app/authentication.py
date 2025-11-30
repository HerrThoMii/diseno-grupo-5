from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Persona


class PersonaJWTAuthentication(JWTAuthentication):
    """Custom JWT authentication that loads `Persona` as the user.

    The standard JWTAuthentication expects to resolve a Django auth user model using
    the claim defined in SIMPLE_JWT settings (e.g. `user_id`). This project uses a
    custom `Persona` model; tokens emitted by the login view include an `oidpersona`
    claim. This class will try to extract `oidpersona` (then `user_id` fallback)
    and return the corresponding Persona instance as the request.user.
    """

    def get_user(self, validated_token):
        # Prefer the custom claim 'oidpersona' if present.
        oid = validated_token.get('oidpersona') or validated_token.get('user_id')
        if oid is None:
            return None

        try:
            return Persona.objects.get(oidpersona=oid)
        except Persona.DoesNotExist:
            return None
