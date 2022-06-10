from django.urls import path

from magnify.rooms import views

urlpatterns = [
    path("/token/<room>", views.get_room_token_view),
]