document.addEventListener('DOMContentLoaded', () => {
    const productsGrid = document.getElementById('products-grid');
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCartBtn = document.querySelector('.close-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartQuantity = document.querySelector('.cart-quantity');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const searchInput = document.getElementById('search-input');

    // Load cart from localStorage or start empty
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let allProducts = [];

    // Fetch products and display them
    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            allProducts = products;
            displayProducts(products);
            updateCart(); // Show cart on load
        });

    function displayProducts(products) {
        productsGrid.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div>
                    <h3>${product.name}</h3>
                    <p>$${product.price.toFixed(2)}</p>
                </div>
                <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
            `;
            productsGrid.appendChild(productCard);
        });
    }

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        if (searchTerm === '') {
            displayProducts(allProducts);
        } else {
            const filteredProducts = allProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm)
            );
            displayProducts(filteredProducts);
        }
    });

    // Toggle cart sidebar
    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('open');
    });

    closeCartBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });

    // Add to cart
    productsGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        }
    });

    function addToCart(productId) {
        const productToAdd = allProducts.find(p => p.id === productId);
        const existingCartItem = cart.find(item => item.id === productId);

        if (existingCartItem) {
            existingCartItem.quantity++;
        } else {
            cart.push({ ...productToAdd, quantity: 1 });
        }
        saveCart();
        updateCart();
    }

    function updateCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let totalQuantity = 0;

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <span>${item.name} (x${item.quantity})</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            `;
            cartItemsContainer.appendChild(cartItem);
            total += item.price * item.quantity;
            totalQuantity += item.quantity;
        });

        cartTotal.textContent = total.toFixed(2);
        cartQuantity.textContent = totalQuantity;
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    checkoutBtn.addEventListener('click', () => {
        alert('Checkout is not implemented yet.');
        cart = [];
        saveCart();
        updateCart();
        cartSidebar.classList.remove('open');
    });
});
