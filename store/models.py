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

class ProductVariant(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='variants'
    )

    color = models.CharField(
        max_length=50,
        blank=True,
        default=''
    )

    image_url = models.CharField(
        max_length=500,
        blank=True,
        default=''
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    sale_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    is_on_sale = models.BooleanField(
        default=False
    )

    stock = models.PositiveIntegerField(
        default=0
    )

    def __str__(self):
        variant_name = self.product.name

        if self.color:
            variant_name += f" - {self.color}"

        return variant_name
    
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
    governorate = models.CharField(max_length=100,blank=True,default='')

    city = models.CharField(max_length=100,blank=True,default='')
    shipping_method = models.CharField(max_length=50,default='Standard Delivery')
    shipping_cost = models.DecimalField(max_digits=10,decimal_places=2,default=0.00)

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
        on_delete=models.PROTECT
    )

    variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='order_items'
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    quantity = models.PositiveIntegerField(
        default=1
    )

    def __str__(self):
        if self.variant and self.variant.color:
            return f"{self.quantity} of {self.product.name} - {self.variant.color}"

        return f"{self.quantity} of {self.product.name}"
    
class DeliveryZone(models.Model):
    governorate = models.CharField(
        max_length=100,
        unique=True
    )

    delivery_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    is_active = models.BooleanField(
        default=True
    )

    shipping_company = models.CharField(
        max_length=100,
        blank=True,
        default=''
    )

    def __str__(self):
        return self.governorate
class ContactMessage(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.email}"

class Policy(models.Model):
    title = models.CharField(
        max_length=200,
        default='Our Policy'
    )

    no_refunds_title = models.CharField(
        max_length=200,
        default='No Refunds or Exchanges'
    )
    no_refunds_text = models.TextField(default='')

    inspection_title = models.CharField(
        max_length=200,
        default='Order Inspection'
    )
    inspection_text = models.TextField(default='')

    refused_title = models.CharField(
        max_length=200,
        default='Refused Orders'
    )
    refused_text = models.TextField(default='')

    damaged_title = models.CharField(
        max_length=200,
        default='Damaged or Incorrect Items'
    )
    damaged_text = models.TextField(default='')

    confirmation_title = models.CharField(
        max_length=200,
        default='Order Confirmation'
    )
    confirmation_text = models.TextField(default='')

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title