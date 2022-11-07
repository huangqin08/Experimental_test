"""Experimental_test URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from logistics.views import sampleReturn, express_code, placeOrder, addresserSubmit, sreachOrder, reportSchedule, reportCopmlete

app_name = 'logistics'
urlpatterns = [
    # 样本寄回进入页面
    path('sampleReturn', sampleReturn, name='sampleReturn'),
    # 取下下单及查询页面
    path('express', express_code, name='express'),
    # 快递收取单
    path('placeOrder', placeOrder, name='placeOrder'),
    # 提交快递
    path('addresserSubmit', addresserSubmit, name='addresserSubmit'),
    path('sreachOrder', sreachOrder, name='sreachOrder'),
    # 报告进度
    path('reportSchedule', reportSchedule, name='reportSchedule'),
    # 报告完成
    path('reportCopmlete', reportCopmlete, name='reportCopmlete'),

]
