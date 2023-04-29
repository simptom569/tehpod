from django.db import models
from uuid import uuid4
from django.contrib.auth.models import User

class Users(models.Model):

    user_id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    user_name = models.CharField(verbose_name="Имя", max_length=100)
    user_login = models.CharField(verbose_name="Логин", max_length=100)
    user_user = models.OneToOneField(User, verbose_name="Аккаунт в системе", on_delete=models.CASCADE)
    user_permission = models.BooleanField("ТехПоддержка", default=False)

    class Meta:
        verbose_name = "Пользователи"
    
    def __str__(self):
        return str(self.user_id)


class Chats(models.Model):

    chats_id = models.AutoField(primary_key=True, verbose_name="Номер")
    chats_user = models.OneToOneField(Users, verbose_name="Пользователь", on_delete=models.SET_NULL, null=True, blank=True, related_name="chats_user")
    chats_teh = models.ForeignKey(Users, verbose_name="ТехПоддержка", on_delete=models.SET_NULL, null=True, related_name="chats_teh")
    chats_tag = models.CharField(verbose_name="Тэг", max_length=20)

    class Meta:
        verbose_name = "Чаты"
    
    def __str__(self):
        return str(self.chats_id)


class Messages(models.Model):

    messages_id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    messages_text = models.TextField(verbose_name="Текст", max_length=500)
    messages_chat = models.ForeignKey(Chats, verbose_name="Чат", on_delete=models.CASCADE)
    messages_user = models.ForeignKey(Users, verbose_name="Пользователь", null=True, on_delete=models.SET_NULL)
    messages_read = models.BooleanField("Прочитано", default=False)

    class Meta:
        verbose_name = "Сообщения"
    
    def __str__(self):
        return str(self.messages_text)