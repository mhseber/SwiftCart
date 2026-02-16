// ১. গ্লোবাল স্টেট
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ২. লোডিং স্পিনার কন্ট্রোল
const manageSpinner = (status) => {
    const spinner = document.getElementById("spinner");
    if (status) {
        spinner.classList.remove("hidden");
    } else {
        spinner.classList.add("hidden");
    }
};

// ৩. নেভবার কার্ট কাউন্ট আপডেট

const updateCartCount = () => {
    const cartCountElements = document.querySelectorAll(".cart-count"); // নেভবারে একটি ব্যাজ যোগ করতে হবে
    cartCountElements.forEach(el => el.innerText = cart.length);
    localStorage.setItem("cart", JSON.stringify(cart));
};

// ৪. ক্যাটাগরি লোড করা
const loadCategories = async () => {
    try {
        const res = await fetch("https://fakestoreapi.com/products/categories");
        const data = await res.json();
        displayCategories(data);
    } catch (err) {
        console.error("Categories error:", err);
    }
};

// ৫. ক্যাটাগরি বাটন ডিসপ্লে ও একটিভ স্টেট
const displayCategories = (categories) => {
    const categoryContainer = document.getElementById("category-container");
    categoryContainer.innerHTML = "";

    const createBtn = (name, isActive = false) => {
        const btn = document.createElement("button");
        btn.className = `btn btn-outline rounded-full px-6 category-btn capitalize transition-all ${isActive ? 'bg-purple-700 text-white border-purple-700' : 'border-gray-300 text-gray-600 hover:bg-purple-700 hover:text-white'}`;
        btn.innerText = name === "all" ? "All Products" : name;
        btn.onclick = (e) => {
            document.querySelectorAll(".category-btn").forEach(b => {
                b.classList.remove("bg-purple-700", "text-white", "border-purple-700");
                b.classList.add("border-gray-300", "text-gray-600");
            });
            btn.classList.add("bg-purple-700", "text-white", "border-purple-700");
            loadProducts(name);
        };
        return btn;
    };

    categoryContainer.append(createBtn("all", true));
    categories.forEach(cat => categoryContainer.append(createBtn(cat)));
};

// ৬. প্রোডাক্ট লোড করা
const loadProducts = async (category) => {
    manageSpinner(true);
    const productContainer = document.getElementById("product-container");
    productContainer.innerHTML = ""; 

    let url = category === "all" ? "https://fakestoreapi.com/products" : `https://fakestoreapi.com/products/category/${category}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        displayProducts(data);
    } catch (err) {
        console.error("Products error:", err);
    } finally {
        manageSpinner(false);
    }
};

// ৭. প্রোডাক্ট কার্ড ডিসপ্লে
const displayProducts = (products) => {
    const productContainer = document.getElementById("product-container");
    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "group border border-gray-100 rounded-3xl p-4 hover:shadow-2xl transition-all bg-white flex flex-col";
        card.innerHTML = `
            <div class="bg-gray-50 rounded-2xl h-64 overflow-hidden relative p-8">
                <img src="${product.image}" class="w-full h-full object-contain group-hover:scale-110 transition duration-500">
                <div class="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-purple-700 border border-purple-100 italic">
                    ⭐ ${product.rating.rate}
                </div>
            </div>
            <div class="mt-4 px-2 flex-grow flex flex-col">
                <h3 class="text-lg font-bold text-gray-800 line-clamp-1">${product.title}</h3>
                <p class="text-gray-400 text-xs mt-1 capitalize">${product.category}</p>
                <div class="mt-auto pt-4 flex flex-col gap-3">
                    <span class="text-2xl font-black text-gray-900">$${product.price}</span>
                    <div class="grid grid-cols-2 gap-2">
                        <button onclick="loadProductDetail(${product.id})" class="btn btn-sm btn-outline border-purple-700 text-purple-700 rounded-lg">Details</button>
                        <button onclick="addToCart(${product.id}, '${product.title.replace(/'/g, "\\'")}', ${product.price}, '${product.image}')" class="btn btn-sm bg-purple-700 text-white border-none rounded-lg hover:bg-black">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
        productContainer.append(card);
    });
};

// ৮. কার্টে প্রোডাক্ট যোগ করা (Updated with SweetAlert)

const addToCart = (id, title, price, image) => {
    const item = { id, title, price, image };
    cart.push(item);
    updateCartCount();
    displayCartItems(); // ড্রয়ারের লিস্ট সাথে সাথে আপডেট করবে

    // SweetAlert2 Toast
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
    });

    Toast.fire({
        icon: 'success',
        title: 'Product added to cart!'
    });
};

// ৯. সিঙ্গেল প্রোডাক্ট ডিটেইল লোড করা

const loadProductDetail = async (id) => {
    try {
        const res = await fetch(`https://fakestoreapi.com/products/${id}`);
        const data = await res.json();
        displayProductDetail(data);
    } catch (err) { console.error(err); }
};

// ১০. মডাল কন্টেন্ট দেখানো

const displayProductDetail = (product) => {
    const container = document.getElementById("modal-content-container");
    container.innerHTML = `
        <div class="flex flex-col md:flex-row gap-8 items-center p-2">
            <div class="w-full md:w-1/2 bg-gray-50 rounded-3xl p-6">
                <img src="${product.image}" class="w-full h-64 object-contain mx-auto" />
            </div>
            <div class="w-full md:w-1/2 space-y-4 text-left">
                <h2 class="text-2xl font-black text-gray-900">${product.title}</h2>
                <p class="text-gray-600 text-sm leading-relaxed">${product.description}</p>
                <div class="pt-4 flex items-center justify-between">
                    <span class="text-3xl font-black text-purple-700">$${product.price}</span>
                    <button onclick="addToCart(${product.id}, '${product.title.replace(/'/g, "\\'")}', ${product.price}, '${product.image}')" class="btn bg-purple-700 text-white border-none px-8 rounded-xl">Add to Cart</button>
                </div>
            </div>
        </div>
    `;
    document.getElementById("product_modal").showModal();
};

// ১১. কার্ট আইটেম ডিসপ্লে ফাংশন (Fix for Total Calculation)

const displayCartItems = () => {
    const cartItemsContainer = document.getElementById("cart-items");
    const totalElement = document.getElementById("cart-total");
    
    if(!cartItemsContainer) return; // যদি ওই পেজে কার্ট কন্টেইনার না থাকে

    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        const div = document.createElement("div");
        div.className = "flex items-center justify-between gap-3 border-b pb-3 mb-2";
        div.innerHTML = `
            <img src="${item.image}" class="w-12 h-12 object-contain rounded">
            <div class="flex-grow text-left">
                <p class="text-xs font-bold line-clamp-1">${item.title}</p>
                <p class="text-sm text-purple-700 font-black">$${item.price}</p>
            </div>
            <button onclick="removeFromCart(${index})" class="text-red-400 hover:text-red-600 transition p-2">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        `;
        cartItemsContainer.append(div);
    });

    totalElement.innerText = `$${total.toFixed(2)}`;
};

const removeFromCart = (index) => {
    cart.splice(index, 1);
    updateCartCount();
    displayCartItems(); // রিমুভ করার পর লিস্ট আপডেট
};

// ১২. চেকআউট হ্যান্ডলার
const handleCheckout = () => {
    // যদি কার্ট খালি থাকে তবে চেকআউট করতে দিবে না
    if (cart.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Oops...',
            text: 'Your cart is empty!',
        });
        return;
    }

    // ১. SweetAlert দিয়ে সাকসেস মেসেজ দেখানো
    
    Swal.fire({
        title: 'Successful Purchase!',
        text: 'Thank you for shopping with SwiftCart. Your products are on the way!',
        icon: 'success',
        confirmButtonColor: '#7e22ce', // purple-700 color
        confirmButtonText: 'Great!'
    });

    // ২. কার্ট অ্যারে খালি করা
    cart = [];
    
    // ৩. নেভবার এবং ড্রয়ারের ডাটা আপডেট করা
    updateCartCount();
    displayCartItems();

    // ৪. ড্রয়ার বন্ধ করা (Checkbox টি আনচেক করে দিলে ড্রয়ার চলে যায়)
    const drawerToggle = document.getElementById("cart-drawer");
    if (drawerToggle) {
        drawerToggle.checked = false;
    }
};

// ইনিশিয়াল কল

loadCategories();
loadProducts("all");
updateCartCount();