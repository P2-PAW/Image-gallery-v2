from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *


class UserRegistrationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(
        write_only=True, min_length=6, style={"input_type": "password"}
    )
    password2 = serializers.CharField(
        write_only=True, min_length=6, style={"input_type": "password"}
    )

    class Meta:
        model = User
        fields = ("username", "email", "password", "password2")

    def create(self, data):
        user = User(username=data["username"], email=data["email"])
        user.set_password(data["password"])
        user.save()
        return user


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(label="Username")
    password = serializers.CharField(
        label="Password", style={"input_type": "password"}, trim_whitespace=False
    )


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email")

class ImageSerializerPost(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'
        read_only_fields = ['date', 'user']

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'