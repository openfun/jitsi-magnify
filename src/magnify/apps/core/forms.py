"""
Validate and clean request parameters for our endpoints filters using Djagno forms
"""
from django import forms


class MeetingFilterForm(forms.Form):
    """Validate the query string params in a request to filter meetings."""

    to = forms.DateTimeField(required=True)

    def __init__(self, *args, **kwargs):
        """
        Declare the "from" field dynamically to avoid conflict with this Python reserved name.
        """
        super().__init__(*args, **kwargs)
        self.fields["from"] = forms.DateTimeField(required=True)
