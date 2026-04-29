import re
from django.core.validators import validate_email
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import serializers
from user.models import CustomUser
from rol.models import Rol
from django.contrib.auth import get_user_model

# Email verification imports
from django.core.mail import send_mail
from django.conf import settings
from django.db import transaction
from datetime import timedelta
from django.utils import timezone
from django.conf import settings
from user.emails import verification_email_html




TEMP_DOMAINS = [
    "mailinator.com",
    "10minutemail.com",
    "tempmail.com",
    "guerrillamail.com",
    "trashmail.com",
    "yopmail.com",
    "email.com"
]


class UserSerializer(serializers.ModelSerializer):

    rol = serializers.PrimaryKeyRelatedField(queryset=Rol.objects.all())
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "rol",
            "first_name",
            "last_name",
            "email",
            "phone",
            "company",
            "brokerage",
            "password",
            "notshow"
        ]

    # First name validation
    def validate_first_name(self, value):
        value = value.strip().title()

        if not re.match(r"^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$", value):
            raise serializers.ValidationError(
                "First name can only contain letters and spaces"
            )
        return value

    # Last name validation
    def validate_last_name(self, value):
        value = value.strip().title()

        if not re.match(r"^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$", value):
            raise serializers.ValidationError(
                "Last name can only contain letters and spaces"
            )
        return value

    # Phone validation
    def validate_phone(self, value):
        if value:
            value = value.strip()

            if not re.match(r"^[0-9+\-\s]{7,15}$", value):
                raise serializers.ValidationError(
                    "Invalid phone number"
                )

        return value

    # Email validation
    def validate_email(self, value):
        value = value.lower().strip()

        try:
            validate_email(value)
        except ValidationError:
            raise serializers.ValidationError("Invalid email format")

        domain = value.split("@")[1]

        if domain in TEMP_DOMAINS:
            raise serializers.ValidationError(
                "Temporary emails are not allowed"
            )

        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "This email is already registered"
            )

        return value

    # Password validation
    def validate_password(self, value):

        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(list(e.messages))

        if not re.search(r"[A-Z]", value):
            raise serializers.ValidationError(
                "Password must contain one uppercase letter"
            )

        if not re.search(r"[a-z]", value):
            raise serializers.ValidationError(
                "Password must contain one lowercase letter"
            )

        if not re.search(r"\d", value):
            raise serializers.ValidationError(
                "Password must contain one number"
            )

        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
            raise serializers.ValidationError(
                "Password must contain one symbol"
            )

        return value

    def create(self, validated_data):

        password = validated_data.pop("password")

        with transaction.atomic():

            user = CustomUser.objects.create_user(
                password=password,
                is_verified=False,
                **validated_data
            )

            verification_link = (
                f"{settings.FRONTEND_URL}/verify-email/{user.verification_token}"
            )

            def send_verification_email():
                try:
                    send_mail(
                        subject="Activate your Sho - ping account",
                        message=f"Activate your account: {verification_link}",
                        html_message=verification_email_html(user.first_name, verification_link),
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[user.email],
                        fail_silently=False
                    )
                except Exception as e:
                    print("EMAIL ERROR:", e)

            transaction.on_commit(send_verification_email)

            return user


User = get_user_model()


class EmailLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email").lower().strip()
        password = data.get("password")

        user = User.objects.filter(email=email).first()

        #inexsistent user
        if user is None:
            raise serializers.ValidationError({
                "non_field_errors": ["Invalid credentials"]
            })
        
        #incorrect password
        if not user.check_password(password):
            raise serializers.ValidationError({
                "non_field_errors": ["Invalid credentials"]
            })
        
        #account inactive
        if not user.is_active:
            raise serializers.ValidationError({
                "non_field_errors": ["Account is inactive"]
            })

        #account not verified
        if not user.is_verified:
            raise serializers.ValidationError({
                "non_field_errors": ["Please verify your email first"]
            })

        data["user"] = user
        return data
    
    

class ResenVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        return value.lower().strip()
    
    def validate(self, data):
        email = data.get("email")
        user = CustomUser.objects.filter(email=email).first()

        #No revelamos si el email exite o no
        if not user or user.is_verified:
            return data
        
        #cooldown de 2 min en reenvios
        if user.verification_sent_at:
            cooldown = user.verification_sent_at + timedelta(minutes=2)
            if timezone.now() < cooldown:
                seconds_left = int((cooldown - timezone.now()).total_seconds())
                raise serializers.ValidationError({
                    "email": [f"Please wait {seconds_left} seconds before requesting again"]
                })
            
        data["user"] = user
        return data
    

class ForgotPasswordSerializer(serializers.Serializer):
    """
    Solo recibe el email
    """

    email = serializers.EmailField()

    def validate_email(self, value):
        """Normalizamos el email"""

        return value.lower().strip()
    

class ResetPasswordSerializer(serializers.Serializer):

    """
    Recibe el token del link y la contraseña
    uuid par el token tenga el formato
    """
    token = serializers.UUIDField()

    #write only para que no ddevuelva respuestas
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate_password(self, value):

        """
        Mismas reglas de valdiacion del registro
        """
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(list(e.messages))

        if not re.search(r"[A-Z]", value):
            raise serializers.ValidationError(
                "Password must contain one uppercase letter"
            )
        if not re.search(r"[a-z]", value):
            raise serializers.ValidationError(
                "Password must contain one lowercase letter"
            )
        if not re.search(r"\d", value):
            raise serializers.ValidationError(
                "Password must contain one number"
            )
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
            raise serializers.ValidationError(
                "Password must contain one symbol"
            )
        return value
    
    def validate(self,data):
        """
        Validate() para los campos individuales validaciones mas de un campo a la vez
        """

        #las contraseñas deben de coincidir
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError({
                "confirm_password": ["Password do not match"]
            })
        
        #Buscar usuario por token filter first para none si no existe
        user = CustomUser.objects.filter(
            reset_token = data["token"]
        ).first()

        #si no existe el token no revelamos el token
        if not user:
            raise serializers.ValidationError({
                "token": ["Invalid or expired rest link"]
            })
        
        #Verificamos que el link no expiro 
        #timedelta para el tiempo
        #timezone para la hora acutal
        if user.reset_sent_at:
            expiry = user.reset_sent_at + timedelta(minutes=30)
            if timezone.now() > expiry:
                raise serializers.ValidationError({
                    "token":["Reset link has expired"]
                })
            
        data["user"] = user
        return data
