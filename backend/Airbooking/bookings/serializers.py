from django.db import transaction
from rest_framework import serializers
from .models import Booking
from flights.models import Flight


class BookingSerializer(serializers.ModelSerializer):

    flight = serializers.PrimaryKeyRelatedField(queryset=Flight.objects.all())
    payment_success = serializers.BooleanField(write_only=True,default=True)

    class Meta:
        model = Booking
        fields = ['id','flight','seats','total_price','payment_status','payment_success','booking_status','created_at']
        read_only_fields = ['id','total_price','payment_status','created_at']

    def validate_seats(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Number of seats must be greater than zero."
            )
        return value

    def create(self, validated_data):

        payment_success = validated_data.pop('payment_success')

        with transaction.atomic():

            flight = Flight.objects.select_for_update().get(pk=validated_data['flight'].pk)
            seats = validated_data['seats']

            if not payment_success:
                return Booking.objects.create(
                    user=self.context['request'].user,
                    flight=flight,
                    seats=seats,
                    total_price=flight.price * seats,
                    payment_status='FAILED'
                )

            if flight.available_seats < seats:
                raise serializers.ValidationError({
                    'seats': 'Not enough seats available.'
                })

            flight.available_seats -= seats
            flight.save(update_fields=['available_seats'])

            booking = Booking.objects.create(
                user=self.context['request'].user,
                flight=flight,
                seats=seats,
                total_price=flight.price * seats,
                payment_status='PAID'
            )
            return booking