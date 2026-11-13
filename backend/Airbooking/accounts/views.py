from django.shortcuts import render

from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from .serializers import RegisterSerializer,UserSerializer,CustomTokenObtainPairSerializer
from .permissions import IsAdminUserPermission

User = get_user_model()

class RegisterView(generics.CreateAPIView):

    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class LoginView(TokenObtainPairView):

    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]


class PendingUsersView(generics.ListAPIView):

    serializer_class = UserSerializer
    permission_classes = [IsAdminUserPermission]

    def get_queryset(self):
        return User.objects.filter(approval_status='PENDING').order_by('id')


class ApproveUserView(APIView):

    permission_classes = [IsAdminUserPermission]

    def post(self, request, pk):

        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'},status=status.HTTP_404_NOT_FOUND)

        approval_status = request.data.get('approval_status')

        if approval_status not in ['APPROVED', 'REJECTED']:
            return Response({'error': 'approval_status must be APPROVED or REJECTED.'},status=status.HTTP_400_BAD_REQUEST)

        user.approval_status = approval_status
        user.save(update_fields=['approval_status'])

        return Response({'message': f'User {approval_status.lower()} successfully.','user': UserSerializer(user).data},status=status.HTTP_200_OK)
