from django.urls import path

from . import views


urlpatterns = [

    path(
        '',
        views.home,
        name='home'
    ),

    path(
        'checkout/',
        views.checkout,
        name='checkout'
    ),

    path(
        'apply-promo/',
        views.apply_promo,
        name='apply_promo'
    ),
    path(
    'bags/',
    views.bags,
    name='bags'
    ),
    path(
        'orders/history/',
        views.order_history,
        name='order_history'
    ),

    path(
        'wallets/',
        views.wallets_view,
        name='wallets'
    ),

    path(
        'belts/',
        views.belts_view,
        name='belts'
    ),

    path(
        'product/<int:product_id>/',
        views.product_detail,
        name='product_detail'
    ),
    path('admin-login/', views.admin_login, name='admin_login'),
    path(
    'admin-logout/',
    views.admin_logout,
    name='admin_logout'
),
path('best-sellers/', views.best_sellers, name='best_sellers'),
path(
    "delivery-price/",
    views.delivery_price,
    name="delivery_price"
),
path('contact/', views.contact, name='contact'),
path('policy/', views.policy, name='policy'),
path(
    'register/',
    views.register,
    name='register'
),

path(
    'login/',
    views.user_login,
    name='login'
),

path(
    'logout/',
    views.user_logout,
    name='logout'
),
]
