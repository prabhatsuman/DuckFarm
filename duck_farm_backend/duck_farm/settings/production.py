from .base import *
DEBUG = False
ALLOWED_HOSTS = ['localhost', 'duck_farm_backend']
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'farmmanagement',
        'USER': 'postgres',
        'PASSWORD': 'postgres',
        'HOST': 'db',  # Service name of the PostgreSQL container
        'PORT': '5432',
    }
}


CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        # Using the existing Redis server on port 6379
        "LOCATION": "redis://redis:6379/1",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "IGNORE_EXCEPTIONS": True,  # This helps to prevent errors when Redis is down
        }
    }
}
