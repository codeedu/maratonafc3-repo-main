import string

from django.core.exceptions import ValidationError


def simple_domain_name_validator(value):
    checks = ((s in value) for s in string.whitespace)
    if any(checks):
        raise ValidationError(
            "O domínio não pode ter espaços ou tabs.",
            code='invalid',
        )