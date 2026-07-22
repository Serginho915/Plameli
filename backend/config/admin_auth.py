from rest_framework.authentication import BasicAuthentication


class SilentBasicAuthentication(BasicAuthentication):
    def authenticate(self, request):
        forwarded_authorization = request.META.get("HTTP_X_FORWARDED_AUTHORIZATION")
        if forwarded_authorization and "HTTP_AUTHORIZATION" not in request.META:
            request.META["HTTP_AUTHORIZATION"] = forwarded_authorization

        return super().authenticate(request)

    def authenticate_header(self, request):
        return None
