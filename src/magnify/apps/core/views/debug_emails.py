"""Views of the ``core`` app of the Magnify project."""
from django.conf import settings
from django.views.generic.base import TemplateView

from ..factories import UserFactory


class  SignupEmailDebugView(TemplateView):
    """Debug View to check the layout of the singup email"""

    def get_template_names(self):
        """Build the template name with the extension."""
        extension = self.kwargs["extension"]
        return f"email/signup.{extension:s}"

    def get_context_data(self, **kwargs):
        """Generate sample data to have a signup email"""
        user = UserFactory()
        context = super().get_context_data(**kwargs)
        context["site_name"] = getattr(settings, "SITE_NAME", "Jitsi Magnify")
        context["user_email"] = user.email
        context["user_name"] = user.name or user.username
        return context
