from django.http import JsonResponse
from rest_framework.views import APIView

class TestEndpointView(APIView):
    def get(self, request):
        return JsonResponse({"data": "Hello from django backend"})