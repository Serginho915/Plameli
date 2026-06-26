import base64

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient


class AdminAuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            username="admin",
            password="secret",
            is_staff=True,
        )

    def test_admin_auth_failure_does_not_trigger_browser_basic_prompt(self):
        response = self.client.get("/api/admin/me/")

        self.assertEqual(response.status_code, 403)
        self.assertNotIn("WWW-Authenticate", response.headers)

    def test_admin_auth_accepts_basic_authorization_header(self):
        token = base64.b64encode(b"admin:secret").decode("ascii")
        response = self.client.get(
            "/api/admin/me/",
            HTTP_AUTHORIZATION=f"Basic {token}",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["username"], "admin")
