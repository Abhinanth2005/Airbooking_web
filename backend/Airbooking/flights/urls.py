from django.urls import path
from .views import AdminFlightDetailView, FlightSearchView,FlightDetailView,AdminFlightListView,AdminFlightStatusUpdateView

urlpatterns = [
    path('search/', FlightSearchView.as_view(), name='flight-search'),
    path('<int:pk>/', FlightDetailView.as_view(), name='flight-detail'),
    path('admin/', AdminFlightListView.as_view(), name='admin-flight-list'),
    path('admin/<int:pk>/', AdminFlightDetailView.as_view(), name='admin-flight-detail'),
    path('admin/<int:pk>/status/', AdminFlightStatusUpdateView.as_view(), name='admin-flight-status'),
]