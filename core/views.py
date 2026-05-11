from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, authenticate, logout
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required

# SIGNUP
def signup(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('scena')
    else:
        form = UserCreationForm()
    return render(request, 'auth/signup.html', {'form': form})

# LOGIN
def login_page(request):
    if request.method == "POST":
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('scena')
    else:
        form = AuthenticationForm()
    return render(request, 'auth/login.html', {'form': form})

# LOGOUT
def logout_view(request):
    logout(request)
    return redirect('login')

# HOME
def scena(request):
    return render(request, 'core/scena.html')

# WATCHLIST PAGE
@login_required(login_url='/login/')
def watchlist(request):
    return render(request, 'core/watchlist.html')

# TV SHOWS
def shows(request):
    return render(request, 'core/shows.html')

# ACTORS
def actors(request):
    return render(request, 'core/actors.html')

# DETAILS PAGE
def details(request):
    return render(request, 'core/details.html')

# RATINGS
@login_required(login_url='/login/')
def rates(request):
    return render(request, 'core/rates.html')