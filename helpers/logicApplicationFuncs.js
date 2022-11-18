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
    .forEach((item) => item.addEventListener('click', cartItemClickListener));
};

if (typeof module !== 'undefined') {
  module.exports = {
    applyCartSaveLogic,
    applyAddItemToCartLogic,
    applyRemoveItemFromCartLogic,
  };
};