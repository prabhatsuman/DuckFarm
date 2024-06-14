import random
from django.core.management.base import BaseCommand
from management.models import FeedStock, MedicineStock, OtherStock

class Command(BaseCommand):
    help = 'Populate the database with feed, medicine, and other stocks related to ducks'

    def handle(self, *args, **kwargs):
        self.clear_data()
        self.populate_feed_stock()
        self.populate_medicine_stock()
        self.populate_other_stock()
        self.stdout.write(self.style.SUCCESS('Successfully populated stocks'))

    def clear_data(self):
        FeedStock.objects.all().delete()
        MedicineStock.objects.all().delete()
        OtherStock.objects.all().delete()
        self.stdout.write(self.style.WARNING('Cleared existing stock data'))

    def populate_feed_stock(self):
        feed_names = ['Duck Feed A', 'Duck Feed B', 'Duck Feed C']
        brands = ['Brand X', 'Brand Y', 'Brand Z']
        for _ in range(50):
            FeedStock.objects.create(
                name=random.choice(feed_names),
                brand=random.choice(brands),
                quantity=random.randint(10, 100),
                price=round(random.uniform(5.0, 20.0), 2),
                date_of_purchase='2024-06-14',
                description='Random description'
            )

    def populate_medicine_stock(self):
        medicine_names = ['Duck Medicine A', 'Duck Medicine B', 'Duck Medicine C']
        brands = ['Brand X', 'Brand Y', 'Brand Z']
        for _ in range(50):
            MedicineStock.objects.create(
                name=random.choice(medicine_names),
                brand=random.choice(brands),
                quantity=random.randint(10, 100),
                price=round(random.uniform(5.0, 50.0), 2),
                date_of_purchase='2024-06-14',
                date_of_expiry='2025-06-14',
                description='Random description'
            )

    def populate_other_stock(self):
        other_stock_names = ['Duck Equipment A', 'Duck Equipment B', 'Duck Equipment C']
        for _ in range(50):
            OtherStock.objects.create(
                name=random.choice(other_stock_names),
                quantity=random.randint(10, 100),
                price=round(random.uniform(10.0, 100.0), 2),
                date_of_purchase='2024-06-14',
                description='Random description'
            )
