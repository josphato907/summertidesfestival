/* ================================================================
   SUMMER TIDES FESTIVAL — App Logic
   ================================================================ */

'use strict';

const API_BASE_URL = 'https://nyota-foundation1.onrender.com';

/* ----------------------------------------------------------------
   DATA — Products / Tickets / Merchandise
   ---------------------------------------------------------------- */
const STORE = {
  name: 'SUMMER TIDES FESTIVAL',
  description: "Africa's #1 Beach Festival 🏝️\nOfficial store for Summer Tides Festival",
  phone: '+254 741492515',
  email: 'info@airbeatglobal.com',
  socials: {
    instagram: 'https://www.instagram.com/summertides.fest/',
    twitter: 'https://x.com/summertidesfest',
    youtube: 'https://www.youtube.com/@SUMMERTIDESFESTIVAL',
  },
  country: 'Kenya',
  currency: 'KES',
  currencySymbol: 'Sh',
};

const TERMS_HTML = `
<strong>TERMS &amp; CONDITIONS</strong>
<ul>
  <li><strong>Age Restriction:</strong> This event is strictly 18+. A valid government-issued ID matching the ticket name may be required at entry.</li>
  <li><strong>Right of Admission:</strong> Management reserves the right of admission and may deny entry without refund.</li>
  <li><strong>Ticket Authenticity:</strong> All tickets are uniquely barcoded and scanned on entry.</li>
  <li><strong>Refund Policy:</strong> All ticket sales are final and non-refundable.</li>
  <li><strong>Wristbands:</strong> Wristbands are non-transferable and must be worn at all times.</li>
  <li><strong>Event Conditions:</strong> This is an open-air event and will proceed in safe weather.</li>
  <li><strong>Prohibited Items:</strong> No outside food, drinks, weapons, or illegal substances.</li>
  <li><strong>Conduct &amp; Safety:</strong> Zero tolerance for harassment or misconduct.</li>
  <li><strong>Photography &amp; Media:</strong> You consent to being photographed or recorded.</li>
  <li><strong>Liability:</strong> Attendance is at your own risk.</li>
  <li><strong>Compliance:</strong> Attendance constitutes agreement to these terms.</li>
</ul>`;

const PRODUCTS = [
  {
    id: 1,
    category: 'events',
    type: 'event',
    name: 'Early Bird Ticket — Summer Tides Festival 2026',
    subtitle: 'General Access · Limited Availability',
    price: 2500,
    image: 'images/ticket_early_bird.png',
    description: 'Secure your spot at Africa\'s #1 Beach Festival at the best price. Early Bird tickets give full general access to all festival stages, beach areas and amenities. Valid for the full day.',
    variants: ['Single Entry'],
    badge: 'Early Bird',
    available: true,
    date: 'December 27, 2026',
    location: 'Mombasa, Kenya',
  },
  {
    id: 2,
    category: 'events',
    type: 'event',
    name: 'General Admission — Summer Tides Festival 2026',
    subtitle: 'General Access · Beach Festival',
    price: 3500,
    image: 'images/ticket_regular.png',
    description: 'Join Africa\'s #1 Beach Festival with General Admission access. Enjoy incredible live music, beach vibes, world-class DJs, food vendors and unforgettable experiences at Mombasa\'s most iconic beach.',
    variants: ['Single Entry'],
    badge: 'General',
    available: true,
    date: 'December 27, 2026',
    location: 'Mombasa, Kenya',
  },
  {
    id: 3,
    category: 'events',
    type: 'event',
    name: 'VIP Ticket — Summer Tides Festival 2026',
    subtitle: 'VIP Access · Exclusive Lounge',
    price: 7500,
    image: 'images/ticket_vip.png',
    description: 'Experience Summer Tides Festival like never before with VIP access. Includes exclusive lounge access, priority entry, complimentary welcome drink, premium viewing areas and dedicated VIP facilities.',
    variants: ['Single Entry'],
    badge: 'VIP',
    available: true,
    date: 'December 27, 2026',
    location: 'Mombasa, Kenya',
  },
  {
    id: 4,
    category: 'merchandise',
    type: 'merch',
    name: 'Summer Tides Festival T-Shirt 2026',
    subtitle: 'Official Festival Merch',
    price: 1800,
    image: 'images/merch_tshirt.png',
    description: 'Rock the official Summer Tides Festival 2026 limited-edition t-shirt. Premium quality cotton fabric with the iconic festival logo print. Show off your love for Africa\'s #1 Beach Festival.',
    variants: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    badge: 'Merch',
    available: true,
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'events', label: 'Events & Tickets' },
  { id: 'merchandise', label: 'Merchandise' },
];

/* ----------------------------------------------------------------
   STATE
   ---------------------------------------------------------------- */
const state = {
  cart: [],
  activeCategory: 'all',
  searchOpen: false,
  cartOpen: false,
  productModalOpen: false,
  checkoutOpen: false,
  termsOpen: false,
  selectedProduct: null,
  selectedVariant: null,
  modalQty: 1,
  checkoutStep: 1,
  paymentMethod: 'mpesa',
  checkoutComplete: false,
};

/* ----------------------------------------------------------------
   DOM HELPERS
   ---------------------------------------------------------------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const qs = (parent, sel) => parent.querySelector(sel);
const el = (tag, cls = '', html = '') => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
};

/* ----------------------------------------------------------------
   PROGRESS BAR
   ---------------------------------------------------------------- */
function setProgress(pct) {
  const bar = $('#progress-bar');
  if (!bar) return;
  bar.style.width = pct + '%';
  if (pct >= 100) setTimeout(() => { bar.style.width = '0%'; }, 400);
}

/* ----------------------------------------------------------------
   TOAST NOTIFICATIONS
   ---------------------------------------------------------------- */
function toast(message, type = 'info', duration = 3000) {
  const container = $('#toast-container');
  const icons = {
    success: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
    error: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>`,
    info: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/></svg>`,
  };
  const t = el('div', `toast ${type}`, `${icons[type] || icons.info}<span>${message}</span>`);
  container.appendChild(t);
  setTimeout(() => {
    t.classList.add('removing');
    setTimeout(() => t.remove(), 350);
  }, duration);
}

/* ----------------------------------------------------------------
   CART MANAGEMENT
   ---------------------------------------------------------------- */
function addToCart(product, variant = null, qty = 1) {
  const key = product.id + (variant ? '_' + variant : '');
  const existing = state.cart.find(i => i.key === key);
  if (existing) {
    existing.qty += qty;
  } else {
    state.cart.push({ key, product, variant, qty });
  }
  updateCartBadge();
  renderCartItems();
  toast(`${product.name.split('—')[0].trim()} added to cart`, 'success');
}

function removeFromCart(key) {
  state.cart = state.cart.filter(i => i.key !== key);
  updateCartBadge();
  renderCartItems();
}

function updateQty(key, delta) {
  const item = state.cart.find(i => i.key === key);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  updateCartBadge();
  renderCartItems();
}

function getCartTotal() {
  return state.cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);
}

function getCartCount() {
  return state.cart.reduce((sum, i) => sum + i.qty, 0);
}

function updateCartBadge() {
  const badge = $('#cart-badge');
  const count = getCartCount();
  badge.textContent = count;
  badge.classList.toggle('visible', count > 0);
}

function renderCartItems() {
  const body = $('#cart-body');
  if (!body) return;
  if (state.cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/></svg>
        <h3>Your cart is empty</h3>
        <p>Add tickets or merchandise to get started</p>
      </div>`;
    renderCartFooter();
    return;
  }

  body.innerHTML = state.cart.map(item => `
    <div class="cart-item" data-key="${item.key}">
      <img class="cart-item-img" src="${item.product.image}" alt="${item.product.name}" onerror="this.src='https://placehold.co/70x70/e2e8f0/94a3b8?text=IMG'">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.product.name.split('—')[0].trim()}</div>
        ${item.variant ? `<div class="cart-item-variant">${item.variant}</div>` : ''}
        <div class="cart-item-price">${STORE.currencySymbol} ${(item.product.price * item.qty).toLocaleString()}</div>
      </div>
      <div class="cart-item-controls">
        <div class="qty-controls">
          <button class="qty-btn" onclick="updateQty('${item.key}', -1)">−</button>
          <span class="qty-display">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty('${item.key}', 1)">+</button>
        </div>
        <button class="remove-btn" onclick="removeFromCart('${item.key}')">Remove</button>
      </div>
    </div>`).join('');

  renderCartFooter();
}

function renderCartFooter() {
  const footer = $('#cart-footer');
  if (!footer) return;
  const total = getCartTotal();
  const hasItems = state.cart.length > 0;
  footer.innerHTML = `
    <div class="cart-summary">
      <div class="cart-summary-row">
        <span>Subtotal</span>
        <span>${STORE.currencySymbol} ${total.toLocaleString()}</span>
      </div>
      <div class="cart-summary-row">
        <span>VAT (16%)</span>
        <span>${STORE.currencySymbol} ${Math.round(total * 0.16).toLocaleString()}</span>
      </div>
      <div class="cart-summary-row total">
        <span>Total</span>
        <span>${STORE.currencySymbol} ${Math.round(total * 1.16).toLocaleString()}</span>
      </div>
    </div>
    <button class="btn btn-primary btn-lg btn-full" ${!hasItems ? 'disabled' : ''} onclick="openCheckout()">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
      Proceed to Checkout
    </button>`;
}

/* ----------------------------------------------------------------
   OPEN / CLOSE MODALS
   ---------------------------------------------------------------- */
function openSearch() {
  state.searchOpen = true;
  $('#search-overlay').classList.add('open');
  setTimeout(() => $('#search-input').focus(), 100);
}

function closeSearch() {
  state.searchOpen = false;
  $('#search-overlay').classList.remove('open');
  $('#search-input').value = '';
  renderSearchResults('');
}

function openCart() {
  state.cartOpen = true;
  $('#cart-drawer').classList.add('open');
  $('#drawer-backdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  state.cartOpen = false;
  $('#cart-drawer').classList.remove('open');
  $('#drawer-backdrop').classList.remove('open');
  document.body.style.overflow = '';
}

function openProductModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  state.selectedProduct = product;
  state.selectedVariant = product.variants[0] || null;
  state.modalQty = 1;
  renderProductModal(product);
  state.productModalOpen = true;
  $('#product-modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  state.productModalOpen = false;
  $('#product-modal-overlay').classList.remove('open');
  if (!state.cartOpen && !state.checkoutOpen) document.body.style.overflow = '';
}

function openCheckout() {
  closeCart();
  if (state.cart.length === 0) { toast('Your cart is empty', 'error'); return; }
  state.checkoutStep = 1;
  state.checkoutComplete = false;
  state.paymentMethod = 'mpesa';
  renderCheckoutModal();
  state.checkoutOpen = true;
  $('#checkout-modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  state.checkoutOpen = false;
  $('#checkout-modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function openTerms() {
  $('#terms-modal-overlay').classList.add('open');
  state.termsOpen = true;
}

function closeTerms() {
  $('#terms-modal-overlay').classList.remove('open');
  state.termsOpen = false;
}

/* ----------------------------------------------------------------
   PRODUCT MODAL RENDER
   ---------------------------------------------------------------- */
function renderProductModal(product) {
  const overlay = $('#product-modal-overlay');
  overlay.innerHTML = `
    <div class="product-modal">
      <div class="product-modal-inner">
        <div class="product-modal-img-wrapper">
          <img class="product-modal-img" src="${product.image}" alt="${product.name}" onerror="this.src='https://placehold.co/400x400/e2e8f0/94a3b8?text=IMG'">
          <button class="product-modal-close" onclick="closeProductModal()">✕</button>
        </div>
        <div class="product-modal-content">
          <span class="product-modal-badge ${product.type}">${product.badge}</span>
          <h2 class="product-modal-title">${product.name}</h2>
          ${product.date ? `<p style="font-size:0.8rem;color:var(--text-muted);margin-top:-8px">📅 ${product.date} · 📍 ${product.location}</p>` : ''}
          <div class="product-modal-price">
            <span>${STORE.currencySymbol}</span> ${product.price.toLocaleString()}
          </div>
          <div class="product-modal-divider"></div>
          <p class="product-modal-desc">${product.description}</p>
          ${product.variants.length > 1 ? `
            <div>
              <p class="variant-label">Select ${product.type === 'event' ? 'Ticket Type' : 'Size'}</p>
              <div class="variant-options" id="variant-options">
                ${product.variants.map(v => `
                  <button class="variant-option ${v === state.selectedVariant ? 'selected' : ''}"
                    onclick="selectVariant('${v}')">${v}</button>`).join('')}
              </div>
            </div>` : ''}
          <div class="qty-row">
            <label>Qty</label>
            <div class="qty-stepper">
              <button class="qty-step-btn" onclick="adjustModalQty(-1)">−</button>
              <span class="qty-step-display" id="modal-qty-display">1</span>
              <button class="qty-step-btn" onclick="adjustModalQty(1)">+</button>
            </div>
          </div>
          <button class="btn btn-primary btn-lg btn-full" onclick="addCurrentToCart()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/></svg>
            Add to Cart · ${STORE.currencySymbol} ${(product.price * state.modalQty).toLocaleString()}
          </button>
        </div>
      </div>
    </div>`;
}

function selectVariant(v) {
  state.selectedVariant = v;
  $$('.variant-option').forEach(btn => btn.classList.toggle('selected', btn.textContent === v));
}

function adjustModalQty(delta) {
  state.modalQty = Math.max(1, state.modalQty + delta);
  const display = $('#modal-qty-display');
  if (display) display.textContent = state.modalQty;
  // Update add button price
  const btn = document.querySelector('.product-modal-content .btn-primary');
  if (btn && state.selectedProduct) {
    const total = (state.selectedProduct.price * state.modalQty).toLocaleString();
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/></svg>
      Add to Cart · ${STORE.currencySymbol} ${total}`;
  }
}

function addCurrentToCart() {
  if (!state.selectedProduct) return;
  // Validate variant if needed
  if (state.selectedProduct.variants.length > 1 && !state.selectedVariant) {
    toast('Please select a size/type', 'error');
    return;
  }
  addToCart(state.selectedProduct, state.selectedVariant, state.modalQty);
  closeProductModal();
  openCart();
}

/* ----------------------------------------------------------------
   SEARCH
   ---------------------------------------------------------------- */
function renderSearchResults(query) {
  const container = $('#search-results');
  if (!container) return;
  const q = query.trim().toLowerCase();
  if (!q) {
    container.innerHTML = `<div class="search-empty">Start typing to search for events or products…</div>`;
    return;
  }
  const results = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.subtitle.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  );
  if (results.length === 0) {
    container.innerHTML = `<div class="search-empty">No results found for "<strong>${query}</strong>"</div>`;
    return;
  }
  container.innerHTML = results.map(p => `
    <div class="search-result-item" onclick="closeSearch(); openProductModal(${p.id})">
      <img class="search-result-img" src="${p.image}" alt="${p.name}" onerror="this.src='https://placehold.co/48x48/e2e8f0/94a3b8?text=IMG'">
      <div class="search-result-info">
        <div class="search-result-name">${p.name}</div>
        <div class="search-result-price">${STORE.currencySymbol} ${p.price.toLocaleString()}</div>
      </div>
    </div>`).join('');
}

/* ----------------------------------------------------------------
   PRODUCTS GRID
   ---------------------------------------------------------------- */
function renderSkeletons() {
  const grid = $('#products-grid');
  if (!grid) return;
  grid.innerHTML = Array(4).fill(0).map(() => `
    <div class="skeleton-card">
      <div class="skeleton skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line short"></div>
        <div class="skeleton skeleton-line price"></div>
      </div>
    </div>`).join('');
}

function renderProducts(category = 'all') {
  const grid = $('#products-grid');
  if (!grid) return;
  const filtered = category === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === category);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"/></svg>
        <h3>No items found</h3>
        <p>Try a different category</p>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="product-card slide-up" onclick="openProductModal(${p.id})" id="product-${p.id}">
      <div class="product-card-img-wrapper">
        <img class="product-card-img" src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='https://placehold.co/400x400/e2e8f0/94a3b8?text=IMG'">
        ${p.badge ? `<span class="product-badge ${p.type}">${p.badge}</span>` : ''}
        ${!p.available ? `<span class="product-badge sold-out">Sold Out</span>` : ''}
        <button class="quick-add-btn" onclick="event.stopPropagation(); quickAdd(${p.id})" title="Quick add">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
        </button>
      </div>
      <div class="product-card-body">
        <div class="product-card-name">${p.name}</div>
        <div class="product-card-sub">${p.subtitle}</div>
        <div class="product-card-price">
          <span class="currency">${STORE.currencySymbol}</span>${p.price.toLocaleString()}
        </div>
      </div>
    </div>`).join('');
}

function quickAdd(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  if (product.variants.length > 1) {
    // Need to select variant — open modal
    openProductModal(productId);
    return;
  }
  addToCart(product, product.variants[0] || null, 1);
}

/* ----------------------------------------------------------------
   TABS
   ---------------------------------------------------------------- */
function setActiveCategory(category) {
  state.activeCategory = category;
  $$('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });
  renderSkeletons();
  setTimeout(() => renderProducts(category), 300);
}

/* ----------------------------------------------------------------
   CHECKOUT FLOW
   ---------------------------------------------------------------- */
function renderCheckoutModal() {
  const body = $('#checkout-body');
  if (!body) return;

  if (state.checkoutComplete) {
    body.innerHTML = `
      <div class="success-overlay">
        <div class="success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
        </div>
        <h3 class="success-title">Order Confirmed! 🎉</h3>
        <p class="success-subtitle">Your tickets have been booked. Check your email for confirmation and ticket details. See you at Summer Tides Festival!</p>
        <button class="btn btn-primary btn-lg" onclick="closeCheckout(); state.cart = []; updateCartBadge(); renderCartItems();">
          Done
        </button>
      </div>`;
    return;
  }

  const total = getCartTotal();
  const vat = Math.round(total * 0.16);
  const grand = total + vat;

  const stepHTML = renderCheckoutSteps();

  let stepContent = '';
  if (state.checkoutStep === 1) {
    stepContent = `
      <div class="checkout-order-summary">
        <h3>Order Summary</h3>
        ${state.cart.map(i => `
          <div class="co-item">
            <span>${i.product.name.split('—')[0].trim()} ${i.variant ? `(${i.variant})` : ''} ×${i.qty}</span>
            <span>${STORE.currencySymbol} ${(i.product.price * i.qty).toLocaleString()}</span>
          </div>`).join('')}
        <div class="co-item">
          <span>VAT (16%)</span>
          <span>${STORE.currencySymbol} ${vat.toLocaleString()}</span>
        </div>
        <div class="co-item total">
          <span>Total</span>
          <span>${STORE.currencySymbol} ${grand.toLocaleString()}</span>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label" for="co-name">Full Name <span class="required">*</span></label>
        <input class="form-input" type="text" id="co-name" placeholder="John Doe" autocomplete="name">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="co-email">Email <span class="required">*</span></label>
          <input class="form-input" type="email" id="co-email" placeholder="you@email.com" autocomplete="email">
        </div>
        <div class="form-group">
          <label class="form-label" for="co-phone">Phone <span class="required">*</span></label>
          <input class="form-input" type="tel" id="co-phone" placeholder="+254 700 000 000" autocomplete="tel">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label" for="co-dob">Date of Birth <span class="required">*</span></label>
        <input class="form-input" type="date" id="co-dob" max="${getMaxDob()}">
        <div class="form-error" id="dob-error" style="display:none">You must be 18+ to attend this event</div>
      </div>
      <div class="terms-row" id="terms-checkbox-row">
        <input type="checkbox" id="terms-check">
        <label class="terms-text" for="terms-check">
          I agree to the <a href="#" onclick="event.preventDefault(); openTerms()">Terms & Conditions</a>. 
          This event is strictly 18+. All sales are final and non-refundable.
        </label>
      </div>
      <button class="btn btn-primary btn-lg btn-full" onclick="proceedCheckoutStep1()">
        Continue to Payment
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
      </button>`;
  } else if (state.checkoutStep === 2) {
    stepContent = `
      <p style="font-size:0.875rem;color:var(--text-muted);margin-bottom:20px">Select your preferred payment method</p>
      <div class="payment-options">
        <div class="payment-option ${state.paymentMethod === 'mpesa' ? 'selected' : ''}" onclick="selectPayment('mpesa')">
          <div class="payment-option-radio"></div>
          <div style="width:48px;height:32px;background:#4caf50;border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <span style="color:white;font-size:0.7rem;font-weight:900;letter-spacing:-0.03em">M-PESA</span>
          </div>
          <div class="payment-option-info">
            <div class="payment-option-name">M-Pesa</div>
            <div class="payment-option-desc">Pay via mobile money · Instant confirmation</div>
          </div>
        </div>
        <div class="payment-option ${state.paymentMethod === 'card' ? 'selected' : ''}" onclick="selectPayment('card')">
          <div class="payment-option-radio"></div>
          <div style="width:48px;height:32px;background:linear-gradient(135deg,#1a56db,#6875f5);border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/></svg>
          </div>
          <div class="payment-option-info">
            <div class="payment-option-name">Card</div>
            <div class="payment-option-desc">Visa, Mastercard · Secured by Paystack</div>
          </div>
        </div>
      </div>
      ${state.paymentMethod === 'mpesa' ? `
        <div class="form-group">
          <label class="form-label" for="mpesa-phone">M-Pesa Number <span class="required">*</span></label>
          <input class="form-input" type="tel" id="mpesa-phone" placeholder="0700 000 000" value="${state.checkoutDetails?.phone || ''}">
        </div>
        <div id="mpesa-error" style="display:none;background:#fef2f2;border:1px solid #fca5a5;border-radius:10px;padding:10px 12px;margin-bottom:16px;font-size:0.8rem;color:#b91c1c;font-weight:600"></div>
        <div id="mpesa-status" style="display:none;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:12px 14px;margin-bottom:16px;font-size:0.8rem;color:#15803d"></div>
        <div id="mpesa-info-box" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:12px 14px;margin-bottom:16px;font-size:0.8rem;color:#15803d">
          <strong>How it works:</strong> Enter your Safaricom number above. You will receive a push notification on your phone to confirm the payment of <strong>${STORE.currencySymbol} ${grand.toLocaleString()}</strong>.
        </div>` : `
        <div class="form-row" style="margin-bottom:4px">
          <div class="form-group">
            <label class="form-label" for="card-num">Card Number</label>
            <input class="form-input" type="text" id="card-num" placeholder="1234 5678 9012 3456" maxlength="19">
          </div>
          <div class="form-group">
            <label class="form-label" for="card-exp">Expiry</label>
            <input class="form-input" type="text" id="card-exp" placeholder="MM/YY" maxlength="5">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label" for="card-cvv">CVV</label>
          <input class="form-input" type="text" id="card-cvv" placeholder="123" maxlength="4" style="max-width:100px">
        </div>`}
      <div class="co-item total" style="margin-bottom:16px">
        <span>Amount to Pay</span>
        <span style="color:var(--primary)">${STORE.currencySymbol} ${grand.toLocaleString()}</span>
      </div>
      <button class="btn btn-primary btn-lg btn-full" onclick="submitPayment()">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
        Pay ${STORE.currencySymbol} ${grand.toLocaleString()}
      </button>
      <button class="btn btn-ghost btn-full" style="margin-top:8px" onclick="state.checkoutStep=1;renderCheckoutModal()">← Back</button>`;
  }

  body.innerHTML = `
    ${stepHTML}
    ${stepContent}`;
}

function renderCheckoutSteps() {
  return `
    <div class="checkout-steps">
      <div class="checkout-step-indicator">
        <div class="step-num ${state.checkoutStep >= 1 ? (state.checkoutStep > 1 ? 'done' : 'active') : ''}">1</div>
        <span class="step-label ${state.checkoutStep === 1 ? 'active' : ''}">Details</span>
      </div>
      <div class="step-connector ${state.checkoutStep > 1 ? 'done' : ''}"></div>
      <div class="checkout-step-indicator">
        <div class="step-num ${state.checkoutStep >= 2 ? (state.checkoutStep > 2 ? 'done' : 'active') : ''}">2</div>
        <span class="step-label ${state.checkoutStep === 2 ? 'active' : ''}">Payment</span>
      </div>
    </div>`;
}

function getMaxDob() {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return d.toISOString().split('T')[0];
}

function proceedCheckoutStep1() {
  const name = $('#co-name')?.value.trim();
  const email = $('#co-email')?.value.trim();
  const phone = $('#co-phone')?.value.trim();
  const dob = $('#co-dob')?.value;
  const terms = $('#terms-check')?.checked;

  if (!name) { toast('Please enter your full name', 'error'); $('#co-name')?.focus(); return; }
  if (!email || !email.includes('@')) { toast('Please enter a valid email', 'error'); $('#co-email')?.focus(); return; }
  if (!phone) { toast('Please enter your phone number', 'error'); $('#co-phone')?.focus(); return; }
  if (!dob) { toast('Please enter your date of birth', 'error'); $('#co-dob')?.focus(); return; }

  // Age check
  const birthDate = new Date(dob);
  const ageDiff = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDiff);
  const age = Math.abs(ageDate.getUTCFullYear() - 1970);
  if (age < 18) {
    $('#dob-error').style.display = 'block';
    toast('You must be 18+ to attend this event', 'error');
    return;
  }
  $('#dob-error') && ($('#dob-error').style.display = 'none');

  if (!terms) { toast('Please accept the Terms & Conditions', 'error'); return; }

  // Store details for next step
  state.checkoutDetails = { name, email, phone, dob };
  state.checkoutStep = 2;
  renderCheckoutModal();
}

function selectPayment(method) {
  state.paymentMethod = method;
  renderCheckoutModal();
}

function submitPayment() {
  const total = getCartTotal();
  const vat = Math.round(total * 0.16);
  const grandTotal = total + vat;

  if (state.paymentMethod !== 'mpesa') {
    // Mock card checkout
    const btn = document.querySelector('.checkout-modal .btn-primary');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span class="spin" style="width:20px;height:20px;border:2px solid rgba(255,255,255,0.4);border-top-color:white;border-radius:50%;display:inline-block"></span> Processing…`;
    }
    setProgress(60);
    setTimeout(() => {
      setProgress(100);
      state.checkoutComplete = true;
      state.cart = [];
      updateCartBadge();
      renderCartItems();
      renderCheckoutModal();
    }, 2200);
    return;
  }

  // M-Pesa Live Integration
  const mpesaPhone = document.getElementById('mpesa-phone')?.value?.trim();
  const errorDiv = document.getElementById('mpesa-error');
  const statusDiv = document.getElementById('mpesa-status');
  const infoBox = document.getElementById('mpesa-info-box');

  if (!mpesaPhone) {
    if (errorDiv) {
      errorDiv.textContent = 'M-Pesa number is required';
      errorDiv.style.display = 'block';
    }
    return;
  }

  // Normalize/check phone format
  let cleanPhone = mpesaPhone.replace(/\s/g, '');
  if (!/^(\+?254|0)[17][0-9]{8}$/.test(cleanPhone)) {
    if (errorDiv) {
      errorDiv.textContent = 'Please enter a valid Kenyan phone number (07XXXXXXXX or 01XXXXXXXX)';
      errorDiv.style.display = 'block';
    }
    return;
  }

  if (errorDiv) errorDiv.style.display = 'none';
  if (infoBox) infoBox.style.display = 'none';
  if (statusDiv) {
    statusDiv.innerHTML = `<strong>Sending STK push prompt...</strong> Please check your phone for the M-Pesa prompt.`;
    statusDiv.style.display = 'block';
  }

  const btn = document.querySelector('.checkout-modal .btn-primary');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="spin" style="width:20px;height:20px;border:2px solid rgba(255,255,255,0.4);border-top-color:white;border-radius:50%;display:inline-block"></span> Sending STK Push…`;
  }
  setProgress(30);

  // Normalize phone to 254XXXXXXXXX format for PayHero
  let payheroPhone = cleanPhone.replace(/\D/g, '').replace(/^0/, '254');
  if (!payheroPhone.startsWith('254')) payheroPhone = '254' + payheroPhone;

  const ref = `TKT-${Date.now().toString().slice(-8)}`;

  fetch(`${API_BASE_URL}/api/mpesa/stk-push/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: Math.round(grandTotal),
      phone_number: payheroPhone,
      external_reference: ref,
      description: `Summer Tides Festival Ticket - ${ref}`,
    }),
  })
  .then(async (res) => {
    const data = await res.json();
    // PayHero returns ResponseCode '0' on success, or a non-2xx status
    if (!res.ok || (data.ResponseCode && data.ResponseCode !== '0' && data.ResponseCode !== 0)) {
      throw new Error(data.CustomerMessage || data.ResponseDescription || data.message || 'M-Pesa STK push request failed.');
    }
    
    // Success: Prompt sent to user phone
    setProgress(70);
    if (statusDiv) {
      statusDiv.innerHTML = `
        <style>
          @keyframes stk-pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }
        </style>
        <div style="text-align:center;padding:10px 0">
          <span style="font-size:2.5rem;display:block;margin-bottom:8px;animation:stk-pulse 1.5s infinite">📲</span>
          <strong style="display:block;font-size:0.95rem;margin-bottom:4px;color:#15803d">Check Your Phone!</strong>
          <span style="display:block;color:#4b5563;font-size:0.8rem">An M-Pesa PIN prompt has been sent to <strong>${cleanPhone}</strong>. Enter your PIN to complete the booking.</span>
          <div style="font-size:0.75rem;color:#9ca3af;margin-top:12px;font-style:italic">Completing order in <span id="stk-countdown" style="font-weight:bold;color:#111827">15</span> seconds...</div>
        </div>
      `;
    }
    
    const backBtn = document.querySelector('.checkout-modal .btn-ghost');
    if (backBtn) {
      backBtn.style.display = 'none'; // hide back button to prevent navigation
    }
    if (btn) {
      btn.style.display = 'none'; // hide payment button as we are waiting
    }

    // Countdown and automatically complete the checkout
    let seconds = 15;
    const interval = setInterval(() => {
      seconds--;
      const cdSpan = document.getElementById('stk-countdown');
      if (cdSpan) cdSpan.textContent = seconds;
      if (seconds <= 0) {
        clearInterval(interval);
        setProgress(100);
        state.checkoutComplete = true;
        state.cart = [];
        updateCartBadge();
        renderCartItems();
        renderCheckoutModal();
      }
    }, 1000);
  })
  .catch((err) => {
    console.error('Payment Error:', err);
    setProgress(0);
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg> Pay ${STORE.currencySymbol} ${grandTotal.toLocaleString()}`;
    }
    if (statusDiv) statusDiv.style.display = 'none';
    if (infoBox) infoBox.style.display = 'block';
    if (errorDiv) {
      errorDiv.textContent = err.message || 'Connection error. Please try again.';
      errorDiv.style.display = 'block';
    }
  });
}

/* ----------------------------------------------------------------
   FOOTER CATEGORIES (dynamic)
   ---------------------------------------------------------------- */
function renderFooterCategories() {
  const container = $('#footer-categories');
  if (!container) return;
  const cats = [...new Set(PRODUCTS.map(p => p.type === 'event' ? 'Events & Tickets' : 'Merchandise'))];
  container.innerHTML = cats.map(c => `<li><a href="#" onclick="event.preventDefault(); setActiveCategory(c === 'Events & Tickets' ? 'events' : 'merchandise'); document.getElementById('tabs-section').scrollIntoView({behavior:'smooth'})">${c}</a></li>`).join('');
}

/* ----------------------------------------------------------------
   KEYBOARD & ESCAPE HANDLERS
   ---------------------------------------------------------------- */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (state.termsOpen) { closeTerms(); return; }
    if (state.checkoutOpen) { closeCheckout(); return; }
    if (state.productModalOpen) { closeProductModal(); return; }
    if (state.cartOpen) { closeCart(); return; }
    if (state.searchOpen) { closeSearch(); return; }
  }
  // Shortcut: / to open search
  if (e.key === '/' && !state.searchOpen && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
    e.preventDefault();
    openSearch();
  }
});

/* ----------------------------------------------------------------
   CARD NUMBER FORMATTING
   ---------------------------------------------------------------- */
document.addEventListener('input', (e) => {
  if (e.target.id === 'card-num') {
    let v = e.target.value.replace(/\D/g, '').substring(0, 16);
    v = v.replace(/(.{4})/g, '$1 ').trim();
    e.target.value = v;
  }
  if (e.target.id === 'card-exp') {
    let v = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (v.length > 2) v = v.slice(0,2) + '/' + v.slice(2);
    e.target.value = v;
  }
  if (e.target.id === 'search-input') {
    renderSearchResults(e.target.value);
  }
});

/* ----------------------------------------------------------------
   INTERSECTION OBSERVER — animate cards on scroll
   ---------------------------------------------------------------- */
function observeCards() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.product-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = `opacity 0.4s ease ${i * 0.08}s, transform 0.4s ease ${i * 0.08}s, box-shadow 0.22s, border-color 0.22s`;
    observer.observe(card);
  });
}

/* ----------------------------------------------------------------
   INITIALISE
   ---------------------------------------------------------------- */
window.addEventListener('DOMContentLoaded', () => {
  setProgress(40);

  // Render initial products with skeleton delay
  renderSkeletons();
  setTimeout(() => {
    renderProducts('all');
    setTimeout(observeCards, 100);
    setProgress(100);
  }, 500);

  renderCartItems();
  renderCartFooter();
  renderFooterCategories();

  // Tab events
  $$('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => setActiveCategory(btn.dataset.category));
  });

  // Search overlay close on backdrop click
  $('#search-overlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeSearch();
  });

  // Drawer backdrop
  $('#drawer-backdrop')?.addEventListener('click', closeCart);

  // Checkout overlay close
  $('#checkout-modal-overlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeCheckout();
  });

  // Terms modal close
  $('#terms-modal-overlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeTerms();
  });

  // Product modal close on backdrop click
  $('#product-modal-overlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeProductModal();
  });

  console.log('%c🏝️ Summer Tides Festival Store', 'font-size:18px;font-weight:bold;color:#119DA4');
  console.log('%cAfrica\'s #1 Beach Festival', 'font-size:12px;color:#475569');
});
