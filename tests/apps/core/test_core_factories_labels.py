"""
Unit tests for the Label factory
"""
from django.test import TestCase

from magnify.apps.core.factories import LabelFactory


class LabelsFactoriesTestCase(TestCase):
    """
    Unit test suite to validate the behavior of the Label factory
    """

    def test_factories_labels_color(self):
        """The color field should be populated with a valid color."""
        label = LabelFactory()
        self.assertTrue(label.color.startswith("#"))
        self.assertTrue(len(label.color), 7)
