import random
import string

def generate_custom_id(prefix: str, mid_length=2, suffix_length=2) -> str:
    mid = ''.join(random.choices(string.ascii_uppercase, k=mid_length))
    suffix = ''.join(random.choices(string.digits, k=suffix_length))
    return f"{prefix}{mid}_{suffix}"
