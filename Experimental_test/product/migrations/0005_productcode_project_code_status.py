# Generated by Django 4.0.8 on 2022-11-02 13:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0004_rename_name_id_productcode_project_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='productcode',
            name='project_code_status',
            field=models.SmallIntegerField(choices=[(1, '待绑定'), (2, '已绑定'), (3, '待寄回'), (4, '已寄回'), (5, '待检测'), (6, '已检测')], default=1, verbose_name='编码状态'),
        ),
    ]
