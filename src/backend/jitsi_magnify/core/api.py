"""
API endpoints
"""
from django.core.exceptions import ValidationError as DjangoValidationError

from rest_framework.exceptions import ValidationError as DRFValidationError
from rest_framework.views import exception_handler as drf_exception_handler
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from django.http import HttpResponseRedirect

from jitsi_magnify.core.models import User

def exception_handler(exc, context):
    """Handle Django ValidationError as an accepted exception.

    For the parameters, see ``exception_handler``
    This code comes from twidi's gist:
    https://gist.github.com/twidi/9d55486c36b6a51bdcb05ce3a763e79f
    """
    if isinstance(exc, DjangoValidationError):
        if hasattr(exc, "message_dict"):
            detail = exc.message_dict
        elif hasattr(exc, "message"):
            detail = exc.message
        elif hasattr(exc, "messages"):
            detail = exc.messages

        exc = DRFValidationError(detail=detail)

    return drf_exception_handler(exc, context)

class CustomTokenSerializer(TokenObtainPairSerializer):
    """Api viewset to generate a custom token"""

    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        return data

    @classmethod
    def get_token(cls, user, room):
        token = super().get_token(user)

        # Add custom claims
        jitsiUser = {'avatar': "",
                'name': user.username,
                'email': user.email}

        token['context'] = {'user': jitsiUser}

        token['moderator'] = user.is_staff
        token['aud'] = "jitsi"
        token['iss'] = "jitsi_app_id"
        token['sub'] = "meet.jitsi"
        token['room'] = room

        return token

class CustomTokenView(TokenObtainPairView):
    serializer_class = CustomTokenSerializer

def obtainTokenView(request, room):
    user, created = User.objects.get_or_create(username="guest")
    
    if created:
        user.set_password("guest_default_password")
        user.save()

    token = CustomTokenSerializer.get_token(user=user, room=room)

    return HttpResponseRedirect("https://localhost:8071/" + room + "?jwt=" + str(token))
