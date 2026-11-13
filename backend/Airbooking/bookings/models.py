from django.db import models
from django.conf import settings
from flights.models import Flight


class Booking(models.Model):

    PAYMENT_STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('PAID', 'Paid'),
        ('FAILED', 'Failed'),
    ]
    BOOKING_STATUS_CHOICES = [
    ('CONFIRMED', 'Confirmed'),
    ('CANCELLED', 'Cancelled'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='bookings')
    flight = models.ForeignKey(Flight,on_delete=models.CASCADE,related_name='bookings')
    seats = models.PositiveIntegerField(default=1)
    total_price = models.DecimalField(max_digits=10,decimal_places=2)
    payment_status = models.CharField(max_length=10,choices=PAYMENT_STATUS_CHOICES,default='PENDING')
    booking_status = models.CharField(max_length=15,choices=BOOKING_STATUS_CHOICES,default='CONFIRMED')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking #{self.id} - {self.user.email}"
