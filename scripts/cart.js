
const cart = [];

document.querySelectorAll('.js-add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId;

    let matchingItem;
cart.forEach((item) => {
  if (productId === item.productId) {
    matchingItem = item;
  }
});
const quantity = Number(
    document.querySelector(`.js-quantity-selector-${productId}`).value
  );
if (matchingItem) {
  matchingItem.quantity += quantity;
} else {
  
  cart.push({
    productId: productId,
    quantity: quantity
  });
}

    let cartQuantity = 0;

    cart.forEach((item) => {
        cartQuantity += item.quantity;
    });
    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
  });
});