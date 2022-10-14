"""
Core factories
"""
import random
from datetime import timedelta

from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.utils.text import slugify

import factory
from factory import fuzzy

from . import models as core_models

# pylint: disable=no-member


class UserFactory(factory.django.DjangoModelFactory):
    """Create fake users for testing."""

    class Meta:
        model = settings.AUTH_USER_MODEL

    username = factory.Faker("user_name")
    email = factory.Faker("email")
    language = fuzzy.FuzzyChoice([lang[0] for lang in settings.LANGUAGES])
    name = factory.Faker("name")
    password = make_password("password")


class GroupFactory(factory.django.DjangoModelFactory):
    """Create fake groups for testing."""

    class Meta:
        model = core_models.Group

    name = factory.Faker("catch_phrase")
    token = factory.Faker("uuid4")

    @factory.post_generation
    def meetings(self, create, extracted, **kwargs):
        """Add meetings to group from a given list of meetings."""
        if create and extracted:
            self.meetings.set(extracted)

    @factory.post_generation
    def rooms(self, create, extracted, **kwargs):
        """Add rooms to group from a given list of rooms."""
        if create and extracted:
            self.rooms.set(extracted)

    @factory.post_generation
    def members(self, create, extracted, **kwargs):
        """Add members to group from a given list of users."""
        if create and extracted:
            self.members.set(extracted)

    @factory.post_generation
    def administrators(self, create, extracted, **kwargs):
        """Add administrators to group from a given list of users."""
        if create and extracted:
            self.administrators.set(extracted)

    @factory.post_generation
    def labels(self, create, extracted, **kwargs):
        """Add labels to group from a given list of labels."""
        if create and extracted:
            self.labels.set(extracted)


class LabelFactory(factory.django.DjangoModelFactory):
    """Create fake labels for testing."""

    class Meta:
        model = core_models.Label

    name = factory.Faker("catch_phrase")
    color = factory.Faker("hex_color")
    created_by = factory.SubFactory(UserFactory)


class MeetingFactory(factory.django.DjangoModelFactory):
    """Create fake meetings for testing."""

    class Meta:
        model = core_models.Meeting

    name = factory.Faker("catch_phrase")
    start = factory.Faker("future_date")
    start_time = factory.Faker("time_object")
    expected_duration = factory.LazyFunction(
        lambda: timedelta(minutes=random.randint(5, 600))  # nosec
    )

    @factory.post_generation
    def users(self, create, extracted, **kwargs):
        """Add users to meeting from a given list of users."""
        if create and extracted:
            for item in extracted:
                if isinstance(item, core_models.User):
                    core_models.MeetingUserAccess.objects.create(
                        user=item,
                        meeting=self,
                        is_administrator=random.choice([True, False]),  # nosec
                    )
                else:
                    core_models.MeetingUserAccess.objects.create(
                        user=item[0], meeting=self, is_administrator=item[1]
                    )

    @factory.post_generation
    def groups(self, create, extracted, **kwargs):
        """Add groups to meeting from a given list of groups."""
        if create and extracted:
            for item in extracted:
                if isinstance(item, core_models.Group):
                    core_models.MeetingGroupAccess.objects.create(
                        group=item,
                        meeting=self,
                        is_administrator=random.choice([True, False]),  # nosec
                    )
                else:
                    core_models.MeetingGroupAccess.objects.create(
                        group=item[0], meeting=self, is_administrator=item[1]
                    )

    @factory.post_generation
    def labels(self, create, extracted, **kwargs):
        """Add labels to meeting from a given list of labels."""
        if create and extracted:
            self.labels.set(extracted)


class MeetingUserFactory(factory.django.DjangoModelFactory):
    """Create fake meeting user accesses for testing."""

    class Meta:
        model = core_models.MeetingUserAccess

    meeting = factory.SubFactory(MeetingFactory)
    user = factory.SubFactory(UserFactory)
    is_administrator = factory.Faker("boolean", chance_of_getting_true=25)


class MeetingGroupAccessFactory(factory.django.DjangoModelFactory):
    """Create fake meeting group accesses for testing."""

    class Meta:
        model = core_models.MeetingGroupAccess

    meeting = factory.SubFactory(MeetingFactory)
    group = factory.SubFactory(GroupFactory)
    is_administrator = factory.Faker("boolean", chance_of_getting_true=25)


class RoomFactory(factory.django.DjangoModelFactory):
    """Create fake rooms for testing."""

    class Meta:
        model = core_models.Room

    name = factory.Faker("catch_phrase")
    slug = factory.LazyAttribute(lambda o: slugify(o.name))

    @factory.post_generation
    def users(self, create, extracted, **kwargs):
        """Add users to room from a given list of users."""
        if create and extracted:
            for item in extracted:
                if isinstance(item, core_models.User):
                    core_models.RoomUserAccess.objects.create(
                        user=item,
                        room=self,
                        is_administrator=random.choice([True, False]),  # nosec
                    )
                else:
                    core_models.RoomUserAccess.objects.create(
                        user=item[0], room=self, is_administrator=item[1]
                    )

    @factory.post_generation
    def groups(self, create, extracted, **kwargs):
        """Add groups to room from a given list of groups."""
        if create and extracted:
            for item in extracted:
                if isinstance(item, core_models.Group):
                    core_models.RoomGroupAccess.objects.create(
                        group=item,
                        room=self,
                        is_administrator=random.choice([True, False]),  # nosec
                    )
                else:
                    core_models.RoomGroupAccess.objects.create(
                        group=item[0], room=self, is_administrator=item[1]
                    )

    @factory.post_generation
    def labels(self, create, extracted, **kwargs):
        """Add labels to room from a given list of labels."""
        if create and extracted:
            self.labels.set(extracted)


class RoomUserAccessFactory(factory.django.DjangoModelFactory):
    """Create fake room user accesses for testing."""

    class Meta:
        model = core_models.RoomUserAccess

    room = factory.SubFactory(RoomFactory)
    user = factory.SubFactory(UserFactory)
    is_administrator = factory.Faker("boolean", chance_of_getting_true=25)


class RoomGroupAccessFactory(factory.django.DjangoModelFactory):
    """Create fake room group accesses for testing."""

    class Meta:
        model = core_models.RoomGroupAccess

    room = factory.SubFactory(RoomFactory)
    group = factory.SubFactory(GroupFactory)
    is_administrator = factory.Faker("boolean", chance_of_getting_true=25)
