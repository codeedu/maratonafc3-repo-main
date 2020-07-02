from django.contrib.contenttypes.models import ContentType
from django.db.models.signals import post_save, post_delete, m2m_changed
from django.dispatch import receiver

from commerce_admin.celery import rabbitmq_producer


class PublisherModelObserver:

    def __init__(self, sender, serializer=None) -> None:
        self.sender = sender
        self.serializer = serializer

    def register(self):
        receiver(post_save, sender=self.sender)(self.model_saved)
        receiver(post_delete, sender=self.sender)(self.model_deleted)

    def model_saved(self, instance, created, **kwargs):
        action = 'created' if created else 'updated'
        routing_key = self._get_routing_key(action)
        message = self.serializer(instance).data
        self._publish(message, routing_key)

    def model_deleted(self, instance, **kwargs):
        routing_key = self._get_routing_key('deleted')
        message = {'id': instance.id}
        self._publish(message, routing_key)

    def register_many(self):
        m2m_changed.connect(self.relation_add,sender=self.sender)

    def relation_add(self, instance, action, pk_set, **kwargs):
        if action != "post_add":
            return
        routing_key = self._get_routing_key('add')
        message = {
            'id': instance.id,
            'relation_ids': list(pk_set)
        }
        self._publish(message, routing_key)

    def _get_routing_key(self, action):
        model_name = self._get_model_name()
        return 'model.%s.%s' % (model_name, action)

    def _get_model_name(self):
        return ContentType.objects.get_for_model(self.sender).model

    def _publish(self, message, routing_key):
        with rabbitmq_producer() as producer:
            producer.publish(
                body=message,
                routing_key=routing_key,
                exchange='amq.topic'
            )