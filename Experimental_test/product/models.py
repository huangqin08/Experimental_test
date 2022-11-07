from datetime import datetime

from django.db import models

# Create your models here.
from basicinfo.models import AdminModelsBase


# 自定义文件路径问题
def upload_path(instance, filename):
    return '/'.join([datetime.now().strftime("%Y%m%d"), instance.__class__.__name__.lower(), filename])


class ProductSubject(AdminModelsBase):
    """
        产品列表
    """
    name = models.CharField(verbose_name='产品名称', max_length=500, null=False, blank=False)
    name_short = models.CharField(verbose_name='产品简称', max_length=20, null=True, blank=True)
    img = models.ImageField(verbose_name='产品图片', upload_to=upload_path, null=True, blank=True, default=None)
    desc = models.TextField(verbose_name='产品说明', null=True, blank=True)
    video = models.FileField(verbose_name='采样指导视频', null=True, blank=True, upload_to='uploads/video/%Y/', default=None)

    class Meta:
        db_table = 'product_subject'
        verbose_name = verbose_name_plural = "产品信息"

    def __str__(self):
        return self.name


class ProductCode(AdminModelsBase):
    """产品编码表"""
    project_name = models.ForeignKey(to=ProductSubject, on_delete=models.CASCADE, verbose_name='产品名称')
    code_num = models.CharField(verbose_name='产品编码', max_length=20, null=False, blank=False, unique=True)
    project_code_status = models.SmallIntegerField(default=1, null=False, choices=((1, '待绑定'), (2, '待寄回'), (3, '待签收'), (4, '待检测'), (5, '已完成')), verbose_name='编码状态')
    report = models.FileField(verbose_name='检测报告', null=True, blank=True, upload_to='uploads/report/%Y/', default=None)

    class Meta:
        db_table = 'product_code'
        verbose_name = verbose_name_plural = "产品编码"

    def __str__(self):
        return self.code_num


class ProductAddress(AdminModelsBase):
    """产品地址维护表"""
    project_name = models.ForeignKey(to=ProductSubject, on_delete=models.CASCADE, verbose_name='产品名称')
    receiver = models.CharField(max_length=20, verbose_name='收件人姓名')
    receiver_phone = models.CharField(max_length=11, verbose_name='收件人电话')
    addr = models.CharField(max_length=250, verbose_name='收件地址')
    addr_desc = models.CharField(max_length=250, verbose_name='详细地址')

    class Meta:
        db_table = 'product_address'
        verbose_name = verbose_name_plural = "产品地址维护"

    def __str__(self):
        return self.receiver
