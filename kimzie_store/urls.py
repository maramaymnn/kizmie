from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('admin-login/', admin.site.urls),
    path('', include('store.urls')),
]