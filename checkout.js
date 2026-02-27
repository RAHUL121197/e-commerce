let cart = JSON.parse(localStorage.getItem("cartItem")) || [];
const checkoutItems=document.getElementById("checkout-items");
const totalAmount=document.getElementById("checkout-total");
const cartcount = document.getElementById('cart-count');




// function displayProducts(products) {
//     productsDiv.innerHTML ="";
//     message.textContent = "";

//     if (products.length === 0) {
//         message.textContent = "No Products Found";
//         return;
//     }
//     let productHTML = '';

//     products.forEach(product => {
//         productHTML += `
//                 <div class="product-card">
//                     <div id="productinfo"  onclick="openwindos(${product.id})">
//                         <img src="${product.image}" alt="${product.title}" class="product-image" />
//                         <h3 class="product-name">${product.title}</h3>
//                         <p class="product-price">$${product.price}</p>
//                     </div>
//                     <button onclick="addToCart(${product.id}) "class="add-to-cart-btn">Add to Cart</button>
//                 </div>
//             `;

//     });
//     document.getElementById('products').innerHTML = productHTML;
// }
function registerUser(event) {
    event.preventDefault();

    let name = document.getElementById("username").value;

    document.getElementById("userNameText").innerHTML =
        "WELCOME, " + name;

    document.querySelector("#register-btn").style.display = "none";

    closeModal();
}
function closeModal() {
    document.getElementById("registerModal").style.display = "none";
}



function displaycheckoutItems(){
    checkoutItems.innerHTML="";
    if(cart.length===0){
        checkoutItems.innerHTML="<p>Your cart is empty.</p>";
        totalAmount.textContent= "0";
        return;
    }

    let html="";
    let total=0;

    cart.forEach(item=>{
        total+=item.price*item.quantity;
        html+=`<div class="checkout-item">
                    <img src="${item.image}" alt="${item.title}" class="checkout-image">
                    <div class="checkout-details">
                    
                    <h5>${item.title}</h5>
                    <p>Price: ₹${item.price}</p>
                    <p>Quantity: ${item.quantity}</p>
                    </div>
                </div>`;
    });

    checkoutItems.innerHTML=html;
    totalAmount.textContent=total.toFixed(2);
}

function calculateTotal(){

    const total =cart.reduce((acc,item)=>{
        return acc+(item.price*item.quantity);
    },0);

    totalAmount.textContent=total;
}
//    displayProducts();
   
   
   document.getElementById("checkout-form").addEventListener("submit",function(e){
    e.preventDefault();

    const fullName=document.getElementById("fullname").value.trim();
    const address=document.getElementById("address").value.trim();
    const city=document.getElementById("city").value.trim();
    const state=document.getElementById("state").value.trim();
    const zip=document.getElementById("zip").value.trim();
    const country=document.getElementById("country").value.trim();
    const phone=document.getElementById("phone").value.trim();

    if(!fullName || !address||!city|| !state || !zip || !country || !phone){
        alert("Please fill All Fields");
        return;
    }
    
    if(zip.length!==6 || isNaN(zip)){
        alert("Enter valid 6-digit zip number");
        return;
    }

    if(phone.length!==10 || isNaN(phone)){
        alert("Enter valid 10-digit phone number");
        return;
    }

    alert("Oder Placed Successfull");

    localStorage.removeItem("cartItem")

    window.location.href="index.html";
    
   });

   displaycheckoutItems();


window.addEventListener("load", () => {
    let userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails && userDetails.username) {
        // Load products only after login
        // loadProducts();
        // Show welcome + products
        document.getElementById("register-btn").style.display = "none";
        // document.getElementById('products-search-wrapper').style.display = "block";
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

function updateCartCount() {
    cartcount.textContent = cart.length;
}






function removeItem(productId) {
    cart = cart.filter(item => item.id !== productId);

    saveCartToLocalStorage();
    renderCartItems();
    updateCartCount();


}