from django.shortcuts import render
from django.contrib.auth import authenticate, login

# Create your views here.
def sign_in(request):
    if request.method == "POST":
        user = authenticate(request, username=request.POST["login"], password=request.POST["password"])
        login(request, user)
    return render(request, "authen/sign_in.html")