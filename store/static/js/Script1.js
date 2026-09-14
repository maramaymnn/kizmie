// ==========================================
// 1. Get Elements
// ==========================================

// Side Menu
const openBtn = document.getElementById('openBtn');
const closeBtn = document.getElementById('closeBtn');
const sideMenu = document.getElementById('sideMenu');
const menuOverlay = document.getElementById('menuOverlay');
const shopAllBtn = document.querySelector('.shop-all-btn');
const categoriesDiv = document.querySelector('.categories');

// Side Cart
const cartBtn = document.getElementById('cartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const sideCart = document.getElementById('sideCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartCountSpan = document.getElementById('cartCount');
const cartTotalSpan = document.getElementById('cartTotal');

// Add To Cart Buttons
const addToCartButtons =
    document.querySelectorAll('.btn-add');

// Cart
let cart =
    JSON.parse(localStorage.getItem('cart')) || [];


// ==========================================
// 2. Side Menu Events
// ==========================================

if (openBtn && closeBtn && sideMenu && menuOverlay) {

    openBtn.addEventListener('click', function () {

        sideMenu.classList.add('active');
        menuOverlay.classList.add('active');

    });


    closeBtn.addEventListener('click', function () {

        sideMenu.classList.remove('active');
        menuOverlay.classList.remove('active');

    });

}


if (shopAllBtn && categoriesDiv) {

    shopAllBtn.addEventListener('click', function () {

        categoriesDiv.classList.toggle('show');
        shopAllBtn.classList.toggle('open');

    });

}


// ==========================================
// 3. Side Cart Events
// ==========================================

if (cartBtn && sideCart && menuOverlay) {

    cartBtn.addEventListener('click', function (e) {

        e.preventDefault();

        sideCart.classList.add('active');
        menuOverlay.classList.add('active');

    });

}


if (closeCartBtn && sideCart && menuOverlay) {

    closeCartBtn.addEventListener('click', function () {

        sideCart.classList.remove('active');
        menuOverlay.classList.remove('active');

    });

}


if (menuOverlay) {

    menuOverlay.addEventListener('click', function () {

        if (sideMenu) {
            sideMenu.classList.remove('active');
        }

        if (sideCart) {
            sideCart.classList.remove('active');
        }

        menuOverlay.classList.remove('active');

    });

}


// ==========================================
// 4. Add Products To Cart
// ==========================================

addToCartButtons.forEach(function (button) {

    button.addEventListener('click', function (e) {

        e.preventDefault();

        const productCard =
            button.closest('.product-card');

        if (!productCard) {
            return;
        }


        const productId =
            productCard.dataset.productId;

        const title =
            productCard.querySelector('h3').innerText;


        // Get sale price if product is on sale
        const salePriceElement =
            productCard.querySelector('.sale-price');

        const priceElement =
            productCard.querySelector('.price');


        const priceText =
            salePriceElement
                ? salePriceElement.innerText
                : priceElement.innerText;


        // Convert "LE 3500" to 3500
        const price =
            parseFloat(
                priceText.replace(/[^0-9.]/g, '')
            );


        const imageElement =
            productCard.querySelector('img');

        const imgSrc =
            imageElement ? imageElement.src : '';


        // Check if product already exists
        const existingProduct =
            cart.find(function (item) {

                return item.id == productId;

            });


        if (existingProduct) {

            existingProduct.quantity += 1;

        } else {

            cart.push({

                id: productId,

                title: title,

                price: price,

                imgSrc: imgSrc,

                quantity: 1

            });

        }


        // Save cart
        localStorage.setItem(
            'cart',
            JSON.stringify(cart)
        );


        // Update cart
        updateCartUI();

    });

});


// ==========================================
// 5. Update Cart UI
// ==========================================

function updateCartUI() {

    if (
        !cartItemsContainer ||
        !cartCountSpan ||
        !cartTotalSpan
    ) {
        return;
    }


    // Number of different products
    cartCountSpan.innerText = cart.length;


    // Change cart count color
    if (cart.length === 0) {

        cartCountSpan.style.backgroundColor =
            '#e63946';

    } else {

        cartCountSpan.style.backgroundColor =
            '#2ec4b6';

    }


    // Empty cart
    if (cart.length === 0) {

        cartItemsContainer.innerHTML =
            '<p class="empty-msg">Your cart is empty.</p>';

        cartTotalSpan.innerText =
            'LE 0.00';

        return;

    }


    cartItemsContainer.innerHTML = '';

    let total = 0;


    // Display products
    cart.forEach(function (item, index) {

        total +=
            item.price * item.quantity;


        cartItemsContainer.innerHTML += `

            <div class="cart-item">

                <img
                    src="${item.imgSrc}"
                    alt="${item.title}"
                >

                <div class="cart-item-info">

                    <h4>
                        ${item.title}
                    </h4>

                    <p>
                        LE ${item.price.toLocaleString(
                            'en-US',
                            {
                                minimumFractionDigits: 2
                            }
                        )}
                    </p>

                </div>


                <div class="quantity-controls">

                    <button
                        onclick="decreaseQuantity(${index})"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="increaseQuantity(${index})"
                    >
                        +
                    </button>

                    <button
                        class="remove-item"
                        onclick="removeItem(${index})"
                    >
                        ×
                    </button>

                </div>

            </div>

        `;

    });


    // Cart total
    cartTotalSpan.innerText =
        `LE ${total.toLocaleString(
            'en-US',
            {
                minimumFractionDigits: 2
            }
        )}`;

}


// Update cart when page loads
updateCartUI();


// ==========================================
// 6. Cart Quantity Functions
// ==========================================

window.removeItem = function (index) {

    cart.splice(index, 1);


    localStorage.setItem(
        'cart',
        JSON.stringify(cart)
    );


    updateCartUI();

};


window.increaseQuantity = function (index) {

    if (!cart[index]) {
        return;
    }


    cart[index].quantity += 1;


    localStorage.setItem(
        'cart',
        JSON.stringify(cart)
    );


    updateCartUI();

};


window.decreaseQuantity = function (index) {

    if (!cart[index]) {
        return;
    }


    if (cart[index].quantity > 1) {

        cart[index].quantity -= 1;

    } else {

        cart.splice(index, 1);

    }


    localStorage.setItem(
        'cart',
        JSON.stringify(cart)
    );


    updateCartUI();

};


// ==========================================
// 7. Search System
// ==========================================

const searchBtn =
    document.getElementById('searchBtn');

const searchBox =
    document.getElementById('searchBox');

const searchInput =
    document.getElementById('searchInput');

const searchResults =
    document.getElementById('searchResults');


if (searchBtn && searchBox) {

    searchBtn.addEventListener('click', function (e) {

        e.preventDefault();

        searchBox.classList.toggle('active');


        if (
            searchBox.classList.contains('active')
        ) {

            searchInput.focus();

        }

    });

}


let allProducts = [];


const productsDataElement =
    document.getElementById('products-data');


if (productsDataElement) {

    try {

        allProducts =
            JSON.parse(
                productsDataElement.textContent
            );

    } catch (e) {

        console.error(
            'Error parsing products data:',
            e
        );

    }

}


if (searchInput && searchResults) {

    searchInput.addEventListener(
        'input',
        function () {

            const searchValue =
                searchInput.value
                    .toLowerCase()
                    .trim();


            searchResults.innerHTML = '';


            if (searchValue === '') {

                return;

            }


            const results =
                allProducts.filter(
                    function (product) {

                        return (
                            product.name &&
                            product.name
                                .toLowerCase()
                                .includes(searchValue)
                        );

                    }
                );


            if (results.length === 0) {

                searchResults.innerHTML =
                    '<p style="padding: 10px; color: #666;">No products found</p>';

                return;

            }


            results.forEach(
                function (product) {

                    const result =
                        document.createElement('a');


                    result.href =
                        `/product/${product.id}/`;


                    result.className =
                        'search-item-link';


                    result.innerHTML = `

                        <div class="search-item">

                            <img
                                src="${product.image_url}"
                                alt="${product.name}"
                            >

                            <div class="search-item-info">

                                <span
                                    class="search-item-title"
                                >
                                    ${product.name}
                                </span>

                                <span
                                    class="search-item-price"
                                >
                                    LE ${product.price}
                                </span>

                            </div>

                        </div>

                    `;


                    searchResults.appendChild(result);

                }
            );

        }
    );

}


// ==========================================
// 8. Checkout Button
// ==========================================

const checkoutBtn =
    document.getElementById('checkoutBtn');


if (checkoutBtn) {

    checkoutBtn.addEventListener(
        'click',
        function (e) {

            e.preventDefault();


            if (cart.length === 0) {

                alert(
                    'Your cart is empty!'
                );

                return;

            }


            window.location.href =
                '/checkout/';

        }
    );

}


// ==========================================
// 9. Checkout Page
// ==========================================

const checkoutItems =
    document.getElementById('checkoutItems');

const checkoutTotal =
    document.getElementById('checkoutTotal');


let checkoutOriginalTotal = 0;


if (checkoutItems && checkoutTotal) {

    checkoutItems.innerHTML = '';

    checkoutOriginalTotal = 0;


    // Empty cart on checkout
    if (cart.length === 0) {

        checkoutItems.innerHTML =
            '<p class="empty-msg">Your cart is empty.</p>';

        checkoutTotal.innerText =
            'LE 0.00';

    } else {

        cart.forEach(function (item) {

            checkoutOriginalTotal +=
                item.price * item.quantity;


            checkoutItems.innerHTML += `

                <div class="checkout-item">

                    <img
                        src="${item.imgSrc}"
                        alt="${item.title}"
                    >

                    <div class="checkout-item-info">

                        <h3>
                            ${item.title}
                        </h3>

                        <p>
                            Quantity: ${item.quantity}
                        </p>

                    </div>


                    <div class="checkout-item-price">

                        LE ${
                            (
                                item.price *
                                item.quantity
                            ).toLocaleString(
                                'en-US',
                                {
                                    minimumFractionDigits: 2
                                }
                            )
                        }

                    </div>

                </div>

            `;

        });


        checkoutTotal.innerText =
            `LE ${checkoutOriginalTotal.toLocaleString(
                'en-US',
                {
                    minimumFractionDigits: 2
                }
            )}`;

    }

}


// ==========================================
// 10. Promo Code
// ==========================================

const applyPromoBtn =
    document.getElementById('applyPromoBtn');

const promoInput =
    document.getElementById('promo_code');

const promoMessage =
    document.getElementById('promoMessage');


if (
    applyPromoBtn &&
    promoInput &&
    promoMessage &&
    checkoutTotal
) {

    applyPromoBtn.addEventListener(
        'click',
        function () {

            const promoCode =
                promoInput.value.trim();


            if (!promoCode) {

                promoMessage.innerText =
                    'Please enter a promo code.';

                return;

            }


            const csrfElement =
                document.querySelector(
                    '[name=csrfmiddlewaretoken]'
                );


            if (!csrfElement) {

                promoMessage.innerText =
                    'CSRF token not found.';

                return;

            }


            const csrfToken =
                csrfElement.value;


            const formData =
                new FormData();


            formData.append(
                'promo_code',
                promoCode
            );


            fetch(
                '/apply-promo/',
                {
                    method: 'POST',

                    headers: {
                        'X-CSRFToken':
                            csrfToken
                    },

                    body: formData
                }
            )

            .then(function (response) {

                return response.json();

            })

            .then(function (data) {

                if (!data.success) {

                    promoMessage.innerText =
                        data.message;


                    checkoutTotal.innerText =
                        `LE ${checkoutOriginalTotal.toLocaleString(
                            'en-US',
                            {
                                minimumFractionDigits: 2
                            }
                        )}`;

                    return;

                }


                const discountAmount =
                    checkoutOriginalTotal *
                    data.discount_percent /
                    100;


                const finalTotal =
                    checkoutOriginalTotal -
                    discountAmount;


                checkoutTotal.innerText =
                    `LE ${finalTotal.toLocaleString(
                        'en-US',
                        {
                            minimumFractionDigits: 2
                        }
                    )}`;


                promoMessage.innerText =
                    `${data.message} You saved LE ${discountAmount.toLocaleString(
                        'en-US',
                        {
                            minimumFractionDigits: 2
                        }
                    )}.`;

            })

            .catch(function (error) {

                console.error(
                    'Promo error:',
                    error
                );


                promoMessage.innerText =
                    'Something went wrong. Please try again.';

            });

        }
    );

}


// ==========================================
// 11. Submit Checkout Form
// ==========================================

const checkoutForm =
    document.getElementById('checkoutForm');


if (checkoutForm) {

    const cartDataInput =
        document.getElementById('cartDataInput');


    checkoutForm.addEventListener(
        'submit',
        function () {

            const currentCart =
                localStorage.getItem('cart') || '[]';


            if (cartDataInput) {

                cartDataInput.value =
                    currentCart;

            }

        }
    );

}