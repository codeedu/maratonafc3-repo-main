#!/bin/bash

python manage.py migrate
python manage.py loaddata initial_data
python manage.py sync_tenant_permissions
python manage.py runserver 0.0.0.0:8000
