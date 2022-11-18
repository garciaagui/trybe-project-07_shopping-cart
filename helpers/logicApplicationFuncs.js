const applyCartItemLogic = (event) => {
  if (event.target.parentElement.parentElement.className === 'cart__item') {
    event.target.parentElement.parentElement.remove();
  }
  displayPopupAlert('removed')
  applyCartSaveLogic();
  displayEmptyCartMessage();
  calculateSubtotal();
};

const applyCartSaveLogic = () => {
  const itemsArr = Array.from(document.querySelectorAll('.cart__item'))
    .map((item) => {
      const itemObj = {
        sku: item.querySelector('.cart__item__sku').innerText,
        title: item.querySelector('.cart__item__title').innerText,
        price: item.querySelector('.cart__item__price').innerText.replace('R$ ', ''),
        image: item.querySelector('.cart__img').src,
      }
      return itemObj;
    });
  saveCartItems(JSON.stringify(itemsArr));
};

const applyAddItemToCartLogic = () => {
  const addCartBtn = document.querySelectorAll('.item__add');
  addCartBtn.forEach((button) => button.addEventListener('click', addItemToCart));
};

const applyRemoveItemFromCartLogic = () => {
  Array.from(document.querySelectorAll('.cart__item'))
    .forEach((item) => item.addEventListener('click', applyCartItemLogic));
};

if (typeof module !== 'undefined') {
  module.exports = {
    applyCartItemLogic,
    applyCartSaveLogic,
    applyAddItemToCartLogic,
    applyRemoveItemFromCartLogic,
  };
};