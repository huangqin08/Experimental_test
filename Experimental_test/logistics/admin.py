from django.contrib import admin

# Register your models here.
from logistics.models import LogisticsAddr


@admin.register(LogisticsAddr)
class ProductSubject_Admin(admin.ModelAdmin):
    # 设置产品
    list_display = ('code', 'project_code', 'project_name', 'addresser', 'addresser_phone', 'addr','addr_desc','addr_time','trade_no')
    # list_editable = ['name', 'name_short', ]
    ordering = ('-create_time',)
    search_fields = ['trade_no']
    list_per_page = 20