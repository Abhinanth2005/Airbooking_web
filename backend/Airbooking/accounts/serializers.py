
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True,min_length=8)

    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id','first_name','last_name','email','password','password2',]

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({
                'password': 'Passwords do not match.'
            })
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')

        password = validated_data.pop('password')
        user = User.objects.create_user(password=password,approval_status='APPROVED',**validated_data)
        return user

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id','first_name','last_name','email','approval_status','is_staff',]

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):

        data = super().validate(attrs)

        if self.user.approval_status == 'PENDING':
            raise serializers.ValidationError(
                'Your account is pending admin approval.'
            )

        if self.user.approval_status == 'REJECTED':
            raise serializers.ValidationError(
                'Your account registration has been rejected.'
            )

        data['user'] = UserSerializer(self.user).data

        return data