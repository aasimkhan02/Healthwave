import csv
from decimal import Decimal, InvalidOperation
from django.core.management.base import BaseCommand
from Healthcare_app.models import Medication  

class Command(BaseCommand):
    help = 'Load medications from a CSV file'

    def handle(self, *args, **kwargs):
        with open(r'C:\Users\moidin\Desktop\Healthcare\cleaned_data3.csv', 'r') as file:  # Update the path to your CSV file
            reader = csv.DictReader(file)
            for row in reader:
                # Clean and convert product_price
                price_str = row.get('product_price', '').replace('₹', '').replace(',', '').strip()  # Clean the price
                try:
                    product_price = Decimal(price_str) if price_str else None
                except InvalidOperation:
                    product_price = None  # Handle any conversion issues

                Medication.objects.create(
                    medicine_name=row['medicine_name'],
                    salt_composition=row.get('salt_composition', ''),
                    product_price=product_price,
                    manufacturer_name=row['manufacturer_name'],
                    medicine_desc=row.get('medicine_desc', ''),
                    side_effects=row.get('side_effects', ''),
                    drug_interactions=row.get('drug_interactions', ''),
                    is_discontinued=row.get('Is_discontinued', 'False').strip().lower() == 'true',
                    type=row.get('type', ''),
                    short_composition1=row.get('short_composition1', ''),
                    short_composition2=row.get('short_composition2', ''),
                    pack_size_label=row.get('pack_size_label', ''),
                )
        self.stdout.write(self.style.SUCCESS('Successfully loaded medications'))
