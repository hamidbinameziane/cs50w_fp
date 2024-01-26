from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from .models import PdfBook, User


import os
import fitz, sys, pathlib  # PyMuPDF
from django.contrib.auth import login, logout,authenticate
from django.contrib.auth.forms import UserCreationForm
from django import forms
from django.forms import ModelForm

class UploadFileForm(ModelForm):
    class Meta:
        model = PdfBook
        fields = ('title', 'description', 'book')
        widgets = {
            'title':forms.TextInput(attrs={
                'class': "form-control",
                'placeholder': "Title",
                'style': "margin-bottom: 20px;",
            }),
            'description':forms.Textarea(attrs={
                'class': "form-control",
                'placeholder': "Enter description here...",
                'style': "margin-bottom: 20px;",
                'rows':"4",
            }),
            'book': forms.FileInput(attrs={
                'class': "form-control",
                'placeholder': "Book",
                'style': "margin-bottom: 20px;",
                })
        }
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
    books = PdfBook.objects.all()
    return render(request, 'read/index.html', {'books': books})

def display(request, book_id):
    return render(request, 'read/display.html')

def pages(request):
    b_id = int(request.GET.get("b"))
    file = f'media/{PdfBook.objects.get(pk=b_id).book}'
    qry = (int(request.GET.get("q"))) - 1
    pdf_file = fitz.open(file)
    length = len(pdf_file)
    if qry < 0:
        qry = 0
    if qry >= length:
        qry = length - 1
    page = pdf_file[qry]
    pix = page.get_pixmap(dpi=300)
    text = page.get_text()
    url_t = "media/page.txt"
    url = "media/page.png"
    pix.save(url)
    pathlib.Path(url_t).write_bytes(text.encode())
    
    return JsonResponse({"image": url,"text":url_t, 'length':length , 'page': qry + 1}, status=201)


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
    
def add_book(request):
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('index')
        
    else:
        form = UploadFileForm()

        return render(request, 'read/add_book.html', {'form': form})