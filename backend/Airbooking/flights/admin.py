from django.contrib import admin
from .models import Flight


@admin.register(Flight)
class FlightAdmin(admin.ModelAdmin):
    list_display = (
        'flight_number',
        'airline',
        'source',
        'destination',
        'departure_time',
        'price',
        'available_seats',
        'status'
    )

    list_filter = ('status', 'source', 'destination')
    search_fields = ('flight_number', 'airline', 'source', 'destination')
