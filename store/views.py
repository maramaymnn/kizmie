import json
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.contrib.auth.models import User
from django.db import transaction
from django.db.models import Exists, OuterRef
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

def admin_login(request):
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '')

        user = authenticate(
            request,
            username=username,
            password=password
        )

        if user is not None:
            if user.is_staff:
                login(request, user)
                return redirect('/admin/')

            return render(
                request,
                'store/admin_login.html',
                {'error': 'You do not have admin access.'}
            )

        return render(
            request,
            'store/admin_login.html',
            {'error': 'Invalid username or password.'}
        )

    return render(request, 'store/admin_login.html')
def admin_logout(request):
    logout(request)
    return redirect('home')

def register(request):
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        email = request.POST.get('email', '').strip()
        password = request.POST.get('password', '')
        confirm_password = request.POST.get('confirm_password', '')

        if not username or not email or not password:
            return render(
                request,
                'store/register.html',
                {'error': 'Please fill in all fields.'}
            )

        if password != confirm_password:
            return render(
                request,
                'store/register.html',
                {'error': 'Passwords do not match.'}
            )

        if User.objects.filter(username__iexact=username).exists():
            return render(
                request,
                'store/register.html',
                {'error': 'This username is already taken.'}
            )

        if User.objects.filter(email__iexact=email).exists():
            return render(
                request,
                'store/register.html',
                {'error': 'An account with this email already exists.'}
            )

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        login(request, user)

        return redirect('home')

    return render(request, 'store/register.html')
def user_login(request):

    if request.method == 'POST':

        username_or_email = request.POST.get(
            'username',
            ''
        ).strip()

        password = request.POST.get(
            'password',
            ''
        )

        user = authenticate(
            request,
            username=username_or_email,
            password=password
        )

        if user is None:
            user_by_email = User.objects.filter(
                email__iexact=username_or_email
            ).first()

            if user_by_email:
                user = authenticate(
                    request,
                    username=user_by_email.username,
                    password=password
                )

        if user is not None:
            login(request, user)
            return redirect('home')

        return render(
            request,
            'store/login.html',
            {
                'error': 'Invalid username/email or password.'
            }
        )

    return render(
        request,
        'store/login.html'
    )
def user_logout(request):

    logout(request)

    return redirect('home')
def home(request):

    all_products = Product.objects.filter(
        stock__gt=0
    )

    best_sellers = Product.objects.filter(
        is_best_seller=True
    ).prefetch_related('variants')[:4]

    for product in best_sellers:

        # =========================
        # SALE
        # =========================

        product.has_variant_sale = product.variants.filter(
            is_on_sale=True,
            sale_price__isnull=False
        ).exists()

        # =========================
        # OUT OF STOCK
        # =========================

        if product.variants.exists():

            product.is_out_of_stock = not product.variants.filter(
                stock__gt=0
            ).exists()

        else:

            product.is_out_of_stock = product.stock <= 0

    products_data = list(
        all_products.values(
            'id',
            'name',
            'price',
            'sale_price',
            'is_on_sale',
            'image_url',
            'stock'
        )
    )

    context = {
        'products': products_data,
        'best_sellers': best_sellers,
    }

    return render(
        request,
        'store/OnlineStorePage1.html',
        context
    )
def best_sellers(request):

    products = Product.objects.filter(
        is_best_seller=True
    ).prefetch_related('variants')

    for product in products:

        # =========================
        # SALE
        # =========================

        product.has_variant_sale = product.variants.filter(
            is_on_sale=True,
            sale_price__isnull=False
        ).exists()

        # =========================
        # OUT OF STOCK
        # =========================

        if product.variants.exists():

            product.is_out_of_stock = not product.variants.filter(
                stock__gt=0
            ).exists()

        else:

            product.is_out_of_stock = product.stock <= 0

    return render(
        request,
        'store/best_sellers.html',
        {
            'products': products
        }
    )

def bags(request):

    products = Product.objects.filter(
        category='bags',
        stock__gt=0
    ).order_by('-created_at')

    paginator = Paginator(
        products,
        8
    )

    page_number = request.GET.get('page')

    page_obj = paginator.get_page(
        page_number
    )

    products_data = list(
        products.values(
            'id',
            'name',
            'price',
            'sale_price',
            'is_on_sale',
            'image_url',
            'stock'
        )
    )

    return render(
        request,
        'store/Bags.html',
        {
            'products': products_data,
            'page_obj': page_obj,
        }
    )


def wallets_view(request):

    all_products = Product.objects.filter(
        stock__gt=0,
        category='wallets'
    )

    products_data = list(
    all_products.values(
        'id',
        'name',
        'price',
        'sale_price',
        'is_on_sale',
        'image_url',
        'stock'
    )
    )

    return render(
        request,
        'store/wallets.html',
        {
            'products': products_data
        }
    )


def belts_view(request):

    all_products = Product.objects.filter(
        stock__gt=0,
        category='belts'
    )

    products_data = list(
    all_products.values(
        'id',
        'name',
        'price',
        'sale_price',
        'is_on_sale',
        'image_url',
        'stock'
    )
    )

    return render(
        request,
        'store/Belts.html',
        {
            'products': products_data
        }
    )
def checkout(request):

    if request.method == 'POST':

        full_name = request.POST.get(
            'full_name',
            ''
        ).strip()

        email = request.POST.get(
            'email',
            'guest@store.com'
        ).strip()

        address = request.POST.get(
            'address',
            ''
        ).strip()

        phone = request.POST.get(
            'phone',
            ''
        ).strip()

        governorate = request.POST.get(
            'governorate',
            ''
        ).strip()

        city = request.POST.get(
            'city',
            ''
        ).strip()

        shipping_method = request.POST.get(
            'shipping_method',
            'Standard Delivery'
        ).strip()

        payment_method = request.POST.get(
            'payment_method',
            'COD'
        )

        promo_code = request.POST.get(
            'promo_code',
            ''
        ).strip().upper()

        # =========================
        # BASIC VALIDATION
        # =========================

        if not full_name:
            return render(
                request,
                'store/checkout.html',
                {
                    'error':
                        'Please enter your full name.'
                }
            )

        if not address:
            return render(
                request,
                'store/checkout.html',
                {
                    'error':
                        'Please enter your address.'
                }
            )

        if not phone:
            return render(
                request,
                'store/checkout.html',
                {
                    'error':
                        'Please enter your phone number.'
                }
            )

        if not phone.isdigit() or len(phone) != 11:
            return render(
                request,
                'store/checkout.html',
                {
                    'error':
                        'Please enter a valid 11-digit phone number.'
                }
            )

        # =========================
        # PAYMENT METHOD
        # =========================

        if payment_method not in ['COD', 'Online']:
            payment_method = 'COD'

        is_paid_status = False

        # =========================
        # SHIPPING
        # =========================

        if not governorate:
            return render(
                request,
                'store/checkout.html',
                {
                    'error':
                        'Please select your governorate.'
                }
            )

        if not city:
            return render(
                request,
                'store/checkout.html',
                {
                    'error':
                        'Please enter your city.'
                }
            )

        if shipping_method != 'Standard Delivery':
            shipping_method = 'Standard Delivery'

        delivery_zone = DeliveryZone.objects.filter(
            governorate=governorate,
            is_active=True
        ).first()

        if not delivery_zone:
            return render(
                request,
                'store/checkout.html',
                {
                    'error':
                        'Delivery is not available for this governorate.'
                }
            )

        shipping_cost = delivery_zone.delivery_price

        # =========================
        # GET CART
        # =========================

        cart_json = request.POST.get(
            'cart_data',
            '[]'
        )

        try:
            cart = json.loads(cart_json)

        except (json.JSONDecodeError, TypeError):
            cart = []

        if not isinstance(cart, list) or not cart:
            return render(
                request,
                'store/checkout.html',
                {
                    'error':
                        'Your cart is empty.'
                }
            )

        # =========================
        # VALIDATE CART DATA
        # =========================

        cart_items = []

        for item in cart:

            if not isinstance(item, dict):
                return render(
                    request,
                    'store/checkout.html',
                    {
                        'error':
                            'Invalid product information.'
                    }
                )

            try:
                product_id = int(
                    item.get('id')
                )

                quantity = int(
                    item.get('quantity')
                )

            except (TypeError, ValueError):
                return render(
                    request,
                    'store/checkout.html',
                    {
                        'error':
                            'Invalid product information.'
                    }
                )

            if quantity <= 0:
                return render(
                    request,
                    'store/checkout.html',
                    {
                        'error':
                            'Invalid product quantity.'
                    }
                )

            variant_id = item.get(
                'variantId'
            )

            if variant_id in ['', None]:
                variant_id = None

            else:
                try:
                    variant_id = int(
                        variant_id
                    )

                except (TypeError, ValueError):
                    return render(
                        request,
                        'store/checkout.html',
                        {
                            'error':
                                'Invalid product variant.'
                        }
                    )

            cart_items.append({
                'product_id': product_id,
                'variant_id': variant_id,
                'quantity': quantity
            })

        # =========================
        # PROMO
        # =========================

        promo = None

        if promo_code:

            promo = PromoCode.objects.filter(
                code__iexact=promo_code,
                is_active=True
            ).first()

            if not promo:
                return render(
                    request,
                    'store/checkout.html',
                    {
                        'error':
                            'Invalid or inactive promo code.'
                    }
                )

            if promo.discount_percent > 100:
                return render(
                    request,
                    'store/checkout.html',
                    {
                        'error':
                            'Invalid promo code discount.'
                    }
                )

        # =========================
        # LOCK + VALIDATE STOCK
        # =========================

        with transaction.atomic():

            locked_items = []

            subtotal = 0

            for item in cart_items:

                product = Product.objects.select_for_update().filter(
                    id=item['product_id']
                ).first()

                if not product:
                    return render(
                        request,
                        'store/checkout.html',
                        {
                            'error':
                                'One of the products is no longer available.'
                        }
                    )

                variant = None

                # =========================
                # PRODUCT WITH VARIANT
                # =========================

                if item['variant_id'] is not None:

                    variant = ProductVariant.objects.select_for_update().filter(
                        id=item['variant_id'],
                        product=product
                    ).first()

                    if not variant:
                        return render(
                            request,
                            'store/checkout.html',
                            {
                                'error':
                                    f'The selected color for '
                                    f'"{product.name}" is no longer available.'
                            }
                        )

                    quantity = item['quantity']

                    # Check VARIANT stock
                    if variant.stock < quantity:
                        color_text = (
                            variant.color
                            if variant.color
                            else 'selected color'
                        )

                        return render(
                            request,
                            'store/checkout.html',
                            {
                                'error':
                                    f'Sorry, only {variant.stock} '
                                    f'of "{product.name}" '
                                    f'in {color_text} are available.'
                            }
                        )

                    # =========================
                    # VARIANT PRICE
                    # =========================

                    if (
                        variant.is_on_sale
                        and variant.sale_price is not None
                    ):
                        item_price = variant.sale_price

                    elif variant.price is not None:
                        item_price = variant.price

                    else:
                        item_price = product.current_price

                # =========================
                # PRODUCT WITHOUT VARIANT
                # =========================

                else:

                    quantity = item['quantity']

                    if product.stock < quantity:
                        return render(
                            request,
                            'store/checkout.html',
                            {
                                'error':
                                    f'Sorry, only {product.stock} '
                                    f'of "{product.name}" are available.'
                            }
                        )

                    item_price = product.current_price

                # =========================
                # CALCULATE ITEM TOTAL
                # =========================

                item_total = (
                    item_price * quantity
                )

                subtotal += item_total

                locked_items.append({
                    'product': product,
                    'variant': variant,
                    'quantity': quantity,
                    'price': item_price
                })

            # =========================
            # DISCOUNT
            # =========================

            discount_amount = 0

            if promo:

                discount_amount = (
                    subtotal
                    * promo.discount_percent
                ) / 100

            # =========================
            # FINAL TOTAL
            # =========================

            total_price = (
                subtotal
                + shipping_cost
                - discount_amount
            )

            # =========================
            # CREATE ORDER
            # =========================

            order = Order.objects.create(
                user=(
                    request.user
                    if request.user.is_authenticated
                    else None
                ),
                full_name=full_name,
                email=email,
                address=address,
                phone=phone,
                governorate=governorate,
                city=city,
                shipping_method=shipping_method,
                shipping_cost=shipping_cost,
                total_price=total_price,
                payment_method=payment_method,
                is_paid=is_paid_status
            )

            # =========================
            # SAVE ORDER ID IN SESSION
            # =========================

            if 'user_orders' not in request.session:
                request.session['user_orders'] = []

            request.session['user_orders'].append(
                order.id
            )

            request.session.modified = True

            # =========================
            # CREATE ORDER ITEMS
            # + REDUCE CORRECT STOCK
            # =========================

            for item in locked_items:

                product = item['product']
                variant = item['variant']
                quantity = item['quantity']

                OrderItem.objects.create(
                    order=order,
                    product=product,
                    variant=variant,
                    price=item['price'],
                    quantity=quantity
                )

                # Variant stock
                if variant:

                    variant.stock -= quantity

                    variant.save(
                        update_fields=['stock']
                    )

                # Normal product stock
                else:

                    product.stock -= quantity

                    product.save(
                        update_fields=['stock']
                    )

        # =========================
        # CLEAR CART
        # =========================

        request.session['cart'] = []

        return render(
            request,
            'store/checkout.html',
            {
                'order_success': True,
                'order': order
            }
        )

    # =========================
    # GET REQUEST
    # =========================

    return render(
        request,
        'store/checkout.html'
    )

def apply_promo(request):

    if request.method != 'POST':

        return JsonResponse({

            'success': False,

            'message':
                'Invalid request.'

        })


    promo_code = request.POST.get(
        'promo_code',
        ''
    ).strip().upper()


    if not promo_code:

        return JsonResponse({

            'success': False,

            'message':
                'Please enter a promo code.'

        })


    promo = PromoCode.objects.filter(
         code__iexact=promo_code,
         is_active=True
    ).first()


    if not promo:

        return JsonResponse({

            'success': False,

            'message':
                'Invalid or inactive promo code.'

        })


    if promo.discount_percent > 100:

        return JsonResponse({

            'success': False,

            'message':
                'Invalid promo code discount.'

        })


    return JsonResponse({

        'success': True,

        'discount_percent':
            promo.discount_percent,

        'message':
            f'{promo.discount_percent}% '
            'discount applied!'

    })

@login_required(login_url='login')
def order_history(request):
    orders = Order.objects.filter(
        user=request.user
    ).order_by('-created_at')

    return render(
        request,
        'store/order_history.html',
        {'orders': orders}
    )

def product_detail(request, product_id):

    product = Product.objects.get(
        id=product_id
    )

    all_products = Product.objects.filter(
        stock__gt=0
    )

    products_data = list(
        all_products.values(
            'id',
            'name',
            'price',
            'sale_price',
            'is_on_sale',
            'image_url',
            'stock'
        )
    )

    variants = list(
    product.variants.values(
        'id',
        'color',
        'image_url',
        'price',
        'sale_price',
        'is_on_sale',
        'stock'
        )
    )

    return render(
        request,
        'store/product_detail.html',
        {
            'product': product,
            'products': products_data,
            'variants': variants,
        }
    )


def delivery_price(request):
    governorate = request.GET.get("governorate")

    if not governorate:
        return JsonResponse({
            "success": False,
            "delivery_price": 0
        })

    try:
        zone = DeliveryZone.objects.get(
            governorate=governorate,
            is_active=True
        )

        return JsonResponse({
            "success": True,
            "delivery_price": float(zone.delivery_price)
        })

    except DeliveryZone.DoesNotExist:
        return JsonResponse({
            "success": False,
            "delivery_price": 0
        })
    
def contact(request):
    if request.method == 'POST':
        name = request.POST.get('name', '').strip()
        email = request.POST.get('email', '').strip()
        phone = request.POST.get('phone', '').strip()
        message = request.POST.get('message', '').strip()

        if not name or not email or not message:
            return render(
                request,
                'store/contact.html',
                {'error': 'Please fill in all required fields.'}
            )

        ContactMessage.objects.create(
            name=name,
            email=email,
            phone=phone,
            message=message,
        )

        return render(
            request,
            'store/contact.html',
            {'success': 'Your message has been sent successfully.'}
        )

    return render(request, 'store/contact.html')
def policy(request):
    policy = Policy.objects.first()
    return render(
        request,
        'store/policy.html',
        {'policy': policy}
    )