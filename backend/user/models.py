
#models para definir tablas en base de datos
from django.db import models

#Abstractbaseuser clase base para modelo de usuario personalizado
#Baseusermanager clase base para el admin - objeto que controla como se crean los usuarios create_user
#Permissionmixin agrega soporte para permisos y grupos de django necesarios admin django
from django.contrib.auth.models import (
    AbstractBaseUser, 
    BaseUserManager, 
    PermissionsMixin
    )

#Modelo Rol de app que define el tipo de usuario
from rol.models import Rol

#Timezone manejo de fechas y horas
from django.utils import timezone

#uuid genera identificadores unicos tokens de verificacion y reset
import uuid



#MANAGER  controla como se crean los usuarios
#Manager personalizado para customUser se requiere admin cuando se utiliza abstracBaseUser
#Vaidaciones propias
class CustomUserManager(BaseUserManager):

    #Crea y Guarda un usuario normal en la db
    #email str como identificador unico en vez de username como lo trae django prederterminado
    #Password texto plano encriptado por django bcrypt en set_password
    #**extra_fields cualquier otro campo que venga en el modelo
    def create_user(self, email, password=None, **extra_fields):

        #Validaciones basicas antes de crear el usuario
        #valueError por que occure antes
        if not email:
            raise ValueError('El usuario debe tener un email')

        if not password:
            raise ValueError('El usuario debe tener una contraseña')

        if not extra_fields.get('first_name'):
            raise ValueError('El usuario debe tener nombre')

        if not extra_fields.get('last_name'):
            raise ValueError('El usuario debe tener apellido')

        #Normalizamos el email
        email = self.normalize_email(email)

        #Self.model hace referencia a CustomUser
        #Creamos la instancio pero sin guardar en la db
        user = self.model(
            email=email,
            **extra_fields
        )

        #set_password para encriptrar la contraseña con django
        user.set_password(password)

        #using=self para que la db sea correcta
        user.save(using=self._db)
        return user


    #Crea un super usuario con acceso a el admin de django
    #Se crea por terminal con los mismo parametros del usuario
    #setDefaultKey para asignar valores si no se envio
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        #Validacion de el superuser
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True')

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True')


        #Intentamos asignar el rol del admin al super usuario
        #Si no exixte se deja en none para no bloquear la creacion del superuser
        try:
            rol_admin = Rol.objects.get(name=Rol.MANAGER)
        except Rol.DoesNotExist:
            rol_admin = None

        extra_fields.setdefault('rol', rol_admin)

        return self.create_user(email, password, **extra_fields)



#Modelo principal
class CustomUser(AbstractBaseUser, PermissionsMixin):

    rol = models.ForeignKey(
        Rol,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='users'
    )

    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)

    company = models.CharField(max_length=100, blank=True, null=True)
    brokerage = models.CharField(max_length=50, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)

    notshow = models.BooleanField(default=False)

    # 🔥 VERIFICATION SYSTEM
    verification_token = models.UUIDField(default=uuid.uuid4, editable=False,null =True)
    verification_sent_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    #Passwor reset 
    #null = true y blank porque solo existen cuando el usuario pidio el reset
    reset_token = models.UUIDField(null=True, blank=True)

    #guardamos cuando envio para calcular la expiracion
    reset_sent_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(blank=True, null=True)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        ordering = ["-created_at"]

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def regenerate_verification_token(self):
        """Regenera token para resend verification email"""
        self.verification_token = uuid.uuid4()
        self.verification_sent_at = timezone.now()
        self.save(update_fields=["verification_token", "verification_sent_at"])

    def generate_reset_token(self):
        """Genera un token unico para el reset"""
        """uuid para id aleatorio"""
        self.reset_token = uuid.uuid4()
        self.reset_sent_at = timezone.now()
        self.save(update_fields = ["reset_token", "reset_sent_at"])

    def clear_reset_token(self):
        """
        Limpia el token después de usarlo.
        Esto es importante: si alguien interceptó el link,
        ya no podrá usarlo una segunda vez.
        """
        self.reset_token = None
        self.reset_sent_at = None
        self.save(update_fields=["reset_token", "reset_sent_at"])

    def __str__(self):
        return self.email