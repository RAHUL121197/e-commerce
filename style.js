
let productsDiv = document.getElementById('products');


let allproducts = [];
function openModal() {
    document.getElementById("registerModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("registerModal").style.display = "none";
}

function registerUser(event) {
    event.preventDefault();

    let name = document.getElementById("username").value;

    document.getElementById("userNameText").innerHTML =
        "WELCOME, " + name;

    document.querySelector("#register-btn").style.display = "none";

    closeModal();
}

// Close modal when clicking outside
window.onclick = function (event) {
    let modal = document.getElementById("registerModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

function validateForm(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const phone = document.getElementById('phone').value.trim();

    const usernameError = document.getElementById('usernameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');

    UserNamePAtten = /^[a-zA-Z0-9]+$/
    EmailPAtten = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    PhonePAtten = /^\d{10}$/;
    PasswordPAtten = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    let valid = true;

    if (username === "") {
        usernameError.style.color = "red";
        usernameError.innerText = "Username is required.";
        valid = false;
    } else if (!UserNamePAtten.test(username)) {
        usernameError.style.color = "red";
        usernameError.innerText = "Username must be at least 5 characters long and can contain letters, numbers, and underscores.";
        valid = false;
    }
    else {
        usernameError.innerText = "";
    }


    if (!email.includes('@')) {
        emailError.style.color = "red";
        emailError.innerText = "Please enter a valid email address.";
        valid = false;
    } else if (!EmailPAtten.test(email)) {
        emailError.style.color = "red";
        emailError.innerText = "Please enter a valid email address.";
        valid = false;
    } else {
        emailError.innerText = "";
    }

    if (phone.length !== 10 || isNaN(phone)) {
        phoneError.style.color = "red";
        phoneError.innerText = "Please enter a valid 10-digit phone number.";
        valid = false;
    } else if (!PhonePAtten.test(phone)) {
        phoneError.style.color = "red";
        phoneError.innerText = "Please enter a valid 10-digit phone number.";
        valid = false;
    } else {
        phoneError.innerText = "";
    }

    if (password === "") {
        passwordError.style.color = "red";
        passwordError.innerText = "Password is required.";
        valid = false;

    } else if (!PasswordPAtten.test(password)) {
        passwordError.style.color = "red";
        passwordError.innerText = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).";
        valid = false;
    } else {
        passwordError.innerText = "";
    }

    if (confirmPassword === "") {
        confirmPasswordError.style.color = "red";
        confirmPasswordError.innerText = "Confirm Password is required.";
        valid = false;
        return false;
    }
    else if (!PasswordPAtten.test(confirmPassword)) {
        confirmPasswordError.style.color = "red";
        confirmPasswordError.innerText = "Confirm Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).";
        valid = false;
    } else {
        confirmPasswordError.innerText = "";
    }

    if (password !== confirmPassword) {
        passwordError.style.color = "red";
        passwordError.innerText = "Passwords do not match.";
        valid = false;
        return false;
    } else if (PasswordPAtten.test(password) && PasswordPAtten.test(confirmPassword)) {
        passwordError.innerText = "";
    }


    if (!valid) {
        return false;
    }



    const userDetails = {
        firstName,
        lastName,
        username,
        email,
        phone,
        password
    };

    console.log(userDetails);

    localStorage.setItem('userDetails', JSON.stringify(userDetails));


    // window.location.href = "index.html";
    return false;
}
function loadProducts() {
    fetch("https://fakestoreapi.com/products?limit=20")
        .then(response => response.json())
        .then(products => {
            allproducts = products;
            displayProducts(allproducts)
        }
        ).catch(error => {
            console.error('Error fetching products:', error)
        });
}

function displayProducts(products) {
    productsDiv.innerHTML = "";
    message.textContent = "";

    if (products.length === 0) {
        message.textContent = "No Products Found";
        return;
    }
    let productHTML = '';

    products.forEach(product => {
        productHTML += `
                <div class="product-card">
                    <div id="productinfo"  onclick="openwindos(${product.id})">
                        <img src="${product.image}" alt="${product.title}" class="product-image" />
                        <h3 class="product-name">${product.title}</h3>
                        <p class="product-price">$${product.price}</p>
                    </div>
                    <button onclick="addToCart(${product.id}) "class="add-to-cart-btn">Add to Cart</button>
                </div>
            `;

    });
    document.getElementById('products').innerHTML = productHTML;
}

const box = document.getElementById("productinfo");

function openwindos(id) {
    const url = `product/product.html?id=${id}`;
    window.open(url, `_blank`)

}

let cart = [];

const cartcount = document.getElementById('cart-count');

function addToCart(productId) {
    const product = allproducts.find(product => product.id === productId);
    if (!product) return;

    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        })

        renderCartItems();
        updateCartCount();
    }

}


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


function saveCartToLocalStorage() {
    localStorage.setItem("cartItem", JSON.stringify(cart));

}


let message = document.getElementById('message');
let searchInput = document.getElementById('searchInput');

searchInput.addEventListener("keyup", () => {
    const searchText = searchInput.value.toLowerCase();

    const filterProducts = allproducts.filter(product => product.title.toLowerCase().includes(searchText));
    displayProducts(filterProducts);
})



function sortProducts() {
    const sortValue = document.getElementById("sortSelect").value;

    let sortedProducts = [...allproducts]; // Copy the array

    if (sortValue === "price-asc") {
        sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortValue === "price-desc") {
        sortedProducts.sort((a, b) => b.price - a.price);
    } else if (sortValue === "name-asc") {
        sortedProducts.sort((a, b) => {
            const nameA = a.title.toLowerCase();
            const nameB = b.title.toLowerCase();
            return nameA.localeCompare(nameB);
        });
    }

    displayProducts(sortedProducts);
}

function checkout(){
    window.location.href="checkout.html";
}


window.addEventListener("load", () => {
    let userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails && userDetails.username) {
        // Load products only after login
        loadProducts();
        // Show welcome + products
        document.getElementById("register-btn").style.display = "none";
        document.getElementById('products-search-wrapper').style.display = "block";
        document.getElementById("userNameText").innerText = "WELCOME, " + userDetails.username;
    } else {
        // Hide products section until login
        document.getElementById('products').style.display = "none";
        // document.getElementById('cart-count').innerText = 0;
    }

    const savedCart = JSON.parse(localStorage.getItem("cartItem"));
    if (savedCart) {
        cart = savedCart;
        renderCartItems();
    }
});
