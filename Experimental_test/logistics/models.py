from django.db import models

# Create your models here.
from basicinfo.models import AdminModelsBase
from product.models import ProductCode, ProductSubject


class LogisticsAddr(AdminModelsBase):
    """物流表"""
    project_code=models.ForeignKey(to=ProductCode,on_delete=models.CASCADE,verbose_name='产品编码')
    project_name=models.ForeignKey(to=ProductSubject,on_delete=models.CASCADE,verbose_name='产品名称')
    addresser= models.CharField(max_length=20,verbose_name='发件人姓名')
    addresser_phone = models.CharField(max_length=11,verbose_name='发件人电话')
    addr = models.CharField(max_length=250,verbose_name='发件人地址')
    addr_desc = models.CharField(max_length=250,verbose_name='详细地址')
    addr_time=models.DateTimeField('取件时间', auto_now=True, db_index=True, editable=False)
    trade_no =models.CharField(max_length=128,verbose_name='物流单号')

    class Meta:
        db_table = 'logistics_addr'
        verbose_name = verbose_name_plural = "物流表"

    def __str__(self):
        return self.addresser