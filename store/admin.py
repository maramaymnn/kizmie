from django.contrib import admin
from .models import Product, Order, OrderItem, PromoCode

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0  # عشان ميعرضش صفوف فاضية زيادة

class OrderAdmin(admin.ModelAdmin):
    list_display = (
    'id',
    'full_name',
    'phone',
    'total_price',
    'status',
    'created_at',
    'is_paid'
)
    inlines = [OrderItemInline]

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):

    list_display = (
        'name',
        'price',
        'sale_price',
        'is_on_sale',
        'stock',
        'category',
    )
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem)
admin.site.register(PromoCode)