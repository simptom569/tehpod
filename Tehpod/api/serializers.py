from rest_framework import serializers
from .models import Users, Messages, Chats
from django.contrib.auth.models import User


class UserSerializers(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ("id",)


class UsersSerializers(serializers.ModelSerializer):

    class Meta:
        model = Users
        fields = ("user_id", "user_name", "user_user",)
    
    def to_representation(self, instance):
        self.fields["user_user"] = UserSerializers(read_only=True)
        return super().to_representation(instance)


class ChatsSerializers(serializers.ModelSerializer):

    class Meta:
        model = Chats
        fields = ("chats_id", "chats_user", "chats_teh", "chats_tag", )
    
    def to_representation(self, instance):
        self.fields["chats_user"] = UsersSerializers(read_only=True)
        self.fields["chats_teh"] = UsersSerializers(read_only=True)
        return super().to_representation(instance)


class MessagesSerializers(serializers.ModelSerializer):

    messages_chat = serializers.PrimaryKeyRelatedField(queryset=Chats.objects.all())
    messages_user = serializers.PrimaryKeyRelatedField(queryset=Users.objects.all())

    class Meta:
        model = Messages
        fields = ("messages_id", "messages_text", "messages_chat", "messages_user", "messages_read",)

    def to_representation(self, instance):
        self.fields["messages_chat"] = ChatsSerializers(read_only=True)
        self.fields["messages_user"] = UsersSerializers(read_only=True)
        return super().to_representation(instance)