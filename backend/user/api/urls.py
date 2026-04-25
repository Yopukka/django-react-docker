from rest_framework.routers import DefaultRouter
from django.urls import path
from .view import (
    UserViewSet,
    EmailLoginView,
    ForgotPasswordView,
    ResetPasswordView
)


router = DefaultRouter()

router.register('user', UserViewSet, basename = "user")

urlpatterns = router.urls + [
    path('login/', EmailLoginView.as_view(), name='login'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
]
