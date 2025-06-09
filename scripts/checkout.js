  import { cart, removeFromCart, saveToStorage, updateDeliveryoption } from './cart.js';
  import { products } from '../data/products.js';
  import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

  const deliveryoptions = [
    { id: '1', deliverydays: 7, pricecents: 0 },
    { id: '2', deliverydays: 3, pricecents: 499 },
    { id: '3', deliverydays: 1, pricecents: 999 }
  ];

  function getProductById(productId) {
    return products.find(product => product.id === productId);
  }

  export function updateCartQuantity() {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const element = document.querySelector('.checkout-item-value');
    if (element) {
      element.innerHTML = `${total} items`;
    }
    const cartQuantityEl = document.querySelector('.js-cart-quantity');
    if (cartQuantityEl) {
      cartQuantityEl.innerHTML = total;
    }
  }

  function formatCurrency(priceCents) {
    return (priceCents / 100).toFixed(2);
  }

  function deliveryoptionshtml(product, selectedId) {
    let html = '<div class="delivery-options"><div class="delivery-options-title">Choose a delivery option:</div>';

    deliveryoptions.forEach((option) => {
      const deliveryDate = dayjs().add(option.deliverydays, 'days');
      const dateString = deliveryDate.format('dddd, MMMM D');
      const priceString = option.pricecents === 0 ? 'Free' : `$${formatCurrency(option.pricecents)}`;
      const checked = option.id === selectedId ? 'checked' : '';

      html += `
        <div class="delivery-option js-delivery-option"
          data-product-id="${product.id}"
          data-delivery-option-id="${option.id}">
          <input
            type="radio"
            class="delivery-option-input"
            name="delivery-${product.id}"
            value="${option.id}"
            ${checked}>
          <div>
            <div class="delivery-option-date">${dateString}</div>
            <div class="delivery-option-price">${priceString} Shipping</div>
          </div>
        </div>
      `;
    });

    html += '</div>';
    return html;
  }

  export function renderCartItems() {
    const container = document.querySelector('.order-summary');
    if (!container) return;
    container.innerHTML = '';

    cart.forEach(cartItem => {
      const product = getProductById(cartItem.productId);
      if (!product) return;

      const selectedOption = deliveryoptions.find(opt => opt.id === cartItem.deliveryoptionsid) || deliveryoptions[0];
      const deliveryDate = dayjs().add(selectedOption.deliverydays, 'days').format('dddd, MMMM D');

      container.innerHTML += `
        <div class="cart-item-container js-cart-item-container-${product.id}">
          <div class="delivery-date">Delivery date: ${deliveryDate}</div>
          <div class="cart-item-details-grid">
            <img class="product-image" src="${product.image}">
            <div class="cart-item-details">
              <div class="product-name">${product.name}</div>
              <div class="product-price">$${(product.priceCents / 100).toFixed(2)}</div>
              <div class="product-quantity">
                <span>Quantity: <span class="quantity-label">${cartItem.quantity}</span></span>
                <span class="update-quantity-link link-primary">Update</span>
                <span class="delete-quantity-link js-delete link-primary" data-product-id="${product.id}">Delete</span>
              </div>
            </div>
            ${deliveryoptionshtml(product, cartItem.deliveryoptionsid)}
          </div>
        </div>
      `;
    });

    
    document.querySelectorAll('.js-delete').forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);
        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        if (container) container.remove();
        updateCartQuantity();
        renderCartItems();  
        renderpayment();
      });
    });

    
    document.querySelectorAll('.delivery-option-input').forEach((input) => {
      input.addEventListener('change', () => {
        const productId = input.name.split('delivery-')[1];
        const deliveryOptionId = input.value;

        updateDeliveryoption(productId, deliveryOptionId);
        renderCartItems();  
        updateCartQuantity();
        renderpayment();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderCartItems();
    updateCartQuantity();
    renderpayment();
  });
  export function renderpayment() {
  let itemsPriceCents = 0;
  let shippingCents = 0;

  cart.forEach((cartItem) => {
    const product = products.find(product => product.id === cartItem.productId);
    if (product) {
      itemsPriceCents += product.priceCents * cartItem.quantity;

      const selectedOption = deliveryoptions.find(opt => opt.id === cartItem.deliveryoptionsid) || deliveryoptions[0];
      shippingCents += selectedOption.pricecents;
    }
  });

  const itemsTotal = (itemsPriceCents / 100).toFixed(2);
  const shipping = (shippingCents / 100).toFixed(2);
  const totalBeforeTax = (itemsPriceCents + shippingCents) / 100;
  const tax = (totalBeforeTax * 0.10).toFixed(2);
  const orderTotal = (totalBeforeTax + parseFloat(tax)).toFixed(2);

  const paymenthtml = `
    <div class="payment-summary-row">
      <div>Items (${cart.length}):</div>
      <div class="payment-summary-money">$${itemsTotal}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${shipping}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${totalBeforeTax.toFixed(2)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${tax}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${orderTotal}</div>
    </div>

    <button class="place-order-button button-primary">
      Place your order
    </button>
  `;

  const paymentContainer = document.querySelector('.js-payment-summary');
  if (paymentContainer) {
    paymentContainer.innerHTML = paymenthtml;
  }
}
