#!/bin/bash

pip install --cache-dir=/home/django/app/.docker/.pip -r requirements.txt
python manage.py migrate
python manage.py loaddata initial_data
python manage.py loaddata fake_data
python manage.py sync_tenant_permissions
python manage.py runserver 0.0.0.0:8000
