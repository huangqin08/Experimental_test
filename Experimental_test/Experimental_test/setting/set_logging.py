#! usr/bin/env python
# -*- encoding: utf-8 -*-

import logging

from Experimental_test.settings import DEBUG

""" 
    auth: wormer@wormer.cn
    proj: site_salary
    date: 2017-10-12
    desc: 
        site_salary.logging
"""

import os

__all__ = ['LOGGING']

# django_path = os.path.abspath(os.path.join(__file__, '../../../logs/django'))
# celery_path = os.path.abspath(os.path.join(__file__, '../../../logs/celery'))
#
# if not os.path.exists(django_path):
#     os.makedirs(django_path)
# if not os.path.exists(celery_path):
#     os.makedirs(celery_path)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'formatters': {
        'standard': {
            'format': '[%(asctime)s.%(msecs).03d] %(levelname)s [%(module)s:%(funcName)s:%(lineno)4d]- %(message)s',
            'datefmt': "%Y-%m-%d %H:%M:%S",
        },
        "verbose": {
            'format': '%(asctime)s %(levelname)7s [Line: %(lineno)4s] -- %(message)s',
            "datefmt": '%Y-%m-%d %H:%M:%S'
        }
    },
    'filters': {
        'require_debug_true': {
            '()': 'django.utils.log.RequireDebugTrue',
        },
    },
    'handlers': {
        # 记录到日志文件(需要创建对应的目录，否则会出错)
        'django_log': {
            'level': 'DEBUG',
            'class': 'logging.handlers.RotatingFileHandler',
            # 'filename': os.path.join(django_path, 'default.log'),  # 日志输出文件
            'maxBytes': 1024 * 1024 * 5,  # 文件大小
            'backupCount': 5,  # 备份份数
            'formatter': 'standard',  # 使用哪种formatters日志格式
        },
        'console': {
            'level': 'DEBUG',
            'filters': ['require_debug_true'],
            'class': 'logging.StreamHandler',
            'formatter': 'standard',
        },
        'celery_log': {
            'level': 'DEBUG',
            'class': 'logging.handlers.RotatingFileHandler',
            # 'filename': os.path.join(celery_path, 'default.log'),  # 日志输出文件
            'maxBytes': 1024 * 1024 * 5,  # 文件大小
            'backupCount': 5,  # 备份份数
            'formatter': 'verbose',  # 使用哪种formatters日志格式s
        },
        'celery_console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
            'include_html': True,
        },
    },
    'loggers': {
        'django': {
            'handlers': ['django_log', 'mail_admins'] if DEBUG else ['django_log', 'console'],
            'level': 'DEBUG',
            'propagate': True
        },
        'authenticate': {
            'handlers': ['django_log', 'mail_admins'] if DEBUG else ['django_log', 'console'],
            'level': 'DEBUG',
            'propagate': True
        },
        'django.request': {
            'handlers': ['django_log', 'mail_admins'] if DEBUG else ['django_log', 'console'],
            'level': 'ERROR',
            'propagate': True,
        },
        'api_view': {
            'handlers': ['console', 'django_log', 'mail_admins'] if DEBUG else ['django_log', 'console'],
            'level': 'DEBUG',
            'propagate': False
        },
        'exception': {
            'handlers': ['django_log', 'mail_admins'] if DEBUG else ['django_log', 'console'],
            'level': 'ERROR',
            'propagate': True
        },
        'celery': {
            'handlers': ['celery_log', 'mail_admins'] if DEBUG else ['celery_log', 'console'],
            'level': 'DEBUG',
            'propagate': False
        }
    }
}

logger = logging.getLogger('api_view')