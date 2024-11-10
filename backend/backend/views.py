from django.http import JsonResponse
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token

class TestEndpointView(APIView):
    def get(self, request):
        return JsonResponse({"data": "Hello from django backend"})
    
class LoginView(APIView):
    def post(self, request):
        if request.user.is_authenticated:
            return Response(
                {"message": "Jesteś już zalogowany"}, status=status.HTTP_400_BAD_REQUEST
            )
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
                return Response(
                    {"token": token.key, "user": user_data}, status=status.HTTP_200_OK
                )
            return Response(
                {"message": "Nieprawidłowy login lub hasło"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {"message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
        )
        
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)