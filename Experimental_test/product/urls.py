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

from product.views import CreateProduct, QueryProduct, query_product_code, getReportEmail, getReport

app_name = 'product'
urlpatterns = [
    # 创建产品
    path('create_product', CreateProduct.as_view(), name='create_product'),
    # 查询产品列表
    path('query_product', QueryProduct.as_view(), name='query_product'),
    path('query_product_code', query_product_code, name='query_product_code'),
    path('getReport', getReport, name='getReport'),
    path('getReportEmail', getReportEmail, name='getReportEmail'),

]
