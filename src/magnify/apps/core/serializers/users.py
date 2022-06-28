"""Serializers for users views"""

from rest_framework import serializers

from magnify.apps.core.models import User


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""

    class Meta:
        model = User
        fields = ["id", "username", "email", "name", "avatar"]


class UserCreateResponseSuccessSerializer(serializers.Serializer):
    "Serializer for UserCreateView's Response with success"
    user_id = serializers.IntegerField()

    def create(self, validated_data):
        return

    def update(self, instance, validated_data):
        return


class UserCreateResponseErrorSerializer(serializers.Serializer):
    "Serializer for UserCreateView's Response with error"
    password = serializers.CharField(max_length=200)
    email = serializers.CharField(max_length=200)
    username = serializers.CharField(max_length=200)
    name = serializers.CharField(max_length=200)

    def create(self, validated_data):
        return

    def update(self, instance, validated_data):
        return
