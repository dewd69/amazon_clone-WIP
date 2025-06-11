import { renderpayment } from "../scripts/checkout.js";
import { loadFromStorage } from "../scripts/cart.js";

describe('test suite: renderpayment', () => {
  it('should display the cart', () => {
    
    document.querySelector('.js-test-container').innerHTML = `<div class="js-order-summary"></div>`;
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([
        {
          productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
          quantity: 2,
          deliveryoptionsid: '1'
        },
        {
          productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
          quantity: 1,
          deliveryoptionsid: '2'
        },
      ]);
    });

    
    loadFromStorage();

    
    renderpayment();

    
    expect(document.querySelectorAll('.js-cart-item-container').length).toEqual(2);
    expect(
        document.querySelector(`.js-product-quantity-${productId1}`).innerText).toContain('Quantity: 1');
        expect(
        document.querySelector(`.js-product-quantity-${productId2}`).innerText).toContain('Quantity: 2');
    
  });
});