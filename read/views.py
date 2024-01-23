from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from .models import DangoBook


import os
import fitz, sys, pathlib  # PyMuPDF
from django.contrib.auth import login, logout,authenticate
from django.contrib.auth.forms import UserCreationForm
from django import forms
from .models import User

class RegisterForm(UserCreationForm):
    email = forms.EmailField(max_length=200, help_text='Required', widget=forms.EmailInput(attrs={"class": "form-control", "placeholder": "Enter email"}))

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')
        
    def __init__ (self, *args, **kwargs):
        super(RegisterForm, self).__init__(*args, **kwargs)
        self.fields['username'].widget.attrs['class'] = "form-control"
        self.fields['username'].widget.attrs['placeholder'] = "Username"
        self.fields['password1'].widget.attrs['class'] = "form-control"
        self.fields['password1'].widget.attrs['placeholder'] = "Password"
        self.fields['password2'].widget.attrs['class'] = "form-control"
        self.fields['password2'].widget.attrs['placeholder'] = "Re-enter Password"

def index(request):
    return render(request, 'read/index.html')

def pages(request):
    file = "django5.pdf"
    qry = int(request.GET.get("q")) + 5
    pdf_file = fitz.open(file)
    page = pdf_file[qry]
    pix = page.get_pixmap(dpi=300)
    text = page.get_text()
    url_t = "media/page.txt"
    url = "media/page.png"
    pix.save(url)
    pathlib.Path(url_t).write_bytes(text.encode())
    
    return JsonResponse({"image": url,"text":url_t}, status=201)


def register(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('index')
    else:
        form = RegisterForm()

    return render(request, 'read/register.html', {'form': form})

def log_out(request):
    logout(request)
    return redirect('index')
    
def log_in(request):
    if request.method == "POST":
        un = request.POST['username']
        pw = request.POST['password']
        usr = authenticate(request, username=un, password=pw)
        if usr is not None:
            login(request, usr)
            return redirect('index')
    else:
        return render(request, 'read/login.html')