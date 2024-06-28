import random
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from management.models import Sales, Dealer

class Command(BaseCommand):
    help = 'Generate sales data and save directly to the database'

    def handle(self, *args, **kwargs):
        start_date = datetime.strptime("20-06-2023", "%d-%m-%Y")
        end_date = datetime.strptime("28-06-2024", "%d-%m-%Y")
        dealer_id = 1
        dealer = Dealer.objects.get(pk=dealer_id)

        current_date = start_date
        while current_date <= end_date:
            price_per_egg = random.uniform(5, 10)
            quantity = random.randint(100, 250)
            amount = price_per_egg * quantity

            # Create Sales instance
            sale = Sales(
                date=current_date.date(),
                dealer=dealer,
                quantity=quantity,
                amount=round(amount, 2),  # round to 2 decimal places
                description="--"
            )
            sale.save()  # Save instance to database

            # Move to the next day
            current_date += timedelta(days=1)

        self.stdout.write(self.style.SUCCESS('Successfully generated and saved sales data to the database'))
