from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *
import re


class UserRegistrationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(
        write_only=True, style={"input_type": "password"}
    )
    password2 = serializers.CharField(
        write_only=True, style={"input_type": "password"}
    )

    class Meta:
        model = User
        fields = ("username", "email", "password", "password2")

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Użytkownik o podanej nazwie już istnieje.")
        username_pattern = r'^[A-Za-z][A-Za-z0-9-_]{2,9}$'
        if not re.match(username_pattern, value):
            raise serializers.ValidationError("Nazwa użytkownika musi zaczynać się literą i może zawierać od 2 do 9 znaków." )
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError( "Użytkownik o podanym adresie e-mail już istnieje.")
        return value
    def validate_password(self, value):
        password_pattern = r'^.{6,24}$'
        if not re.match(password_pattern, value):
            raise serializers.ValidationError( "Hasło musi mieć długość od 6 do 24 znaków.")
        return value
    def validate(self, data):
        if data["password"] != data["password2"]:
            raise serializers.ValidationError("Hasła nie są zgodne.")
        return data
    
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