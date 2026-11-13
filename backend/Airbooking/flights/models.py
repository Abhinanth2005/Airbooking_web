from django.db import models



class Flight(models.Model):

    STATUS_CHOICES = [
        ('ON_TIME', 'On Time'),
        ('DELAYED', 'Delayed'),
        ('CANCELLED', 'Cancelled'),
    ]

    flight_number = models.CharField(max_length=20, unique=True)
    airline = models.CharField(max_length=100)
    source = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    total_seats = models.PositiveIntegerField()
    available_seats = models.PositiveIntegerField()
    status = models.CharField(max_length=15,choices=STATUS_CHOICES,default='ON_TIME')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.flight_number}: {self.source} to {self.destination}"
