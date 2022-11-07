from django.contrib import admin

# Register your models here.
from django.contrib import admin

# Register your models here.
from user.models import ExamineUser


@admin.register(ExamineUser)
class ExamineUser_Admin(admin.ModelAdmin):
    # 设置受检人信息
    list_display = ('code','code_num', 'examine_name','certificate_type' , 'certificate_num',  'phone')
    ordering = ('-create_time',)
    search_fields = ['examine_name', 'certificate_num','phone']
    list_per_page = 20