import json
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.core.paginator import Paginator
from .models import Product, Order, OrderItem, PromoCode

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

def home(request):

    all_products = Product.objects.filter(
        stock__gt=0
    )

    best_sellers = all_products.filter(
        is_best_seller=True
    )[:4]

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


def bags1(request):

    all_products = Product.objects.filter(
        stock__gt=0
    )

    category_products = all_products.filter(
        category='bags',
        page=1
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

    context = {
        'products': products_data,
        'category_products': category_products
    }

    return render(
        request,
        'store/Bags1.html',
        context
    )


def bags2(request):

    all_products = Product.objects.filter(
        stock__gt=0
    )

    category_products = all_products.filter(
        category='bags',
        page=2
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

    context = {
        'products': products_data,
        'category_products': category_products
    }

    return render(
        request,
        'store/Bags2.html',
        context
    )


def bags3(request):

    all_products = Product.objects.filter(
        stock__gt=0
    )

    category_products = all_products.filter(
        category='bags',
        page=3
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

    context = {
        'products': products_data,
        'category_products': category_products
    }

    return render(
        request,
        'store/Bags3.html',
        context
    )


def bags4(request):

    all_products = Product.objects.filter(
        stock__gt=0
    )

    category_products = all_products.filter(
        category='bags',
        page=4
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

    context = {
        'products': products_data,
        'category_products': category_products
    }

    return render(
        request,
        'store/Bags4.html',
        context
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

        if payment_method not in [
            'COD',
            'Online'
        ]:

            payment_method = 'COD'


        is_paid_status = (
            True
            if payment_method == 'Online'
            else False
        )


        # =========================
        # GET CART
        # =========================

        cart_json = request.POST.get(
            'cart_data',
            '[]'
        )


        try:

            cart = json.loads(
                cart_json
            )

        except (
            json.JSONDecodeError,
            TypeError
        ):

            cart = []


        if not isinstance(
            cart,
            list
        ) or not cart:

            return render(
                request,
                'store/checkout.html',
                {
                    'error':
                        'Your cart is empty.'
                }
            )


        # =========================
        # VALIDATE CART
        # =========================

        total_price = 0

        validated_items = []


        for item in cart:

            try:

                product_id = int(
                    item.get('id')
                )

                quantity = int(
                    item.get('quantity')
                )

            except (
                TypeError,
                ValueError
            ):

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


            product = Product.objects.filter(
                id=product_id
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


            # Check real stock

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


            # Use current price
            # (Sale price if product is on sale)

            item_total = (
                product.current_price * quantity
            )

            total_price += item_total


            validated_items.append({

                'product': product,

                'quantity': quantity,

                'price': product.current_price

            })


        # =========================
        # PROMO CODE
        # =========================

        discount_amount = 0


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


            discount_amount = (
                total_price *
                promo.discount_percent
            ) / 100


            total_price = (
                total_price -
                discount_amount
            )


        # =========================
        # CREATE ORDER
        # =========================

        order = Order.objects.create(

            full_name=full_name,

            email=email,

            address=address,

            phone=phone,

            total_price=total_price,

            payment_method=payment_method,

            is_paid=is_paid_status

        )


        # =========================
        # SAVE ORDER ID
        # =========================

        if 'user_orders' not in request.session:

            request.session['user_orders'] = []


        request.session[
            'user_orders'
        ].append(
            order.id
        )

        request.session.modified = True


        # =========================
        # CREATE ORDER ITEMS
        # =========================

        for item in validated_items:

            product = item['product']

            quantity = item['quantity']


            OrderItem.objects.create(

                order=order,

                product=product,

                price=item['price'],

                quantity=quantity

            )


            # Reduce stock

            product.stock -= quantity

            product.save()


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


def order_history(request):

    order_ids = request.session.get(
        'user_orders',
        []
    )


    orders = Order.objects.filter(
        id__in=order_ids
    ).order_by(
        '-created_at'
    )


    context = {
        'orders': orders,
    }


    return render(
        request,
        'store/order_history.html',
        context
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


    return render(

        request,

        'store/product_detail.html',

        {

            'product': product,

            'products': products_data

        }

    )
