// const { fetchProducts } = require('./helpers/fetchProducts');
// const { fetchItem } = require("./helpers/fetchItem");
// const saveCartItems = require("./helpers/saveCartItems");
// const getSavedCartItems = require("./helpers/getSavedCartItems");
// const getSavedCartItems = require("./helpers/getSavedCartItems");
const cartList = document.querySelector('.cart__items');
const subtotalSection = document.querySelector('.total-price');
const clearCartButton = document.querySelector('.empty-cart');
const currencyFormat = { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' };

const displayLoading = () => {
  const container = document.querySelector('.container');
  const loadingScreen = document.createElement('div');
  loadingScreen.classList.add('loading');
  loadingScreen.innerHTML = 'Carregando...';
  container.appendChild(loadingScreen);
};

const hideLoading = () => {
  const loadingScreen = document.querySelector('.loading');
  loadingScreen.remove();
};

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource.replace('I', 'W');
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  if (className === 'item__price') e.innerText = innerText.toLocaleString('pt-BR', currencyFormat);
  else e.innerText = innerText;
  return e;
};

const createProductItemElement = ({ sku, name, price, image }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createCustomElement('span', 'item__price', price));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
};

const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;

const applyCartSavingLogic = () => {
  const itemsArr = Array.from(document.querySelectorAll('.cart__item'))
    .map((item) => `<li>${item.innerText}</li>`);
  saveCartItems(JSON.stringify(itemsArr));
};

const calculateSubtotal = async () => {
  const storedItems = JSON.parse(getSavedCartItems());
  const priceItems = storedItems.map((item) => {
    const price = item.split('PRICE: $')[1].match(/\d+/g).join('.');
    return parseFloat(price);
  });
  const subtotal = priceItems.reduce((total, curr) => (Math.round((total + curr) * 100) / 100), 0);
  localStorage.setItem('subtotalPrice', subtotal);
  subtotalSection.innerHTML = subtotal;
};

const clearCart = () => {
  while (cartList.firstChild) {
    cartList.removeChild(cartList.firstChild);
  }
  applyCartSavingLogic();
  calculateSubtotal();
};

const cartItemClickListener = (event) => {
  event.target.remove();
  applyCartSavingLogic();
  calculateSubtotal();
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const addItemToCart = async (event) => {
  const info = event.target.parentElement.firstChild.innerHTML;
  const item = await fetchItem(info);
  const { id, title, price } = item;
  cartList.appendChild(createCartItemElement({
    sku: id,
    name: title,
    salePrice: price,
  }));
  applyCartSavingLogic();
  await calculateSubtotal();
};

const applyAddItemLogic = () => {
    const addCartButtons = document.querySelectorAll('.item__add');
    addCartButtons.forEach((button) => button.addEventListener('click', addItemToCart));  
};

const createProductList = async () => {
  displayLoading();
  const productList = await fetchProducts('computador');
  const itemsSection = document.querySelector('.items');
  productList.results.forEach((product) => {
    const item = createProductItemElement({
      sku: product.id,
      name: product.title,
      price: product.price,
      image: product.thumbnail,
    });
    itemsSection.appendChild(item);
  });
  applyAddItemLogic();
  hideLoading();
};

const getStoredItems = () => {
  const storedItems = JSON.parse(getSavedCartItems());
  if (storedItems) {
    storedItems.forEach((item) => {
      cartList.innerHTML += item;
      cartList.lastChild.className = 'cart__item';
    });
    Array.from(document.querySelectorAll('.cart__item'))
      .forEach((item) => item.addEventListener('click', cartItemClickListener));
  }
};

const getStoredSubtotalPrice = () => {
  const subtotal = localStorage.getItem('subtotalPrice');
  subtotalSection.innerHTML = subtotal;
};

window.onload = () => {
  createProductList();
  getStoredItems();
  getStoredSubtotalPrice();
  clearCartButton.addEventListener('click', clearCart);
};
