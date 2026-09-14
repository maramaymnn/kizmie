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
        'bags1/',
        views.bags1,
        name='bags1'
    ),

    path(
        'bags2/',
        views.bags2,
        name='bags2'
    ),

    path(
        'bags3/',
        views.bags3,
        name='bags3'
    ),

    path(
        'bags4/',
        views.bags4,
        name='bags4'
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

]
