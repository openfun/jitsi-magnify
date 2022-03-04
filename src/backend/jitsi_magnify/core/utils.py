"""
Utils that can be useful throughout Jitsi magnify's core app
"""
import collections.abc

from django.utils.text import slugify


def normalize_code(code):
    """Normalize object codes to avoid duplicates."""
    return slugify(code, allow_unicode=False).upper() if code else None


def merge_dict(base_dict, update_dict):
    """Utility for deep dictionary updates.

    >>> d1 = {'k1':{'k11':{'a': 0, 'b': 1}}}
    >>> d2 = {'k1':{'k11':{'b': 10}, 'k12':{'a': 3}}}
    >>> merge_dict(d1, d2)
    {'k1': {'k11': {'a': 0, 'b': 10}, 'k12':{'a': 3}}}

    """
    for key, value in update_dict.items():
        if isinstance(value, collections.abc.Mapping):
            base_dict[key] = merge_dict(base_dict.get(key, {}), value)
        else:
            base_dict[key] = value
    return base_dict
