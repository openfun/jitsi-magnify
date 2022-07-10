"""
Validate and clean request parameters for our endpoints filters using Djagno forms
"""
from django import forms


class MeetingFilterForm(forms.Form):
    """Validate the query string params in a request to filter meetings."""

    start = forms.DateField(required=False)
    end = forms.DateField(required=False)
