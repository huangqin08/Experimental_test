import uuid

from django.db import models

# Create your models here.


class AdminTimeFieldModel(models.Model):
    """
        后台添加，修改时间控制
    """
    code = models.UUIDField('编码', primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    create_time = models.DateTimeField('创建时间', auto_now_add=True, db_index=True, editable=False, )
    update_time = models.DateTimeField('修改时间', auto_now=True, db_index=True, editable=False)

    class Meta:
        abstract = True #抽象类
        get_latest_by = 'add_admin_time'
        ordering = ('-cha_admin_time', '-add_admin_time',)


class AdminModelsBase(AdminTimeFieldModel):
    """
        后台model 抽象类
    """
    valid = models.BooleanField("有效", default=True, null=False, db_index=True)
    remarks = models.CharField('备注', max_length=500, null=True, blank=True)

    class Meta:
        abstract = True #抽象类