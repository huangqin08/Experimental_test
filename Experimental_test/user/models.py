from django.db import models

# Create your models here.
from django.forms import ModelForm

from basicinfo.models import AdminModelsBase
from product.models import ProductCode


class ExamineUser(AdminModelsBase):
    """产品编码表"""
    code_num=models.ForeignKey(to=ProductCode,on_delete=models.CASCADE,verbose_name='产品编码')
    examine_name = models.CharField(verbose_name='受检人姓名', max_length=20, null=False, blank=False)
    certificate_type=models.SmallIntegerField(default=1, choices=((1,'身份证'),(2,'港澳身份证'),(3,'回乡证'),(4,'军官证'),(5,'护照')), verbose_name='证件类型')
    certificate_num=models.CharField(max_length=128,verbose_name='证件号码')
    phone=models.CharField(max_length=11,verbose_name='手机号码')

    class Meta:
        db_table = 'examine_user'
        verbose_name = verbose_name_plural = "受检人信息"

    def __str__(self):
        return self.examine_name