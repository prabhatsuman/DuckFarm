import random
from django.core.management.base import BaseCommand
from management.models import FeedStock, MedicineStock, OtherStock

class Command(BaseCommand):
    help = 'Populate the database with feed, medicine, and other stocks related to ducks'

    def handle(self, *args, **kwargs):
        self.populate_feed_stock()
        self.populate_medicine_stock()
        self.populate_other_stock()
        self.stdout.write(self.style.SUCCESS('Successfully populated stocks'))

    def populate_feed_stock(self):
        feed_names = ['Duck Feed A', 'Duck Feed B', 'Duck Feed C']
        brands = ['Brand X', 'Brand Y', 'Brand Z']
        for name in feed_names:
            FeedStock.objects.create(
                name=name,
                brand=random.choice(brands),
                quantity=random.randint(10, 100),
                price=random.uniform(5.0, 20.0),
                date_of_purchase='2024-06-14',
                description=''
            )

    def populate_medicine_stock(self):
        medicine_names = ['Duck Medicine A', 'Duck Medicine B', 'Duck Medicine C']
        brands = ['Brand X', 'Brand Y', 'Brand Z']
        for name in medicine_names:
            MedicineStock.objects.create(
                name=name,
                brand=random.choice(brands),
                quantity=random.randint(10, 100),
                price=random.uniform(5.0, 50.0),
                date_of_purchase='2024-06-14',
                date_of_expiry='2025-06-14',
                description=''
            )

    def populate_other_stock(self):
        other_stock_names = ['Duck Equipment A', 'Duck Equipment B', 'Duck Equipment C']
        for name in other_stock_names:
            OtherStock.objects.create(
                name=name,
                quantity=random.randint(10, 100),
                price=random.uniform(10.0, 100.0),
                date_of_purchase='2024-06-14',
                description=''
            )
