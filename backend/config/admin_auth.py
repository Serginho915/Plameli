from rest_framework.authentication import BasicAuthentication


class SilentBasicAuthentication(BasicAuthentication):
    def authenticate_header(self, request):
        return None
