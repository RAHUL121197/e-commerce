let productObj = {};
let cart = JSON.parse(localStorage.getItem("cartItem")) || [];

const productImage = document.getElementById("product-image");
const productTitle = document.getElementById("product-title");
const productPrice = document.getElementById("product-price");
const productDescription = document.getElementById("product-description");
const addToCartBtn = document.getElementById("addToCartBtn");
const cartcount = document.getElementById("cart-count");

const params = new URLSearchParams(window.location.search);
const productId = params.get("id"); // FIXED

async function loadSingleProduct() {
    if (!productId) return;

    try {
        const res = await fetch(`https://fakestoreapi.com/products/${productId}`); // FIXED URL
        const product = await res.json();
        productObj = product; // Store the product for later use

        productImage.src = product.image;
        productTitle.textContent = product.title;
        productPrice.textContent = `$${product.price}`;
        productDescription.textContent = product.description;


    } catch (error) {
        console.error("Error loading product:", error);
    }
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 }); // safer copy
    }

    renderCartItems();
    updateCartCount();
    saveCartToLocalStorage();
}

addToCartBtn.addEventListener("click", () => {
    addToCart(productObj);
});

loadSingleProduct();

updateCartCount();

function goToProductDetails(id) {
    window.location.href = `product.html?id=${id}`; // FIXED
}

window.addEventListener("load", () => {
    let userDetails = JSON.parse(localStorage.getItem('userDetails'));

    if (userDetails && userDetails.username) {
        // loadProducts(); // make sure this function exists
        document.getElementById("register-btn").style.display = "none";
        // document.getElementById('products-search-wrapper').style.display = "block";
        document.getElementById("userNameText").innerText = "WELCOME, " + userDetails.username;
    } else {
        document.getElementById('products').style.display = "none";
    }

    const savedCart = JSON.parse(localStorage.getItem("cartItem"));
    if (savedCart) {
        cart = savedCart;
        updateCartCount();
    }
});

function renderCartItems() {
    const cartItemDiv = document.getElementById("cartItem");
    const totalPriceDiv = document.getElementById("totalPrice");
    cartItemDiv.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {
        cartItemDiv.innerHTML = "<p>Your cart is empty.</p>";
        totalPriceDiv.innerHTML = "<p>Total: ₹0</p>";
        updateCartCount();
        return;
    }
    cart.forEach(item => {
        total += item.price * item.quantity;

        cartItemDiv.innerHTML += ` <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
            <img src="${item.image}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: contain;">

            <div>
            <small>${item?.title?.slice(0, 20)}...</small><br>
            ${item.price}
            </div>

            <div class="d-flex align-items-center gap-2">
            <button class="btn btn-sm btn-outline-secondary" onclick="decreaseQuantity(${item.id})">-</button>
            <span>${item.quantity}</span>
            <button class="btn btn-sm btn-outline-secondary" onclick="increaseQuantity(${item.id})">+</button>
            </div>
            <button class="btn btn-sm btn-danger" onclick="removeItem(${item.id})">Remove</button>
            </div>`;
    });

    totalPriceDiv.innerHTML = `Total: $${total.toFixed(2)}`;
    updateCartCount();
}

function saveCartToLocalStorage() {
    localStorage.setItem("cartItem", JSON.stringify(cart));
}

function increaseQuantity(productId) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity++;
    }
    saveCartToLocalStorage();
    renderCartItems();
    updateCartCount();
}

function decreaseQuantity(productId) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        if (cartItem.quantity == 1) {
            return;
        }
        cartItem.quantity--;


    }
    saveCartToLocalStorage();
    renderCartItems();
    updateCartCount();

}

function removeItem(productId) {
    cart = cart.filter(item => item.id !== productId);

    saveCartToLocalStorage();
    renderCartItems();
    updateCartCount();


}

function updateCartCount() {
    cartcount.textContent = cart.length;
}



const cartIcon = document.getElementById("cart-icon")

cartIcon.addEventListener("click", function () {
    renderCartItems();
    updateCartCount();
    saveCartToLocalStorage();
})

// let currentProduct = allProducts;

// addToCartBtn.addEventListener("click", () => {
//             if(currentProduct){
//                 addToCart(currentProduct);
//                 updateCartCount();
//                 renderCartItem();
//             }
// })
