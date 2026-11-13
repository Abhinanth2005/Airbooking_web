
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import RegisterView,LoginView,TokenRefreshView,PendingUsersView,ApproveUserView

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('admin/users/pending/', PendingUsersView.as_view(), name='pending_users'),
    path('admin/users/<int:pk>/approve/', ApproveUserView.as_view(), name='approve_user'),
]
