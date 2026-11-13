from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from accounts.permissions import IsAdminUserPermission
from .models import Flight
from .serializers import FlightSerializer


class FlightSearchView(generics.ListAPIView):
    serializer_class = FlightSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Flight.objects.all().order_by('departure_time')

        source = self.request.query_params.get('source')
        destination = self.request.query_params.get('destination')
        date = self.request.query_params.get('date')
        available_only = self.request.query_params.get('available_only')

        if source:
            queryset = queryset.filter(source__icontains=source)

        if destination:
            queryset = queryset.filter(destination__icontains=destination)

        if date:
            queryset = queryset.filter(departure_time__date=date)

        if available_only == 'true':
            queryset = queryset.filter(available_seats__gt=0)

        return queryset


class FlightDetailView(generics.RetrieveAPIView):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer
    permission_classes = [IsAuthenticated]


class AdminFlightListView(generics.ListCreateAPIView):
    queryset = Flight.objects.all().order_by('-created_at')
    serializer_class = FlightSerializer
    permission_classes = [IsAdminUserPermission]


class AdminFlightDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer
    permission_classes = [IsAdminUserPermission]

    def destroy(self, request, *args, **kwargs):
        flight = self.get_object()

        if flight.bookings.exists():
            return Response({'error': 'This flight cannot be deleted because bookings exist.'},status=status.HTTP_400_BAD_REQUEST)

        return super().destroy(request, *args, **kwargs)


class AdminFlightStatusUpdateView(APIView):
    permission_classes = [IsAdminUserPermission]

    def put(self, request, pk):
        try:
            flight = Flight.objects.get(pk=pk)
        except Flight.DoesNotExist:
            return Response({'error': 'Flight not found.'},status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        valid_statuses = ['ON_TIME', 'DELAYED', 'CANCELLED']

        if new_status not in valid_statuses:
            return Response(
                {'error': 'Invalid flight status.'},status=status.HTTP_400_BAD_REQUEST)

        flight.status = new_status
        flight.save(update_fields=['status'])

        return Response({'message': 'Flight status updated successfully.','flight': FlightSerializer(flight).data},status=status.HTTP_200_OK)
