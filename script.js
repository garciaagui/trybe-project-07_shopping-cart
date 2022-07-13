// const { fetchProducts } = require('./helpers/fetchProducts');
// const { fetchItem } = require("./helpers/fetchItem");
// const saveCartItems = require("./helpers/saveCartItems");
// const getSavedCartItems = require("./helpers/getSavedCartItems");
// const getSavedCartItems = require("./helpers/getSavedCartItems");

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
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

const cartItemClickListener = (event) => {
  event.target.remove();
  applyCartSavingLogic();
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
  const cartList = document.querySelector('.cart__items');
  cartList.appendChild(createCartItemElement({
    sku: id,
    name: title,
    salePrice: price,
  }));
  applyCartSavingLogic();
};

const applyAddItemLogic = () => {
    const addCartButtons = document.querySelectorAll('.item__add');
    addCartButtons.forEach((button) => button.addEventListener('click', addItemToCart));  
};

const createProductList = async () => {
  const productList = await fetchProducts('computador');
  const itemsSection = document.querySelector('.items');
  productList.results.forEach((product) => {
    const item = createProductItemElement({
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    });
    itemsSection.appendChild(item);
  });
  applyAddItemLogic();
};

const getStoredItems = () => {
  const storedItems = JSON.parse(getSavedCartItems());
  if (storedItems) {
    const cartList = document.querySelector('.cart__items');
    storedItems.forEach((item) => {
      cartList.innerHTML += item;
      cartList.lastChild.className = 'cart__item';
    });
    Array.from(document.querySelectorAll('.cart__item'))
      .forEach((item) => item.addEventListener('click', cartItemClickListener));
  }
};

window.onload = () => {
  createProductList();
  getStoredItems();
};
