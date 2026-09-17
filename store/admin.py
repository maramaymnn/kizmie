from django.contrib import admin
from .models import (
    Product,
    ProductVariant,
    Order,
    OrderItem,
    PromoCode,
    DeliveryZone,
    ContactMessage,
    Policy
)
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0  # عشان ميعرضش صفوف فاضية زيادة
class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1
    fields = (
        'color',
        'image_url',
        'price',
        'sale_price',
        'is_on_sale',
        'stock',
    )
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'full_name',
        'phone',
        'total_price',
        'status',
        'payment_method',
        'is_paid',
        'created_at',
    )

    list_filter = (
        'status',
        'payment_method',
        'is_paid',
    )

    search_fields = (
        'full_name',
        'phone',
        'email',
    )

    inlines = [OrderItemInline]

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):

    list_display = (
        'name',
        'category',
        'price',
        'sale_price',
        'is_on_sale',
        'stock',
        'is_best_seller',
        'created_at',
    )

    list_filter = (
        'category',
        'is_on_sale',
        'is_best_seller',
    )

    search_fields = (
        'name',
        'description',
    )

    list_editable = (
        'price',
        'sale_price',
        'is_on_sale',
        'stock',
        'is_best_seller',
    )
    inlines = [ProductVariantInline]
    ordering = (
        '-created_at',
    )
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem)
admin.site.register(PromoCode)

@admin.register(DeliveryZone)
class DeliveryZoneAdmin(admin.ModelAdmin):
    list_display = (
        'governorate',
        'delivery_price',
        'shipping_company',
        'is_active',
    )

    list_editable = (
        'delivery_price',
        'shipping_company',
        'is_active',
    )

    search_fields = (
        'governorate',
        'shipping_company',
    )
@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'email',
        'phone',
        'created_at',
    )

    search_fields = (
        'name',
        'email',
        'phone',
        'message',
    )

    ordering = (
        '-created_at',
    )
@admin.register(Policy)
class PolicyAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'updated_at',
    )

    search_fields = (
        'title',
        'content',
    )

    ordering = (
        '-updated_at',
    )