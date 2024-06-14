# management/management/commands/duck_populate.py

from django.core.management.base import BaseCommand
from management.models import DuckInfo
from faker import Faker
import random

class Command(BaseCommand):
    help = 'Generate dummy duck info data for specified breeds'

    def handle(self, *args, **kwargs):
        fake = Faker()
        breeds = ['Mallard', 'Pekin', 'Khaki Campbell', 'Runner', 'Muscovy']

        for breed in breeds:
            male_count = random.randint(1, 20)
            female_count = random.randint(1, 20)

            duck_info = DuckInfo(
                breed=breed,
                male_count=male_count,
                female_count=female_count
            )
            duck_info.save()

        self.stdout.write(self.style.SUCCESS(f'Successfully generated dummy duck info data for {len(breeds)} breeds'))
