// ১. লোডিং স্পিনার কন্ট্রোল
const manageSpinner = (status) => {
    const spinner = document.getElementById("spinner");
    if (status) {
        spinner.classList.remove("hidden");
    } else {
        spinner.classList.add("hidden");
    }
};

// ২. সব ক্যাটাগরি লোড করা (Async/Await)
const loadCategories = async () => {
    try {
        const res = await fetch("https://fakestoreapi.com/products/categories");
        const data = await res.json();
        displayCategories(data);
    } catch (err) {
        console.error("Categories লোড করতে সমস্যা হয়েছে:", err);
    }
};

// ৩. ক্যাটাগরি বাটনগুলো ডিসপ্লে করা
const displayCategories = (categories) => {
    const categoryContainer = document.getElementById("category-container");
    categoryContainer.innerHTML = "";

    // "All Products" বাটন তৈরি
    const allBtn = document.createElement("button");
    allBtn.className = "btn btn-outline border-purple-700 text-purple-700 rounded-full px-6 category-btn capitalize hover:bg-purple-700 hover:text-white bg-purple-700 text-white"; // Default Active
    allBtn.innerText = "All Products";
    allBtn.onclick = (e) => {
        updateActiveBtn(e.target);
        loadProducts("all");
    };
    categoryContainer.append(allBtn);

    categories.forEach(category => {
        const btn = document.createElement("button");
        btn.className = "btn btn-outline border-gray-300 text-gray-600 rounded-full px-6 category-btn capitalize hover:bg-purple-700 hover:text-white";
        btn.innerText = category;
        btn.onclick = (e) => {
            updateActiveBtn(e.target);
            loadProducts(category);
        };
        categoryContainer.append(btn);
    });
};

// ৪. ক্যাটাগরি বাটন একটিভ স্টেট ম্যানেজ করা
const updateActiveBtn = (clickedBtn) => {
    const allBtns = document.querySelectorAll(".category-btn");
    allBtns.forEach(btn => {
        btn.classList.remove("bg-purple-700", "text-white", "border-purple-700");
        btn.classList.add("border-gray-300", "text-gray-600");
    });
    clickedBtn.classList.remove("border-gray-300", "text-gray-600");
    clickedBtn.classList.add("bg-purple-700", "text-white", "border-purple-700");
};

// ৫. প্রোডাক্ট লোড করা (Async/Await)
const loadProducts = async (category) => {
    manageSpinner(true);
    const productContainer = document.getElementById("product-container");
    productContainer.innerHTML = ""; 

    let url = "https://fakestoreapi.com/products";
    if (category !== "all") {
        url = `https://fakestoreapi.com/products/category/${category}`;
    }

    try {
        const res = await fetch(url);
        const data = await res.json();
        displayProducts(data);
    } catch (err) {
        console.error("Products লোড করতে সমস্যা হয়েছে:", err);
    } finally {
        manageSpinner(false);
    }
};

// ৬. প্রোডাক্ট কার্ডগুলো ডিসপ্লে করা
const displayProducts = (products) => {
    const productContainer = document.getElementById("product-container");
    
    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "group border border-gray-100 rounded-3xl p-4 hover:shadow-2xl transition-all bg-white flex flex-col";
        card.innerHTML = `
            <div class="bg-gray-50 rounded-2xl h-64 overflow-hidden relative p-8">
                <img src="${product.image}" class="w-full h-full object-contain group-hover:scale-110 transition duration-500" alt="${product.title}">
                <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-purple-700 border border-purple-100 shadow-sm">
                    ⭐ ${product.rating.rate}
                </div>
            </div>
            <div class="mt-4 px-2 flex-grow flex flex-col">
                <h3 class="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-purple-700 transition" title="${product.title}">${product.title}</h3>
                <div class="flex items-center gap-2 mt-1">
                    <span class="badge badge-ghost text-[10px] uppercase font-bold text-gray-500">${product.category}</span>
                </div>
                
                <div class="mt-auto pt-4">
                    <div class="flex justify-between items-center mb-4">
                        <span class="text-2xl font-black text-gray-900">$${product.price}</span>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <button onclick="loadProductDetail(${product.id})" class="btn btn-sm btn-outline border-purple-700 text-black  hover:bg-purple-700 hover:border-purple-700 rounded-lg">
                            Details
                        </button>
                        <button class="btn btn-sm bg-purple-700 text-white border-none rounded-lg hover:bg-black">
                            <i class="fa-solid fa-cart-plus mr-1"></i> Add
                        </button>
                    </div>
                </div>
            </div>
        `;
        productContainer.append(card);
    });
};

// ৭. সিঙ্গেল প্রোডাক্ট ডিটেইল লোড করা (Async/Await)
const loadProductDetail = async (id) => {
    try {
        const url = `https://fakestoreapi.com/products/${id}`;
        const res = await fetch(url);
        const data = await res.json();
        displayProductDetail(data);
    } catch (err) {
        console.error("Detail লোড করতে সমস্যা হয়েছে:", err);
    }
};

// ৮. মডাল কন্টেন্ট দেখানো
const displayProductDetail = (product) => {
    const container = document.getElementById("modal-content-container");
    container.innerHTML = `
        <div class="flex flex-col md:flex-row gap-8 items-center p-2">
            <div class="w-full md:w-1/2 bg-gray-50 rounded-3xl p-6">
                <img src="${product.image}" class="w-full h-64 object-contain mx-auto" />
            </div>
            <div class="w-full md:w-1/2 space-y-4">
                <h2 class="text-2xl font-black text-gray-900 leading-tight">${product.title}</h2>
                <div class="flex gap-2 items-center">
                    <span class="badge bg-purple-100 text-purple-700 border-none font-bold py-3 uppercase text-xs">${product.category}</span>
                    <span class="text-orange-500 font-bold text-sm">⭐ ${product.rating.rate} (${product.rating.count} reviews)</span>
                </div>
                <p class="text-gray-600 text-sm leading-relaxed">${product.description}</p>
                <div class="pt-4 flex items-center justify-between">
                    <span class="text-3xl font-black text-purple-700">$${product.price}</span>
                    <button class="btn bg-purple-700 text-white border-none px-8 rounded-xl hover:bg-black">Buy Now</button>
                </div>
            </div>
        </div>
    `;
    document.getElementById("product_modal").showModal();
};

// ইনিশিয়ালি ডেটা লোড করা
loadCategories();
loadProducts("all");