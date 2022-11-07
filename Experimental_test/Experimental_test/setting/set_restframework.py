#! usr/bin/env python
# -*- encoding: utf-8 -*-


__all__ = ['REST_FRAMEWORK']


REST_FRAMEWORK = {
    # Use Django's standard `django.contrib.auth` permissions,
    # or allow read-only access for unauthenticated users.

    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.BasicAuthentication',
    ),
}
