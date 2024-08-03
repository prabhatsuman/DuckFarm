# Use the official Python 3.10 Alpine image
FROM python:3.10-alpine

# Set environment variables to avoid writing .pyc files and buffering
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1


# Create and set the working directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Django project files
COPY . /app/

# Set the Django settings module environment variable
ENV DJANGO_SETTINGS_MODULE=duck_farm.settings

# Run the Django server
CMD ["sh", "-c", "python manage.py migrate && gunicorn --bind 0.0.0.0:8000 duck_farm.wsgi:application"]
