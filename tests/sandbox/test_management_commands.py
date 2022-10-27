"""
Test suite for magnify's main module
"""
from io import StringIO

from django.core.management import call_command
from django.test import TestCase


class ManagementCommandTestCase(TestCase):
    """Test management commands in the sandbox."""

    def test_management_commands_create_superuser(self):
        """The createsuperuser command should work as expected."""
        out = StringIO()
        error = StringIO()
        call_command(
            "createsuperuser",
            stdout=out,
            stderr=error,
            username="admin",
            email="admin@example.com",
            interactive=False,
        )
        self.assertEqual(out.getvalue(), "Superuser created successfully.\n")
        self.assertEqual(error.getvalue(), "")
