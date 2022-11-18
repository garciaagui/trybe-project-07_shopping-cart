const cartList = document.querySelector('.cart__items');
const clearCartButton = document.querySelector('.empty-cart-btn');
const searchButton = document.querySelector('.search-btn');
const currencyFormat = { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' };

const calculateSubtotal = async () => {
  const storedItems = JSON.parse(getSavedCartItems());
  const subtotalSection = document.querySelector('.total-price');
  const priceItems = storedItems.map(({ price }) => {
    return parseFloat(price);
  });
  const subtotal = priceItems.reduce((total, curr) => (Math.round((total + curr) * 100) / 100), 0);
  localStorage.setItem('subtotalPrice', subtotal);
  subtotalSection.innerHTML = subtotal.toLocaleString('pt-BR', currencyFormat);;
};

const clearProductList = () => {
  const listItems = document.querySelector('.items');
  while (listItems.firstChild) {
    listItems.removeChild(listItems.firstChild);
  }
};

const clearCart = () => {
  while (cartList.firstChild) {
    cartList.removeChild(cartList.firstChild);
  }
  displayPopupAlert('cleared')
  applyCartSaveLogic();
  displayEmptyCartMessage();
  calculateSubtotal();
};

const cartItemClickListener = (event) => {
  if (event.target.parentElement.parentElement.className === 'cart__item') {
    event.target.parentElement.parentElement.remove();
  }
  displayPopupAlert('removed')
  applyCartSaveLogic();
  displayEmptyCartMessage();
  calculateSubtotal();
};

const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;

const addItemToCart = async (event) => {
  displayPopupAlert('added');
  const listItem = event.target.parentElement;
  const item = await fetchItem(getSkuFromProductItem(listItem));
  const { id, title, price, thumbnail } = item;
  cartList.appendChild(createCartItemElement({
    sku: id,
    title,
    price,
    image: thumbnail,
  }));
  applyCartSaveLogic();
  hideEmptyCartMessage();
  await calculateSubtotal();
};

const retrieveCartItems = () => {
  const storedItems = JSON.parse(getSavedCartItems());
  if (storedItems) {
    storedItems.forEach((item) => {
      const { sku, title, price, image } = item;
      cartList.appendChild(createCartItemElement({ sku, title, price, image }));
    });
    Array.prototype.slice.call(document.getElementsByTagName('br'))
      .forEach((item) => {
        item.remove();
      });
    applyRemoveItemFromCartLogic();
  }
  calculateSubtotal();
};

window.addEventListener('scroll', () => { showScrollDownCartTitle() });

window.onload = () => {
  createProductList('computador');
  retrieveCartItems();
  displayEmptyCartMessage();
  clearCartButton.addEventListener('click', clearCart);
};

searchButton.addEventListener('click', () => {
  const searchValue = document.querySelector('.search-input').value;
  createProductList(searchValue);
  document.querySelector('.search-input').value = '';
});
