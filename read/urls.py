from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name= "index"),
    path("register", views.register, name= "register"),
    path("log_out", views.log_out, name= "log_out"),
    path("log_in", views.log_in, name= "log_in"),
    path("add_book", views.add_book, name= "add_book"),
    path("<int:book_id>", views.display, name= "display"),
    
    
    path("pages", views.pages, name= "pages"),
    
]