import random
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from management.models import Expense, Dealer

class Command(BaseCommand):
    help = 'Generate expense data and save directly to the database'

    def handle(self, *args, **kwargs):
        start_date = datetime.strptime("20-06-2023", "%d-%m-%Y")
        end_date = datetime.strptime("20-06-2024", "%d-%m-%Y")
        
        # Get all dealer IDs to randomly select from
        dealer_ids = list(Dealer.objects.values_list('id', flat=True))

        current_date = start_date
        while current_date <= end_date:
            # Generate expense data
            exp_type = random.choice([etype[0] for etype in Expense.EXPENSE_TYPES])
            expense_amount = random.uniform(100, 2500)

            expense = Expense(
                date=current_date.date(),
                amount=round(expense_amount, 2),
                description="Randomly generated expense",
                exp_type=exp_type,
                dealer_id=random.choice(dealer_ids)  # Randomly select dealer ID
            )
            expense.save()

            # Move to the next day
            current_date += timedelta(days=1)

        self.stdout.write(self.style.SUCCESS('Successfully generated and saved expense data to the database'))
