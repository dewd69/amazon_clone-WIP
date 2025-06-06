// scripts/cart.js
export let cart = JSON.parse(localStorage.getItem('cart'));
if(!cart){
  cart = [
  {
    productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
    quantity: 2,
  },
  {
    productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
    quantity: 1,
  },
  {
    productId: '3ebe75dc-64d2-4137-8860-1f5a963e534b',
    quantity: 3
  }

];
}

export function saveToStorage(){
  localStorage.setItem('cart',JSON.stringify(cart));
}


export const addedMessageTimeouts = {};


document.querySelectorAll('.js-add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId;
    const quantity = Number(
      document.querySelector(`.js-quantity-selector-${productId}`).value
    );

    //cart cartItem number
    let matchingcartItem = cart.find((cartItem) => cartItem.productId === productId);
    if (matchingcartItem) {
      matchingcartItem.quantity += quantity;
    } else {
      cart.push({ productId, quantity });
    }

   
    let cartQuantity = cart.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;

    // added visible
    const addedMessageEl = document.querySelector(`.js-added-to-cart-${productId}`);
    if (addedMessageEl) {
      
      if (addedMessageTimeouts[productId]) {
        clearTimeout(addedMessageTimeouts[productId]);
      }
      addedMessageEl.classList.add('added-to-cart-visible');

      
      addedMessageTimeouts[productId] = setTimeout(() => {
        addedMessageEl.classList.remove('added-to-cart-visible');
      }, 2000);
    }
  });
});
export function removeFromCart(productId) {
  const index = cart.findIndex(item => item.productId === productId);
  if (index !== -1) {
    cart.splice(index, 1); 
  }
  saveToStorage();
}

