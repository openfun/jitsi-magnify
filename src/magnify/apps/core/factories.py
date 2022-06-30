"""
Core factories
"""
from django.conf import settings
from django.contrib.auth.hashers import make_password

import factory


class UserFactory(factory.django.DjangoModelFactory):
    """
    Create a fake user with Faker.
    """

    class Meta:
        model = settings.AUTH_USER_MODEL

    username = factory.Faker("user_name")
    email = factory.Faker("email")
    password = make_password("password")
    name = factory.Faker("name")
