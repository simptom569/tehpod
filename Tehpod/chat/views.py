from django.shortcuts import render, redirect
from django.views.decorators.cache import cache_control
from api.models import Users

@cache_control(no_cache=True, must_revalidate=True, no_store=True)
def main(request):
    print(2)
    if request.user.id:
        print(1)
        print(Users.objects.get(user_user__id=request.user.id).user_permission)
        if Users.objects.get(user_user__id=request.user.id).user_permission:
            return redirect("teh")
    
    return render(request, "chat/main.html")

@cache_control(no_cache=True, must_revalidate=True, no_store=True)
def teh(request):
    if request.user.id:
        if Users.objects.get(user_user__id=request.user.id).user_permission:
            return render(request, "chat/chat.html")
    
    return redirect("main")