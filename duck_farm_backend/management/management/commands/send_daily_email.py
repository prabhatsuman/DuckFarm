# management/commands/send_daily_email.py
import os
import logging
from django.core.management.base import BaseCommand, CommandError
from django.core.mail import send_mail
from django.contrib.auth.models import User  # Adjust this import to match your User model location

# Determine the log file path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOG_FILE_PATH = os.path.join(BASE_DIR, 'send_daily_email.log')

# Set up logging
logger = logging.getLogger(__name__)
handler = logging.FileHandler(LOG_FILE_PATH)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)
logger.setLevel(logging.DEBUG)


class Command(BaseCommand):
    help = 'Sends a daily email reminder to the user "prabhat" to fill in egg collection data.'

    def handle(self, *args, **kwargs):
        try:
            # Get the user by hardcoded username "prabhat"
            username = "prabhat"
            user = User.objects.get(username=username)

            subject = 'Daily Reminder: Fill in Egg Collection Data'
            message = f'Dear {user.first_name},\n\nThis is a friendly reminder to fill in the egg collection data for today.\n\nBest regards,\nYour Application Team'

            send_mail(
                subject,
                message,
                'prabhatsuman0612@gmail.com',  # Replace with your verified sender email
                [user.email],
                fail_silently=False,
            )

            logger.info(f"Successfully sent email reminder to {user.email}")
            self.stdout.write(self.style.SUCCESS(f"Successfully sent email reminder to {user.email}"))

        except User.DoesNotExist:
            error_message = f'User with username "{username}" does not exist'
            logger.error(error_message)
            raise CommandError(error_message)
        except Exception as e:
            logger.error(f'An error occurred: {str(e)}', exc_info=True)
            raise CommandError(f'An error occurred: {str(e)}')
