from django.contrib import admin

# Register your models here.
from product.models import ProductSubject, ProductCode, ProductAddress


@admin.register(ProductSubject)
class ProductSubject_Admin(admin.ModelAdmin):
    # 设置产品
    list_display = ('code', 'name', 'name_short', 'img', 'desc', 'video')
    list_editable = ['name', 'name_short', ]
    ordering = ('-create_time',)
    search_fields = ['name']
    list_per_page = 20


@admin.register(ProductCode)
class ProductCode_Admin(admin.ModelAdmin):
    # 设置产品编码
    list_display = ('code', 'code_num', 'project_name', 'project_code_status','report')
    # list_editable = ['project_name', 'code_num']
    list_filter = ['project_code_status', ]
    ordering = ('-create_time',)
    search_fields = ['code_num', ]
    list_per_page = 20


@admin.register(ProductAddress)
class ProductAddress_Admin(admin.ModelAdmin):
    # 设置产品编码
    list_display = ('code', 'project_name', 'receiver', 'receiver_phone','addr','addr_desc')
    # list_editable = ['project_name', 'code_num']
    # list_filter = ['receiver', ]
    ordering = ('-create_time',)
    search_fields = ['receiver', ]
    list_per_page = 20