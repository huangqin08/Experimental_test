#! usr/bin/env python
# -*- coding: utf-8 -*-

"""
    These settings used to connection to database

    django session 配置文件
"""

__all__ = [
    'SESSION_ENGINE',
    'SESSION_REDIS_HOST',
    'SESSION_REDIS_PORT',
    'SESSION_REDIS_DB',
    'SESSION_REDIS_PASSWORD',
    'SESSION_REDIS_PREFIX',
    'SESSION_REDIS_SOCKET_TIMEOUT',
]

from .set_common import REDIS_HOST, REDIS_DB_NUM, REDIS_PASS, REDIS_PORT

SESSION_ENGINE = 'redis_sessions.session'
# SESSION_REDIS = {
#     'host': REDIS_HOST,
#     'port': REDIS_PORT,
#     'db': REDIS_DB_NUM.DJ_SESSION,
#     'password': REDIS_PASS,
#     'prefix': 'session_id',
#     'socket_timeout': 1
# }
SESSION_REDIS_HOST = REDIS_HOST
SESSION_REDIS_PORT = REDIS_PORT
SESSION_REDIS_DB = REDIS_DB_NUM.get('DJ_SESSION', 1)
SESSION_REDIS_PASSWORD = REDIS_PASS
SESSION_REDIS_PREFIX = 'session_id'
SESSION_REDIS_SOCKET_TIMEOUT = 1

# 测试线上库
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://{}:{}/{}'.format(REDIS_HOST,REDIS_PORT,1),  # 'redis://:你的密码@redis数据库服务器的地址:6379/1'
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
            'CONNECTION_POOL_KWARGS': {'max_connections': 200, 'decode_responses': False},
            # "SERIALIZER": "django_redis.serializers.msgpack.MSGPackSerializer",
            'SERIALIZER': 'django_redis.serializers.json.JSONSerializer',
            'PICKLE_VERSION': -1,
            'PASSWORD': REDIS_PASS,
        }
    }
}

# If you prefer domain socket connection,
# you can just add this line instead of SESSION_REDIS_HOST and SESSION_REDIS_PORT.

# SESSION_REDIS_UNIX_DOMAIN_SOCKET_PATH = '/var/run/redis/redis.sock'

# Redis Sentinel
# SESSION_REDIS_SENTINEL_LIST = [(host, port), (host, port), (host, port)]
# SESSION_REDIS_SENTINEL_MASTER_ALIAS = 'sentinel-master'
