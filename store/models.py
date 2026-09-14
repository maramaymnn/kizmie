from django.contrib.auth.models import User
from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    sale_price = models.DecimalField(max_digits=10,decimal_places=2,null=True,blank=True)
    is_on_sale = models.BooleanField(default=False)
    @property
    def current_price(self):
        if self.is_on_sale and self.sale_price is not None:
            return self.sale_price
        return self.price
    description = models.TextField(blank=True, null=True)
    image_url = models.CharField(max_length=500, blank=True, null=True)
    category = models.CharField(max_length=100,choices=[('bags', 'Bags'),('wallets', 'Wallets'),('belts', 'Belts'),])
    page = models.IntegerField(default=1)
    stock = models.IntegerField(default=1)
    is_best_seller = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class PromoCode(models.Model):
    code = models.CharField(max_length=50, unique=True)
    discount_percent = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.code

class Order(models.Model):

    PAYMENT_CHOICES = (
        ('COD', 'Cash on Delivery'),
        ('Online', 'Credit Card / Vodafone Cash / Instapay'),
    )

    STATUS_CHOICES = (
        ('Confirmed', 'Confirmed'),
        ('Processing', 'Processing'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    full_name = models.CharField(max_length=150)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField()
    phone = models.CharField(max_length=20)

    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00
    )

    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_CHOICES,
        default='COD'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Confirmed'
    )

    is_paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.full_name}"


class OrderItem(models.Model):

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items'
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} of {self.product.name}"