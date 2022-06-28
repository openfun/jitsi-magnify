"""
Unit tests for the Label model
"""
from django.core.exceptions import ValidationError
from django.test import TestCase

from magnify.apps.core.factories import LabelFactory
from magnify.apps.core.models import Label


class LabelsModelsTestCase(TestCase):
    """
    Unit test suite to validate the behavior of the Label model
    """

    def test_models_labels_str(self):
        """The str representation should be the name."""
        label = LabelFactory()
        self.assertEqual(str(label), label.name)

    def test_models_labels_ordering(self):
        """Labels should be returned ordered by name."""
        LabelFactory.create_batch(3)
        labels = Label.objects.all()
        self.assertGreaterEqual(labels[1].name, labels[0].name)
        self.assertGreaterEqual(labels[2].name, labels[1].name)

    def test_models_labels_name_maxlength(self):
        """The name field should be less than 100 characters."""
        LabelFactory(name="a" * 100)
        with self.assertRaises(ValidationError) as context:
            LabelFactory(name="a" * 101)

        self.assertEqual(
            context.exception.messages,
            ["Ensure this value has at most 100 characters (it has 101)."],
        )

    def test_models_labels_color(self):
        """The label field should only accept valid colors."""
        LabelFactory(color="#fefefe")
        LabelFactory(color="#fff")

        with self.assertRaises(ValidationError) as context:
            LabelFactory(color="fefefe")

        self.assertEqual(
            context.exception.messages,
            ["Color must be a valid hexa code"],
        )
