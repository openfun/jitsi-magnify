"""
Core factories
"""
import random
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.utils.text import slugify

import factory
from factory import fuzzy
from timezone_field import TimeZoneField

from . import models as core_models

# pylint: disable=no-member


class UserFactory(factory.django.DjangoModelFactory):
    """Create fake users for testing."""

    class Meta:
        model = settings.AUTH_USER_MODEL

    username = factory.Faker("user_name")
    email = factory.Faker("email")
    language = fuzzy.FuzzyChoice([lang[0] for lang in settings.LANGUAGES])
    timezone = fuzzy.FuzzyChoice(TimeZoneField.default_zoneinfo_tzs)
    name = factory.Faker("name")
    password = make_password("password")


class GroupFactory(factory.django.DjangoModelFactory):
    """Create fake groups for testing."""

    class Meta:
        model = core_models.Group

    name = factory.Faker("catch_phrase")
    token = factory.Faker("uuid4")

    @factory.post_generation
    def resources(self, create, extracted, **kwargs):
        """Add resources to group from a given list of resources."""
        if create and extracted:
            self.resources.set(extracted)

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


class ResourceFactory(factory.django.DjangoModelFactory):
    """Create fake resources for testing."""

    class Meta:
        model = core_models.Resource

    is_public = factory.Faker("boolean", chance_of_getting_true=50)

    @factory.post_generation
    def users(self, create, extracted, **kwargs):
        """Add users to resource from a given list of users."""
        if create and extracted:
            for item in extracted:
                if isinstance(item, core_models.User):
                    UserResourceAccessFactory(resource=self, user=item)
                else:
                    UserResourceAccessFactory(resource=self, user=item[0], role=item[1])

    @factory.post_generation
    def groups(self, create, extracted, **kwargs):
        """Add groups to resource from a given list of groups."""
        if create and extracted:
            for item in extracted:
                if isinstance(item, core_models.Group):
                    GroupResourceAccessFactory(resource=self, group=item)
                else:
                    GroupResourceAccessFactory(
                        resource=self, group=item[0], role=item[1]
                    )

    @factory.post_generation
    def labels(self, create, extracted, **kwargs):
        """Add labels to resource from a given list of labels."""
        if create and extracted:
            self.labels.set(extracted)


class UserResourceAccessFactory(factory.django.DjangoModelFactory):
    """Create fake resource user accesses for testing."""

    class Meta:
        model = core_models.ResourceAccess

    resource = factory.SubFactory(ResourceFactory)
    user = factory.SubFactory(UserFactory)
    role = fuzzy.FuzzyChoice(core_models.RoleChoices.values)


class GroupResourceAccessFactory(factory.django.DjangoModelFactory):
    """Create fake resource group accesses for testing."""

    class Meta:
        model = core_models.ResourceAccess

    resource = factory.SubFactory(ResourceFactory)
    group = factory.SubFactory(GroupFactory)
    role = fuzzy.FuzzyChoice(
        [v for v in core_models.RoleChoices.values if v != "owner"]
    )


class RoomFactory(ResourceFactory):
    """Create fake rooms for testing."""

    class Meta:
        model = core_models.Room

    name = factory.Faker("catch_phrase")
    slug = factory.LazyAttribute(lambda o: slugify(o.name))


class MeetingFactory(factory.django.DjangoModelFactory):
    """Create fake meetings for testing."""

    class Meta:
        model = core_models.Meeting

    name = factory.Faker("catch_phrase")
    owner = factory.SubFactory(UserFactory)
    start = factory.Faker("future_datetime", tzinfo=ZoneInfo("UTC"))
    timezone = fuzzy.FuzzyChoice(TimeZoneField.default_zoneinfo_tzs)

    @factory.lazy_attribute
    def end(self):
        """
        The end datetime is at a random duration after the start datetme (we pick within 3 hours).
        """
        if not self.start:
            return None
        period = timedelta(hours=3)
        return datetime.utcfromtimestamp(
            random.randrange(  # nosec
                int(self.start.timestamp()), int((self.start + period).timestamp())
            )
        ).replace(tzinfo=ZoneInfo("UTC"))

    @factory.post_generation
    def users(self, create, extracted, **kwargs):
        """Add users to meeting from a given list of users."""
        if create and extracted:
            for item in extracted:
                core_models.MeetingAccess.objects.create(meeting=self, user=item)

    @factory.post_generation
    def groups(self, create, extracted, **kwargs):
        """Add groups to meeting from a given list of groups."""
        if create and extracted:
            for item in extracted:
                core_models.MeetingAccess.objects.create(meeting=self, group=item)


class UserMeetingAccessFactory(factory.django.DjangoModelFactory):
    """Create fake meeting user accesses for testing."""

    class Meta:
        model = core_models.MeetingAccess

    meeting = factory.SubFactory(MeetingFactory)
    user = factory.SubFactory(UserFactory)


class GroupMeetingAccessFactory(factory.django.DjangoModelFactory):
    """Create fake meeting group accesses for testing."""

    class Meta:
        model = core_models.MeetingAccess

    meeting = factory.SubFactory(MeetingFactory)
    group = factory.SubFactory(GroupFactory)
