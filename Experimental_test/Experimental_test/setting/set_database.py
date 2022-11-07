#! usr/bin/env python
# encoding: utf-8

"""
    auth: wormer@wormer.cn
    proj: base_sys
    date: 2018-01-10
    desc:
        base_sys
"""

__all__ = ['DATABASES']

# mysql
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        # 'NAME': 'fill_figure',
        # 'USER': 'root',
        # 'PASSWORD': 'lifan123123',
        # 'HOST': '127.0.0.1',
        'NAME': 'experimental_test',
        'HOST': '127.0.0.1',
        'PORT': 3306,
        'USER': 'root',
        # 'PASSWORD': 'root'
        'PASSWORD': 'lifan123123'
    }
}
print("系统默认链接数据的名称为: %s" % DATABASES.get("default").get("NAME"))

