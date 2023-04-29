from django.urls import path, include
from rest_framework import routers
from .api import UsersViewSet, ChatsViewSet, MessagesViewSet


router = routers.DefaultRouter()
router.register(r"user", UsersViewSet)
router.register(r"chats", ChatsViewSet)
router.register(r"messages", MessagesViewSet)

urlpatterns = [
    path("", include(router.urls))
]