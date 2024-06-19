from django.core.management.base import BaseCommand
from management.models import DailyEggCollection
from faker import Faker
import random
from datetime import datetime, timedelta

class Command(BaseCommand):
    help = 'Generate dummy data for DailyEggCollection'

    def handle(self, *args, **kwargs):
        fake = Faker()
        end_date = datetime(2024, 6, 18)
        start_date = end_date - timedelta(days=365)
        dates = [start_date + timedelta(days=i) for i in range((end_date - start_date).days)]
        random.shuffle(dates)

        for date in dates:
            quantity = random.randint(0, 250)
            daily_collection = DailyEggCollection(
                date=date,
                quantity=quantity
            )
            daily_collection.save()

        self.stdout.write(self.style.SUCCESS('Successfully generated dummy data for DailyEggCollection'))
