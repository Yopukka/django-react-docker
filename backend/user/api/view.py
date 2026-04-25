from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from datetime import timedelta
from django.utils import timezone

from user.models import CustomUser
from user.api.serializer import ( 
    UserSerializer, 
    EmailLoginSerializer, 
    ResenVerificationSerializer,
    ForgotPasswordSerializer,
    ResetPasswordSerializer
)
from django.core.mail import send_mail
from django.conf import settings
import secrets
from django.db import transaction
from django.conf import settings

class UserViewSet(viewsets.ModelViewSet):

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


    #Mira los permisos
    def get_permissions(self):
        if self.action in ["create", "verify_email", "resend_verification"]:
            return [AllowAny()]
        return [IsAuthenticated()]
    

    #Trae la lista de ususarios y lo busca por el id
    def get_queryset(self):
        return CustomUser.objects.filter(id=self.request.user.id)
    

    #llama a el usuario
    def get_object(self):
        return self.request.user
    

    #Trae la informacion del usuario
    @action(detail=False, methods=["get", "patch"])
    def me(self, request):

        if request.method == "GET":
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)

        if request.method == "PATCH":
            serializer = self.get_serializer(
                request.user,
                data=request.data,
                partial=True
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return Response(serializer.data)



    #verificacion del email
    @action(
        detail=False,
        methods=["post"],
        url_path="verify-email",
        permission_classes=[AllowAny]
    )
    def verify_email(self, request):

        token = request.data.get("token")

        if not token:
            return Response(
                {"error": "Verification token required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = CustomUser.objects.get(
                verification_token=token,
                is_verified=False
            )

        except CustomUser.DoesNotExist:
            return Response(
                {"error": "Invalid verification link"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # expiración 30 minutos
        if user.verification_sent_at:
            limit_time = user.verification_sent_at + timedelta(minutes=30)

            if timezone.now() > limit_time:
                return Response(
                    {"error": "Verification link expired"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        user.is_verified = True
        user.verification_sent_at = None
        user.save(update_fields = [
            "is_verified",
            "verification_token",
            "verification_sent_at"
        ])

        return Response({
            "message": "Account activated successfully"
        })
    

    #Reenvia la verificacion del correo
    @action(
        detail=False,
        methods=["post"],
        url_path="resend-verification",
        permission_classes=[AllowAny]
    )
    def resend_verification(self, request):

        serializer = ResenVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        #el usuario viene en validated_data si existe y no esta verificado
        user = serializer.validated_data.get("user")


        #Respuesta generica si no existe o ya esta verificado
        if not user:
            return Response({
                "message": "If the email exists, a verification link was sent."
            })

        with transaction.atomic():

            user.regenerate_verification_token()

            verification_link = (
                f"{settings.FRONTEND_URL}/verify-email/{user.verification_token}"
            )

            def send_email():
                try:
                    send_mail(
                        subject="Resend verification email",
                        message=f"Verify your account:\n{verification_link}",
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[user.email],
                        fail_silently=False
                    )
                except Exception as e:
                    print("Resend eamil error:", e)

            transaction.on_commit(send_email)

            return Response({
                "message": "Verification email sent."
            })

#apiview por que es una accion puntual
class EmailLoginView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = EmailLoginSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "notshow": user.notshow
            }
        }, status=status.HTTP_200_OK)


    
#apiview por que es una accion puntual
class ForgotPasswordView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception = True)

        email = serializer.validated_data["email"]

        #Buscamos el usuario 
        user = CustomUser.objects.filter(email=email).first()

        if user and user.is_active:


            #Generamos el token y guardamos
            user.generate_reset_token()

            #link del email token va en la url para que el fron lo lea
            reset_link = (
                f"{settings.FRONTEND_URL}/reset-password/{user.reset_token}"
            )
            with transaction.atomic():
                #Enviamos dentro de transaction por la primera vez del registro y guardamos el token
                def send_reset_email():
                    try:
                        send_mail(
                            subject = "Reset Password",
                            message = (
                                f"Hi {user.first_name},\n\n"
                                f"Yoou request to reset your password.\n"
                                f"Click the link below (expired 30 minutes):\n\n"
                                f"{reset_link}\n\n"
                                f"If you dint reques this ignore this email."
                            ),
                            from_email=settings.DEFAULT_FROM_EMAIL,
                            recipient_list=[user.email],
                            fail_silently=False
                        )
                    except Exception as e:
                        print("Forgot password email error:", e)
                        
                transaction.on_commit(send_reset_email)

        return Response({
            "message": "Verification email re-sent."
        })

class ResetPasswordView(APIView):

    """
    Recibir el token de la url y la nueva contraseña si es valido actualiza
    """
    permission_classes = [AllowAny]

    def post(self, request):

        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        #El serializer ya valido todo, token valido, contraseñas coniciden
        user = serializer.validated_data["user"]
        new_password = serializer.validated_data["password"]

        #set password encripta automatico nunca guardar texto plano
        user.set_password(new_password)

        #limpia el token para que el link no funcione 
        user.reset_token = None
        user.reset_sent_at = None

        #updatefields para las columnas exactas mas eficiente que toda la fila
        user.save(update_fields=["password", "reset_token", "reset_sent_at"])

        return Response ({
            "message": "Password reset successfully"
        })
