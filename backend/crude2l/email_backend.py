import ssl
from django.core.mail.backends.smtp import EmailBackend

class BrevoEmailBackend(EmailBackend):
    def open(self):
        if self.connection:
            return False
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE
        self.ssl_context = context
        return super().open()