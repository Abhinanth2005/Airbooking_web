from django.shortcuts import render,get_object_or_404
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.db import transaction
from .models import Booking
from flights.models import Flight
from .serializers import BookingSerializer



class BookingListCreateView(generics.ListCreateAPIView):

    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user).select_related('flight').order_by('-created_at')


class BookingDetailView(generics.RetrieveAPIView):

    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user).select_related('flight')

class CancelBookingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        with transaction.atomic():

            booking = get_object_or_404(Booking.objects.select_for_update(),pk=pk,user=request.user)

            if booking.booking_status == "CANCELLED":
                return Response({"detail": "This booking has already been cancelled."},status=status.HTTP_400_BAD_REQUEST)

            flight = Flight.objects.select_for_update().get(pk=booking.flight_id)

            flight.available_seats += booking.seats
            flight.save(update_fields=["available_seats"])

            booking.booking_status = "CANCELLED"
            booking.save(update_fields=["booking_status"])

        return Response(
            {
                "message": "Booking cancelled successfully.",
                "booking_id": booking.id,
                "booking_status": booking.booking_status,
                "available_seats": flight.available_seats
            },
            status=status.HTTP_200_OK
        )    
