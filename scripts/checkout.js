import { cart, removeFromCart, saveToStorage } from './cart.js';
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
}

function formatCurrency(priceCents) {
  return (priceCents / 100).toFixed(2);
}

function renderCartItems() {
  const container = document.querySelector('.order-summary');
  if (!container) return;
  container.innerHTML = '';

  cart.forEach(cartItem => {
    const product = getProductById(cartItem.productId);
    if (!product) return;

    container.innerHTML += `
      <div class="cart-item-container js-cart-item-container-${product.id}">
        <div class="delivery-date">Delivery date: Tuesday, June 21</div>
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

  // Add delete functionality
  document.querySelectorAll('.js-delete').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      if (container) container.remove();
      updateCartQuantity();
    });
  });

  // Add change delivery option functionality
  document.querySelectorAll('.delivery-option-input').forEach((input) => {
    input.addEventListener('change', () => {
      const productId = input.name.split('delivery-')[1];
      const deliveryOptionId = input.value;

      const cartItem = cart.find(item => item.productId === productId);
      if (cartItem) {
        cartItem.deliveryoptionsid = deliveryOptionId;
        saveToStorage();
      }
    });
  });
}

function deliveryoptionshtml(product, selectedId) {
  let html = '<div class="delivery-options"><div class="delivery-options-title">Choose a delivery option:</div>';

  deliveryoptions.forEach((option) => {
    const deliveryDate = dayjs().add(option.deliverydays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');
    const priceString = option.pricecents === 0 ? 'Free' : `$${formatCurrency(option.pricecents)}`;
    const checked = option.id === selectedId ? 'checked' : '';

    html += `
      <div class="delivery-option">
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


document.addEventListener('DOMContentLoaded', () => {
  renderCartItems();
  updateCartQuantity();
});
