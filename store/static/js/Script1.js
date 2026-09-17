// ==========================================
// 1. GET ELEMENTS
// ==========================================

// ---------- Side Menu ----------
const openBtn = document.getElementById('openBtn');
const closeBtn = document.getElementById('closeBtn');
const sideMenu = document.getElementById('sideMenu');
const menuOverlay = document.getElementById('menuOverlay');
const shopAllBtn = document.querySelector('.shop-all-btn');
const categoriesDiv = document.querySelector('.categories');

// ---------- Side Cart ----------
const cartBtn = document.getElementById('cartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const sideCart = document.getElementById('sideCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartCountSpan = document.getElementById('cartCount');
const cartTotalSpan = document.getElementById('cartTotal');

// ---------- Add To Cart ----------
const addToCartButtons =
    document.querySelectorAll('.btn-add');

// ---------- Cart ----------
let cart =
    JSON.parse(localStorage.getItem('cart')) || [];
const standardDeliveryPrice =
    document.getElementById('deliveryPrice');

// ==========================================
// 2. CART HELPERS
// ==========================================

function getProductQuantity(productId) {

    const product = cart.find(function (item) {

        return String(item.id) === String(productId);

    });

    return product ? product.quantity : 0;
}


function updateProductButtons() {

    const buttons =
        document.querySelectorAll('.btn-add');

    buttons.forEach(function (button) {

        let productId;

        const productCard =
            button.closest('.product-card');

        if (productCard) {

            productId =
                productCard.dataset.productId;

        } else {

            productId =
                button.dataset.productId;

        }

        if (!productId) {
            return;
        }

        const quantity =
            getProductQuantity(productId);

        if (quantity > 0) {

            button.textContent =
                `${quantity} in cart`;

        } else {

            button.textContent =
                'Add to cart';

        }

    });

}

// ==========================================
// 3. SIDE MENU EVENTS
// ==========================================

if (openBtn && sideMenu && menuOverlay) {

    openBtn.addEventListener('click', function () {
        sideMenu.classList.add('active');
        menuOverlay.classList.add('active');
    });

}


if (closeBtn && sideMenu && menuOverlay) {

    closeBtn.addEventListener('click', function () {
        sideMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
    });

}


if (menuOverlay && sideMenu) {

    menuOverlay.addEventListener('click', function () {
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
// 4. SIDE CART EVENTS
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
// 5. ADD PRODUCTS TO CART
// ==========================================

addToCartButtons.forEach(function (button) {

    button.addEventListener('click', function (e) {

        e.preventDefault();

        const productCard =
            button.closest('.product-card');

        let productId;
        let title;
        let price;
        let imgSrc;

        let variantId = null;
        let variantColor = '';


        // ------------------------------------------
        // PRODUCT CARD
        // ------------------------------------------

        if (productCard) {

            productId =
                productCard.dataset.productId;

            const titleElement =
                productCard.querySelector('h3');

            title =
                titleElement
                    ? titleElement.innerText.trim()
                    : '';


            const salePriceElement =
                productCard.querySelector('.sale-price');

            const priceElement =
                productCard.querySelector('.price');

            const priceText =
                salePriceElement
                    ? salePriceElement.innerText
                    : priceElement
                        ? priceElement.innerText
                        : '';

            price =
                parseFloat(
                    priceText.replace(/[^0-9.]/g, '')
                );


            const imageElement =
                productCard.querySelector('img');

            imgSrc =
                imageElement
                    ? imageElement.src
                    : '';

        }


        // ------------------------------------------
        // PRODUCT DETAIL PAGE
        // ------------------------------------------

        else {

            productId =
                button.dataset.productId;


            const productPage =
                document.querySelector(
                    '.product-detail-page'
                );


            if (!productPage) {
                return;
            }


            const titleElement =
                productPage.querySelector('h1');

            title =
                titleElement
                    ? titleElement.innerText.trim()
                    : '';


            // ------------------------------------------
            // DEFAULT PRODUCT PRICE
            // ------------------------------------------

            const salePriceElement =
                productPage.querySelector(
                    '.product-detail-price .sale-price'
                );

            const regularPriceElement =
                productPage.querySelector(
                    '.product-detail-price .regular-price'
                );

            const priceElement =
                productPage.querySelector(
                    '.product-detail-price'
                );


            const priceText =
                salePriceElement
                    ? salePriceElement.innerText
                    : regularPriceElement
                        ? regularPriceElement.innerText
                        : priceElement
                            ? priceElement.innerText
                            : '';


            price =
                parseFloat(
                    priceText.replace(/[^0-9.]/g, '')
                );


            // ------------------------------------------
            // GET VARIANTS
            // ------------------------------------------

            const variantsDataElement =
                document.getElementById(
                    'variants-data'
                );


            let variantsData = [];


            if (variantsDataElement) {

                try {

                    variantsData =
                        JSON.parse(
                            variantsDataElement.textContent
                        );

                } catch (error) {

                    console.error(
                        'Error parsing variants data:',
                        error
                    );

                }

            }


            // ------------------------------------------
            // SELECTED COLOR
            // ------------------------------------------

            const colorSelect =
                document.getElementById(
                    'colorSelect'
                );


            const selectedColor =
                colorSelect
                    ? colorSelect.value
                    : '';


            // ------------------------------------------
            // FIND SELECTED VARIANT
            // ------------------------------------------

            let selectedVariant = null;


            if (
                selectedColor &&
                variantsData.length > 0
            ) {

                selectedVariant =
                    variantsData.find(
                        function (variant) {

                            return (
                                variant.color ===
                                selectedColor
                            );

                        }
                    );

            }


            // ------------------------------------------
            // REQUIRE COLOR IF VARIANTS EXIST
            // ------------------------------------------

            if (
                variantsData.length > 0 &&
                !selectedVariant
            ) {

                alert(
                    'Please choose a color first.'
                );

                return;

            }


            // ------------------------------------------
            // VARIANT DATA
            // ------------------------------------------

            if (selectedVariant) {

                variantId =
                    selectedVariant.id;

                variantColor =
                    selectedVariant.color;


                    // Variant price


                    if (

                        selectedVariant.is_on_sale &&

                        selectedVariant.sale_price !== null &&

                        selectedVariant.sale_price !== ''

                    ) {


                        price =

                        Number(

                            selectedVariant.sale_price

                        );


                    } else if (

                        selectedVariant.price !== null &&

                        selectedVariant.price !== ''

                    ) {


                        price =

                        Number(

                            selectedVariant.price

                        );


                    }


                // Variant image
                if (
                    selectedVariant.image_url
                ) {

                    imgSrc =
                        selectedVariant.image_url;

                }


                // Variant stock
                if (
                    Number(selectedVariant.stock) <= 0
                ) {

                    alert(
                        'This color is out of stock.'
                    );

                    return;

                }

            }


            // ------------------------------------------
            // DEFAULT PRODUCT IMAGE
            // ------------------------------------------

            if (!imgSrc) {

                const imageElement =
                    productPage.querySelector(
                        '.product-detail-image img'
                    );


                imgSrc =
                    imageElement
                        ? imageElement.src
                        : '';

            }

        }


        // ------------------------------------------
        // CHECK PRODUCT DATA
        // ------------------------------------------

        if (
            !productId ||
            !title ||
            isNaN(price)
        ) {

            return;

        }


        // ------------------------------------------
        // CHECK EXISTING PRODUCT
        // SAME PRODUCT + SAME COLOR
        // ------------------------------------------

        const existingProduct =
            cart.find(function (item) {

                return (
                    String(item.id) ===
                    String(productId) &&

                    String(item.variantId || '') ===
                    String(variantId || '')
                );

            });


        // ------------------------------------------
        // UPDATE QUANTITY
        // ------------------------------------------

        if (existingProduct) {

            existingProduct.quantity += 1;

        } else {

            cart.push({

                id: productId,

                variantId: variantId,

                color: variantColor,

                title: title,

                price: price,

                imgSrc: imgSrc,

                quantity: 1

            });

        }


        // ------------------------------------------
        // SAVE CART
        // ------------------------------------------

        localStorage.setItem(
            'cart',
            JSON.stringify(cart)
        );


        // ------------------------------------------
        // UPDATE CART
        // ------------------------------------------

        updateCartUI();
        updateProductButtons();

    });

});


// ==========================================
// 6. UPDATE CART UI
// ==========================================

function updateCartUI() {

    if (
        !cartItemsContainer ||
        !cartCountSpan ||
        !cartTotalSpan
    ) {

        return;

    }


    let totalQuantity = 0;


    cart.forEach(function (item) {

        totalQuantity += item.quantity;

    });


    // ---------- Cart Count ----------

    if (totalQuantity > 0) {

        cartCountSpan.innerText =
            totalQuantity;

        cartCountSpan.style.display =
            'flex';

    } else {

        cartCountSpan.innerText =
            '';

        cartCountSpan.style.display =
            'none';

    }


    // ---------- Empty Cart ----------

    if (cart.length === 0) {

        cartItemsContainer.innerHTML =
            '<p class="empty-msg">Your cart is empty.</p>';

        cartTotalSpan.innerText =
            'LE 0.00';

        return;

    }


    cartItemsContainer.innerHTML = '';

    let total = 0;


    // ---------- Display Products ----------

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


                ${

                    item.color

                    ? `

                    <p class="cart-item-color">

                    Color: ${item.color}

                    </p>

                    `

                    : ''

                }


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


    // ---------- Cart Total ----------

    cartTotalSpan.innerText =
        `LE ${total.toLocaleString(
            'en-US',
            {
                minimumFractionDigits: 2
            }
        )}`;

}


// ==========================================
// 7. CART LOAD / REFRESH
// ==========================================

updateCartUI();
updateProductButtons();


window.addEventListener(
    'pageshow',
    function () {

        cart =
            JSON.parse(
                localStorage.getItem('cart')
            ) || [];

        updateCartUI();
        updateProductButtons();

    }
);


// ==========================================
// 8. CART QUANTITY FUNCTIONS
// ==========================================

window.removeItem = function (index) {

    cart.splice(index, 1);


    localStorage.setItem(
        'cart',
        JSON.stringify(cart)
    );


    updateCartUI();
    updateProductButtons();

};
window.increaseQuantity = function (index) {

    if (!cart[index]) {
        return;
    }


    const item = cart[index];

    let maxStock = null;


    // ==========================================
    // VARIANT STOCK
    // ==========================================

    if (item.variantId) {

        const variantsElement =
            document.getElementById('variants-data');


        if (variantsElement) {

            try {

                const variants =
                    JSON.parse(
                        variantsElement.textContent
                    );


                const variant =
                    variants.find(
                        function (variant) {

                            return String(variant.id) ===
                                String(item.variantId);

                        }
                    );


                if (!variant) {

                    alert(
                        'This color is no longer available.'
                    );

                    return;

                }


                maxStock =
                    Number(variant.stock);


            } catch (error) {

                console.error(
                    'Error parsing variant data:',
                    error
                );

                return;

            }

        }

    }


    // ==========================================
    // PRODUCT STOCK
    // ==========================================

    else {

        const product =
            allProducts.find(
                function (product) {

                    return String(product.id) ===
                        String(item.id);

                }
            );


        if (product) {

            maxStock =
                Number(product.stock);

        }

    }


    // ==========================================
    // CHECK STOCK
    // ==========================================

    if (
        maxStock !== null &&
        item.quantity >= maxStock
    ) {

        alert(
            'You cannot add more than the available stock.'
        );

        return;

    }


    // ==========================================
    // INCREASE
    // ==========================================

    item.quantity += 1;


    localStorage.setItem(
        'cart',
        JSON.stringify(cart)
    );


    updateCartUI();
    updateProductButtons();

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
    updateProductButtons();

};
// ==========================================
// 9. SEARCH SYSTEM
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

    searchBtn.addEventListener(
        'click',
        function (e) {

            e.preventDefault();

            searchBox.classList.toggle('active');


            if (
                searchBox.classList.contains('active') &&
                searchInput
            ) {

                searchInput.focus();

            }

        }
    );

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
// 10. CHECKOUT BUTTON
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
// 11. CHECKOUT ELEMENTS
// ==========================================

const checkoutItems =
    document.getElementById('checkoutItems');

const checkoutSubtotal =
    document.getElementById('checkoutSubtotal');

const checkoutShipping =
    document.getElementById('checkoutShipping');

const checkoutDiscount =
    document.getElementById('checkoutDiscount');

const checkoutTotal =
    document.getElementById('checkoutTotal');

const governorateSelect =
    document.getElementById('governorate');

const cityInput =
    document.getElementById('city');


// ==========================================
// 12. CHECKOUT VARIABLES
// ==========================================

let checkoutOriginalTotal = 0;

let shippingCost = 0;

let discountAmount = 0;


// ==========================================
// 13. DISPLAY CHECKOUT PRODUCTS
// ==========================================

if (checkoutItems) {

    checkoutItems.innerHTML = '';

    checkoutOriginalTotal = 0;


    if (cart.length === 0) {

        checkoutItems.innerHTML =
            '<p class="empty-msg">Your cart is empty.</p>';


        if (checkoutSubtotal) {

            checkoutSubtotal.innerText =
                'LE 0.00';

        }


        if (checkoutShipping) {

            checkoutShipping.innerText =
                'LE 0.00';

        }


        if (checkoutTotal) {

            checkoutTotal.innerText =
                'LE 0.00';

        }

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


        updateCheckoutTotal();

    }

}


// ==========================================
// 14. UPDATE CHECKOUT TOTAL
// ==========================================
function updateCheckoutTotal() {

    const finalTotal =
        checkoutOriginalTotal +
        shippingCost -
        discountAmount;


    if (checkoutSubtotal) {

        checkoutSubtotal.innerText =
            `LE ${checkoutOriginalTotal.toLocaleString(
                'en-US',
                {
                    minimumFractionDigits: 2
                }
            )}`;

    }


    // Update Standard Delivery price
    if (standardDeliveryPrice) {

        standardDeliveryPrice.innerText =
            `LE ${shippingCost.toLocaleString(
                'en-US',
                {
                    minimumFractionDigits: 2
                }
            )}`;

    }


    // Update Order Summary shipping
    if (checkoutShipping) {

        checkoutShipping.innerText =
            `LE ${shippingCost.toLocaleString(
                'en-US',
                {
                    minimumFractionDigits: 2
                }
            )}`;

    }


    if (checkoutDiscount) {

        checkoutDiscount.innerText =
            `— LE ${discountAmount.toLocaleString(
                'en-US',
                {
                    minimumFractionDigits: 2
                }
            )}`;

    }


    if (checkoutTotal) {

        checkoutTotal.innerText =
            `LE ${Math.max(
                finalTotal,
                0
            ).toLocaleString(
                'en-US',
                {
                    minimumFractionDigits: 2
                }
            )}`;

    }

}
// ==========================================
// 15. GET DELIVERY PRICE
// ==========================================

function getDeliveryPrice(governorate) {

    if (!governorate) {

        shippingCost = 0;

        updateCheckoutTotal();

        return;

    }

    fetch(
        `/delivery-price/?governorate=${encodeURIComponent(
            governorate
        )}`
    )

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    'Delivery price request failed.'
                );

            }

            return response.json();

        })

        .then(function (data) {

            if (data.success) {

                shippingCost =
                    Number(data.delivery_price) || 0;

            } else {

                shippingCost = 0;

            }

            updateCheckoutTotal();

        })

        .catch(function (error) {

            console.error(
                'Delivery price error:',
                error
            );

            shippingCost = 0;

            updateCheckoutTotal();

        });

}

// ==========================================
// 16. GOVERNORATE
// ==========================================

const egyptGovernorates = [
    "Cairo",
    "Giza",
    "Alexandria",
    "Dakahlia",
    "Sharqia",
    "Gharbia",
    "Monufia",
    "Qalyubia",
    "Beheira",
    "Kafr El Sheikh",
    "Damietta",
    "Port Said",
    "Ismailia",
    "Suez",
    "Fayoum",
    "Beni Suef",
    "Minya",
    "Assiut",
    "Sohag",
    "Qena",
    "Luxor",
    "Aswan",
    "Red Sea",
    "New Valley",
    "Matrouh",
    "North Sinai",
    "South Sinai"
];


// Add governorates to dropdown

if (governorateSelect) {

    egyptGovernorates.forEach(function (governorate) {

        const option =
            document.createElement('option');

        option.value =
            governorate;

        option.textContent =
            governorate;

        governorateSelect.appendChild(option);

    });

}


// Governorate change

if (governorateSelect) {

    governorateSelect.addEventListener(
        'change',
        function () {

            const selectedGovernorate =
                governorateSelect.value;

            getDeliveryPrice(
                selectedGovernorate
            );

        }
    );

}


// ==========================================
// 17. STANDARD DELIVERY
// ==========================================

// Shipping method is Standard Delivery only.
// The actual price comes from Django Admin
// according to the selected governorate.

const shippingMethodInput =
    document.querySelector(
        'input[name="shipping_method"]'
    );


if (shippingMethodInput) {

    shippingMethodInput.value =
        'Standard Delivery';

}


// ==========================================
// 18. PROMO CODE
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

                        discountAmount = 0;

                        promoMessage.innerText =
                            data.message;

                        updateCheckoutTotal();

                        return;

                    }


                    // IMPORTANT:
                    // Update the global variable.
                    // Do NOT use "const" here.

                    discountAmount =
                        checkoutOriginalTotal *
                        Number(data.discount_percent) /
                        100;


                    updateCheckoutTotal();


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
// 19. SUBMIT CHECKOUT FORM
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
                localStorage.getItem('cart') ||
                '[]';


            if (cartDataInput) {

                cartDataInput.value =
                    currentCart;

            }

        }
    );

}
// ==========================================
// 21. PRODUCT VARIANT
// COLOR → IMAGE + PRICE + SALE + STOCK
// ==========================================

const variantsDataElement =
    document.getElementById('variants-data');

const colorSelect =
    document.getElementById('colorSelect');

const productDetailImage =
    document.querySelector(
        '.product-detail-image img'
    );

const productPrice =
    document.getElementById('productPrice');

const productStock =
    document.getElementById('productStock');

const productDetailAdd =
    document.getElementById('productDetailAdd');


let variantsData = [];


// ==========================================
// ORIGINAL PRODUCT DATA
// ==========================================

const originalProductImage =
    productDetailImage
        ? productDetailImage.src
        : '';

const originalProductPriceHTML =
    productPrice
        ? productPrice.innerHTML
        : '';


// ==========================================
// GET VARIANTS
// ==========================================

if (variantsDataElement) {

    try {

        variantsData =
            JSON.parse(
                variantsDataElement.textContent
            );

    } catch (error) {

        console.error(
            'Error parsing variants data:',
            error
        );

    }

}


// ==========================================
// COLOR CHANGE
// ==========================================

if (colorSelect) {

    colorSelect.addEventListener(
        'change',
        function () {

            const selectedColor =
                colorSelect.value;


            // ======================================
            // RESET
            // ======================================

            if (!selectedColor) {

                if (productDetailImage) {

                    productDetailImage.src =
                        originalProductImage;

                }


                if (productPrice) {

                    productPrice.innerHTML =
                        originalProductPriceHTML;

                }


                // Check if ANY variant is available
                const hasAvailableVariant =
                    variantsData.some(
                        function (variant) {

                            return (
                                Number(
                                    variant.stock
                                ) > 0
                            );

                        }
                    );


                if (productStock) {

                    if (hasAvailableVariant) {

                        productStock.innerText =
                            'Choose a color';

                        productStock.classList.remove(
                            'out'
                        );

                    } else {

                        productStock.innerText =
                            'OUT OF STOCK';

                        productStock.classList.add(
                            'out'
                        );

                    }

                }


                if (productDetailAdd) {

                    productDetailAdd.disabled =
                        true;

                    if (hasAvailableVariant) {

                        productDetailAdd.innerText =
                            'Choose a Color';

                    } else {

                        productDetailAdd.innerText =
                            'Out of Stock';

                    }

                }

                return;

            }


            // ======================================
            // FIND VARIANT
            // ======================================

            const selectedVariant =
                variantsData.find(
                    function (variant) {

                        return (
                            variant.color ===
                            selectedColor
                        );

                    }
                );


            if (!selectedVariant) {

                return;

            }


            // ======================================
            // CHANGE IMAGE
            // ======================================

            if (
                selectedVariant.image_url &&
                productDetailImage
            ) {

                productDetailImage.src =
                    selectedVariant.image_url;

            }


            // ======================================
            // CHANGE PRICE
            // ======================================

            if (
                productPrice &&
                selectedVariant.price !== null &&
                selectedVariant.price !== ''
            ) {

                const regularPrice =
                    Number(
                        selectedVariant.price
                    );


                const salePrice =
                    selectedVariant.sale_price !== null &&
                    selectedVariant.sale_price !== ''
                        ? Number(
                            selectedVariant.sale_price
                        )
                        : null;


                if (
                    selectedVariant.is_on_sale &&
                    salePrice !== null
                ) {

                    productPrice.innerHTML = `
                        <span class="old-price">
                            LE ${regularPrice.toLocaleString(
                                'en-US',
                                {
                                    minimumFractionDigits: 2
                                }
                            )}
                        </span>

                        <span class="sale-price">
                            LE ${salePrice.toLocaleString(
                                'en-US',
                                {
                                    minimumFractionDigits: 2
                                }
                            )}
                        </span>
                    `;

                } else {

                    productPrice.innerHTML = `
                        <span class="regular-price">
                            LE ${regularPrice.toLocaleString(
                                'en-US',
                                {
                                    minimumFractionDigits: 2
                                }
                            )}
                        </span>
                    `;

                }

            }


            // ======================================
            // CHECK VARIANT STOCK
            // ======================================

            const variantStock =
                Number(
                    selectedVariant.stock
                );


            if (variantStock <= 0) {

                // OUT OF STOCK

                if (productStock) {

                    productStock.innerText =
                        'OUT OF STOCK';

                    productStock.classList.add(
                        'out'
                    );

                }


                if (productDetailAdd) {

                    productDetailAdd.disabled =
                        true;

                    productDetailAdd.innerText =
                        'Out of Stock';

                }

            } else {

                // IN STOCK

                if (productStock) {

                    productStock.innerText =
                        'In stock';

                    productStock.classList.remove(
                        'out'
                    );

                }


                if (productDetailAdd) {

                    productDetailAdd.disabled =
                        false;

                    productDetailAdd.innerText =
                        'Add to cart';

                }

            }

        }
    );

}
// ==========================================
// 20. FINAL INITIALIZATION
// ==========================================

updateCartUI();
updateProductButtons();
updateCheckoutTotal();
