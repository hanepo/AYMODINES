/**
 * =================================================================
 * AYMODINES Restaurant - Core Application JavaScript
 * =================================================================
 * This file contains all the shared logic for the website including:
 * - Header and Footer injection for consistent UI.
 * - Complete shopping cart state management (add, remove, update).
 * - Rendering the cart panel.
 * - Handling all user interactions for the cart and navigation.
 * =================================================================
 */

// --- SHARED STATE & HELPERS ---

/**
 * Retrieves the cart from localStorage.
 * @returns {Array} The cart array.
 */
const getCart = () => JSON.parse(localStorage.getItem('cart')) || [];

/**
 * Saves the cart to localStorage and dispatches an event.
 * @param {Array} cart - The cart array to save.
 */
const saveCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
    // Dispatch a custom event so any page can react to cart changes.
    window.dispatchEvent(new CustomEvent('cartUpdated'));
};


// --- DYNAMIC CONTENT INJECTION ---

const HEADER_HTML = `
    <nav class="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="index.html" class="flex items-center gap-3 text-3xl font-serif-display font-bold text-[var(--main-green)]">
            <img src="assets/logorestaurant.PNG" alt="AYMODINES Logo" class="h-12 w-auto">
            <span>AYMODINES</span>
        </a>
        
        <div class="hidden md:flex items-center space-x-8">
            <a href="index.html" class="flex items-center gap-2 text-gray-600 hover:text-[var(--main-green)] font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                <span>Home</span>
            </a>
            <a href="about.html" class="flex items-center gap-2 text-gray-600 hover:text-[var(--main-green)] font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>
                <span>About</span>
            </a>
            <a href="menu.html" class="flex items-center gap-2 text-gray-600 hover:text-[var(--main-green)] font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" /></svg>
                <span>Menu</span>
            </a>
            <a href="rewards.html" class="flex items-center gap-2 text-gray-600 hover:text-[var(--main-green)] font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>
                <span>Rewards</span>
            </a>
            <a href="contact.html" class="flex items-center gap-2 text-gray-600 hover:text-[var(--main-green)] font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>Contact</span>
            </a>
        </div>

        <div class="flex items-center space-x-5">
            <button id="cart-btn" class="relative text-gray-600 hover:text-[var(--main-green)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                <span id="cart-count" class="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">0</span>
            </button>
         
            <div class="md:hidden">
                <button id="mobile-menu-btn" class="text-gray-600 hover:text-[var(--main-green)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                </button>
            </div>
        </div>
    </nav>
    <div id="mobile-menu" class="hidden md:hidden bg-white border-t">
        <a href="index.html" class="block py-2 px-6 text-sm text-gray-600 hover:bg-green-50">Home</a>
        <a href="about.html" class="block py-2 px-6 text-sm text-gray-600 hover:bg-green-50">About</a>
        <a href="menu.html" class="block py-2 px-6 text-sm text-gray-600 hover:bg-green-50">Menu</a>
        <a href="rewards.html" class="block py-2 px-6 text-sm text-gray-600 hover:bg-green-50">Rewards</a>
    </div>
`;

const FOOTER_HTML = `
    <div class="container mx-auto text-center">
        <p>&copy; ${new Date().getFullYear()} AYMODINES. All Rights Reserved.</p>
    </div>
`;

/**
 * Loads the header and footer into the page and attaches their event listeners.
 */
function loadHeaderAndFooter() {
    const header = document.getElementById('header-placeholder');
    const footer = document.getElementById('footer-placeholder');

    if (header) {
        header.classList.add('fixed', 'top-0', 'left-0', 'right-0', 'z-50', 'transition-all', 'duration-300', 'bg-white/80', 'backdrop-blur-sm', 'shadow-md');
        header.innerHTML = HEADER_HTML;

        // Attach event listeners after header is loaded
        document.getElementById('mobile-menu-btn').addEventListener('click', () => {
            document.getElementById('mobile-menu').classList.toggle('hidden');
        });
    }

    if (footer) {
        footer.classList.add('bg-gray-800', 'text-white', 'py-8', 'mt-auto');
        footer.innerHTML = FOOTER_HTML;
    }
}


// --- CART LOGIC ---

/**
 * Adds an item to the cart or increments its quantity.
 * @param {object} item - The full item object to add.
 */
const addToCart = (item) => {
    if (!item || !item.id) {
        console.error("Invalid item added to cart:", item);
        return;
    }
    let cart = getCart();
    const existingItem = cart.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    saveCart(cart);
};

/**
 * Updates the quantity of an item in the cart.
 * @param {number} itemId - The ID of the item to update.
 * @param {number} change - The change in quantity (+1 or -1).
 */
const updateCartQuantity = (itemId, change) => {
    let cart = getCart();
    const item = cart.find(i => i.id === itemId);

    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            // If quantity drops to 0 or less, remove the item
            cart = cart.filter(i => i.id !== itemId);
        }
    }
    saveCart(cart);
}

/**
 * Removes an item completely from the cart.
 * @param {number} itemId - The ID of the item to remove.
 */
const removeFromCart = (itemId) => {
    let cart = getCart();
    cart = cart.filter(i => i.id !== itemId);
    saveCart(cart);
}

/**
 * Renders the entire cart UI into the cart panel.
 */
const renderCart = () => {
    const cartPanel = document.getElementById('cart-panel');
    const cartCount = document.getElementById('cart-count');
    const cart = getCart();

    // Update the cart icon count in the header
    if (cartCount) {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
    
    if (!cartPanel) return; // Do nothing if the cart panel isn't on the page

    if (cart.length === 0) {
        cartPanel.innerHTML = `
            <div class="flex justify-between items-center p-6 border-b">
                <h2 class="text-2xl font-semibold">Your Cart</h2>
                <button class="close-cart-btn text-gray-500 text-3xl hover:text-gray-800">&times;</button>
            </div>
            <div class="p-6 text-center text-gray-500 flex flex-col items-center justify-center h-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-gray-300 mb-4"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                <p>Your cart is empty.</p>
            </div>`;
    } else {
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartPanel.innerHTML = `
            <div class="flex flex-col h-full">
                <div class="flex justify-between items-center p-6 border-b bg-gray-50">
                    <h2 class="text-2xl font-semibold">Your Cart</h2>
                    <button class="close-cart-btn text-gray-500 text-3xl hover:text-gray-800">&times;</button>
                </div>
                <div class="flex-grow p-6 overflow-y-auto">
                    ${cart.map(item => `
                        <div class="flex items-center space-x-4 mb-4">
                            <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-md object-cover bg-gray-100" onerror="this.src='https://placehold.co/64x64/eee/ccc?text=Item'">
                            <div class="flex-grow">
                                <h3 class="font-semibold">${item.name}</h3>
                                <p class="text-sm text-gray-500">RM ${item.price.toFixed(2)}</p>
                            </div>
                            <div class="flex items-center gap-2">
                                <button data-id="${item.id}" class="decrease-qty-btn bg-gray-200 w-7 h-7 rounded-full font-bold hover:bg-gray-300">-</button>
                                <span class="font-semibold w-6 text-center">${item.quantity}</span>
                                <button data-id="${item.id}" class="increase-qty-btn bg-gray-200 w-7 h-7 rounded-full font-bold hover:bg-gray-300">+</button>
                            </div>
                            <button data-id="${item.id}" class="remove-item-btn text-red-400 hover:text-red-600 text-2xl font-bold">&times;</button>
                        </div>`).join('')}
                </div>
                <div class="p-6 border-t bg-gray-50">
                    <div class="flex justify-between mb-4"><p>Subtotal</p><p class="font-semibold text-lg">RM ${subtotal.toFixed(2)}</p></div>
                    <a href="checkout.html" class="block text-center w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700">Go to Checkout</a>
                </div>
            </div>`;
    }
};


// --- GLOBAL EVENT LISTENERS ---

// Open/Close Cart Modal
const openCartModal = () => {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.classList.remove('invisible', 'opacity-0');
        cartModal.querySelector('#cart-panel').classList.remove('translate-x-full');
    }
};
const closeCartModal = () => {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.querySelector('#cart-panel').classList.add('translate-x-full');
        // Add a delay to allow the slide-out animation to finish
        setTimeout(() => cartModal.classList.add('invisible', 'opacity-0'), 300);
    }
};

// Listen for the custom event to re-render the cart on any page
window.addEventListener('cartUpdated', renderCart);

// Delegated Event Listener for all dynamic actions
document.addEventListener('click', (e) => {
    const target = e.target;
    const itemId = parseInt(target.dataset.id);

    // --- Cart UI Actions ---
    if (target.closest('#cart-btn')) {
        openCartModal();
    }
    if (target.matches('.close-cart-btn') || target.closest('.close-cart-btn') || e.target.id === 'cart-modal') {
        closeCartModal();
    }
    
    // --- Cart Item Actions ---
    if (target.matches('.increase-qty-btn')) {
        updateCartQuantity(itemId, 1);
    }
    if (target.matches('.decrease-qty-btn')) {
        updateCartQuantity(itemId, -1);
    }
    if (target.matches('.remove-item-btn')) {
        removeFromCart(itemId);
    }

    // --- Add to Cart (from Menu page) ---
    if (target.matches('.add-to-cart-btn')) {
        const itemCard = target.closest('[data-item]');
        if (itemCard) {
            try {
                const itemData = JSON.parse(itemCard.dataset.item);
                addToCart(itemData);
                // Optional: Show a brief confirmation
                target.textContent = 'Added!';
                setTimeout(() => { target.textContent = 'Add to Cart'; }, 1000);
            } catch (err) {
                console.error("Could not parse item data from element:", err);
            }
        }
    }
});

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    loadHeaderAndFooter();
    renderCart(); // Initial render for cart count and panel if present
});