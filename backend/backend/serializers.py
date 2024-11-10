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

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "Użytkownik o podanej nazwie już istnieje."
            )
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Użytkownik o podanym adresie e-mail już istnieje."
            )
        return value

    def validate(self, data):
        if data["password"] != data["password2"]:
            raise serializers.ValidationError("Hasła nie są zgodne.")
        return data

    def create(self, validated_data):
        user = User(username=validated_data["username"], email=validated_data["email"])
        user.set_password(validated_data["password"])
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


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ("name", "date", "path", "gallery", "user")


class GallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Gallery
        fields = ("name", "date", "public")
        

class GalleryImageSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)

    class Meta:
        model = Gallery
        fields = ("id", "name", "date", "public", "images")

class GallerySerializerPost(serializers.ModelSerializer):
    class Meta:
        model = Gallery
        fields = '__all__'

    def validate_name(self, value):
        if Gallery.objects.filter(name=value).exists():
            raise serializers.ValidationError("Galeria o podanej nazwie już istnieje.")
        return value

class ImageSerializerPost(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'