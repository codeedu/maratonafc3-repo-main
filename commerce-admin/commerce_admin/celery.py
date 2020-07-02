# Standard Library
import json
import os

import kombu
from celery import Celery, bootsteps
from django.db import transaction
from django.utils.crypto import get_random_string

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'commerce_admin.settings')
app = Celery('celeryapp')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()


# queues = (
#     {name: ''}
# )


# # setting publisher
def rabbitmq_conn():
    return app.pool.acquire(block=True)


def rabbitmq_producer():
    return app.producer_pool.acquire(block=True)
    # exchange = kombu.Exchange(
    #     name='myexchange',
    #     type='direct',
    #     durable=True,
    #     channel=conn,
    # )
    # exchange.declare()


with rabbitmq_conn() as conn:
    queue = kombu.Queue(
        name='commerce-admin/new-subscription',
        exchange='amq.direct',
        routing_key='',
        channel=conn,
        durable=True
    )
    queue.declare()


class NewSubscriptionConsumerStep(bootsteps.ConsumerStep):

    def get_consumers(self, channel):
        return [
            kombu.Consumer(
                channel,
                queues=[queue],
                callbacks=[self.handle_message],
                accept=['json']
            )
        ]

    def handle_message(self, body, message):
        data = json.loads(body)

        from my_admin.models import Customer, CustomerAddress, Checkout, Plan, Subscription
        from tenant.models import Tenant
        from auth_app.models import UserTenant
        from tenant.utils import set_tenant
        try:
            with transaction.atomic():
                tenant = Tenant.objects.create(
                    company=data['name'],
                    is_admin=False,
                    site=data['site'],
                    fallback_subdomain=get_random_string(length=6)
                )
                set_tenant(tenant)
                UserTenant.objects.create_tenant_admin(
                    username=data['email'],
                    email=data['email'],
                    password='123456'
                )
                customer = Customer.objects.create(
                    name=data['name'],
                    email=data['email'],
                    personal_document=data['document_number'],
                )
                address = CustomerAddress.objects.create(
                    customer=customer,
                    zip_code=data['zipcode'],
                    street=data['street'],
                    street_number=data['street_number'],
                    street_2=data['complementary'],
                    neighborhood=data['neighborhood'],
                    city='teste',
                    state='teste',
                    ddd1=data['ddd'],
                    phone1=data['number']
                )
                remote_subscription = data['Subscriptions'][0]
                plan = Plan.objects.get(id=remote_subscription['PlanID'])
                checkout = Checkout.objects.create(
                    plan=plan,
                    remote_plan_id=remote_subscription['RemotePlanID'],
                    customer_address=address,
                    price=plan.price
                )
                Subscription.objects.create(
                    checkout=checkout,
                    start_date=remote_subscription['StartDate'][0:10],
                    expires_date=remote_subscription['ExpiresAtDate'][0:10],
                    remote_subscription_id=remote_subscription['RemoteSubscriptionID'],
                )
                from django.conf import settings
                settings.ALLOWED_HOSTS.clear()
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.exception(e)
        message.ack()


app.steps['consumer'].add(NewSubscriptionConsumerStep)
