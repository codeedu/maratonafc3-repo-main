#!/bin/bash

python manage.py migrate
python manage.py sync_tenant_permissions
gunicorn commerce_admin.wsgi:application --bind 0.0.0.0:8000