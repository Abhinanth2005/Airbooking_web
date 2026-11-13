from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'user',
        'flight',
        'seats',
        'total_price',
        'payment_status',
        'created_at'
    )

    list_filter = ('payment_status', 'created_at')
    search_fields = ('user__email','flight__flight_number')
