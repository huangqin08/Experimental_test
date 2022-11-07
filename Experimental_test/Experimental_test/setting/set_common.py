#! usr/bin/env python
# encoding: utf-8
"""
    These settings used to connection to database
"""

__all__ = ['REDIS_HOST', 'REDIS_PORT', 'REDIS_DB_NUM', 'REDIS_PASS']

# redis数据库使用
from Experimental_test.settings import DEBUG

if not DEBUG:
    REDIS_HOST = 'localhost'
    REDIS_PASS = 'IOPiop*()890'
    REDIS_PORT = 6379
else:
    REDIS_HOST = 'localhost'
    REDIS_PASS = 'IOPiop*()890'
    REDIS_PORT = 6379

REDIS_DB_NUM = {
    'DJ_CACHE':1,       # Cache
    'DJ_SESSION': 2,  # Session
    'DJ_CELERY': 4,  # celery
    'DJ_CHANNEL': 6,  # channel
}
