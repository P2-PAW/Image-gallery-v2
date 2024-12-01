from django.http import JsonResponse
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from .models import *
from rest_framework.parsers import MultiPartParser, FormParser

class TestEndpointView(APIView):
    def get(self, request):
        return JsonResponse({"data": "Hello from django backend"})
    
class LoginView(APIView):
    def post(self, request):
        if request.user.is_authenticated:
            return Response({"message": "Jesteś już zalogowany"}, status=status.HTTP_400_BAD_REQUEST)
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                username=serializer.validated_data["username"],
                password=serializer.validated_data["password"],
            )
            if user:
                login(request, user)
                token, _ = Token.objects.get_or_create(user=user)
                user_data = UserSerializer(user).data
                return Response({"token": token.key, "user": user_data}, status=status.HTTP_200_OK)
            return Response({"message": "Nieprawidłowy login lub hasło"}, status=status.HTTP_400_BAD_REQUEST,)
        first_error_message = next(iter(serializer.errors.values()))[0] 
        return Response({"message": first_error_message}, status=status.HTTP_400_BAD_REQUEST)
        
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class RegisterView(APIView):
    def post(self, request):
        if request.user.is_authenticated:
            return Response({"message": "Jesteś już zalogowany"}, status=status.HTTP_400_BAD_REQUEST)
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            user_data = UserSerializer(user).data
            return Response({"token": token.key, "user": user_data}, status=status.HTTP_201_CREATED )
        first_error_message = next(iter(serializer.errors.values()))[0]
        return Response({"message": first_error_message}, status=status.HTTP_400_BAD_REQUEST)
    
class AddPictureView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        if not request.user.is_authenticated:
            return Response({"message": "Dostęp tylko dla zalogowanych"}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = ImageSerializerPost(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        first_error_message = next(iter(serializer.errors.values()))[0]
        return Response(first_error_message, status=status.HTTP_400_BAD_REQUEST)
    
class DeletePictureView(APIView):
    def delete(self, request, picture_id):
        if not request.user.is_authenticated:
            return Response({"message": "Dostęp tylko dla zalogowanych"}, status=status.HTTP_403_FORBIDDEN)
        try:
            picture = Image.objects.get(id=picture_id, user=request.user)
        except Image.DoesNotExist:
            return Response({"message": "Zdjęcie nie istnieje lub nie masz do niego dostępu"}, status=status.HTTP_404_NOT_FOUND)
        
        picture.delete()
        return Response({"message": "Zdjęcie zostało usunięte"}, status=status.HTTP_204_NO_CONTENT)
    
class PicturesAPIView(APIView):
    def get(self, request):
        images = Image.objects.all()
        serializer = ImageSerializer(images, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)