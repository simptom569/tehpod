from django.contrib import admin
from .models import Users, Messages, Chats


admin.site.register(Users)
admin.site.register(Messages)
admin.site.register(Chats)