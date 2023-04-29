from .models import Users, Chats, Messages
from django.contrib.auth.models import User
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .serializers import UserSerializers, UsersSerializers, MessagesSerializers, ChatsSerializers
from django_filters.rest_framework import DjangoFilterBackend


class UserViewSet(viewsets.ModelViewSet):

    queryset = User.objects.all()
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = UserSerializers
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["__all__"]


class UsersViewSet(viewsets.ModelViewSet):

    queryset = Users.objects.all()
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = UsersSerializers
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        "user_user__id": ["exact"]
    }


class MessagesViewSet(viewsets.ModelViewSet):

    queryset = Messages.objects.all()
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = MessagesSerializers
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        "messages_chat__chats_user__user_user__id": ["exact"],
        "messages_chat__chats_id": ["exact"],
        "messages_read": ["exact"],
    }


class ChatsViewSet(viewsets.ModelViewSet):

    queryset = Chats.objects.all()
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = ChatsSerializers
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        "chats_user__user_user__id": ["exact"],
        "chats_id": ["exact"],
    }