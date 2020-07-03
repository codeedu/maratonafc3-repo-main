#!/bin/bash

python manage.py migrate
python manage.py sync_tenant_permissions
