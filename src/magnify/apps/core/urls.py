"""Urls declarations for Magnify's core app."""

from django.urls import path

from magnify.apps.core import views

urlpatterns = [
    path("token/<room>", views.get_room_token_view),
]
