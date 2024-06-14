from django.core.management.base import BaseCommand
from management.models import Dealer
from faker import Faker
import random

class Command(BaseCommand):
    help = 'Generate 100 dummy dealer data'

    def handle(self, *args, **kwargs):
        fake = Faker('en_IN')
        dealer_types = ['Retail', 'Wholesale', 'Distributor', 'Franchise']
        states = [
            'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
            'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
            'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
            'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
            'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
            'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
        ]

        for _ in range(100):
            name = fake.company()
            description = fake.text(max_nb_chars=200)
            address = f"{fake.street_address()}, {fake.city()}, {random.choice(states)}"
            email = fake.email()
            phone_number = fake.phone_number()
            dealer_type = random.choice(dealer_types)

            dealer = Dealer(
                name=name,
                description=description,
                address=address,
                email=email,
                phone_number=phone_number,
                dealer_type=dealer_type
            )
            dealer.save()

        self.stdout.write(self.style.SUCCESS('Successfully generated 100 dealer data'))
