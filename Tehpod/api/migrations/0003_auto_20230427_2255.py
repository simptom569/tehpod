# Generated by Django 3.2.9 on 2023-04-27 19:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_rename_message_text_messages_messages_text'),
    ]

    operations = [
        migrations.AddField(
            model_name='messages',
            name='messages_read',
            field=models.BooleanField(default=False, verbose_name='Прочитано'),
        ),
        migrations.AlterField(
            model_name='chats',
            name='chats_id',
            field=models.AutoField(primary_key=True, serialize=False, verbose_name='Номер'),
        ),
    ]