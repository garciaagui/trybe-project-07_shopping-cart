const cartList = document.querySelector('.cart__items');
const clearCartButton = document.querySelector('.empty-cart');

const displayLoadingScreen = () => {
  const container = document.querySelector('.container');
  const loadingScreen = document.createElement('div');
  loadingScreen.classList.add('loading');
  loadingScreen.innerHTML = 'Carregando...';
  container.appendChild(loadingScreen);
};

const hideLoadingScreen = () => {
  const loadingScreen = document.querySelector('.loading');
  loadingScreen.remove();
};

const createProductImageElement = (imageSource, className) => {
  const img = document.createElement('img');
  img.className = className;
  img.src = imageSource.replace('I', 'W');
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  if (className === 'item__price') {
    const currencyFormat = { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' };
    e.innerText = innerText.toLocaleString('pt-BR', currencyFormat);
  } else e.innerText = innerText;
  return e;
};

const createProductItemElement = ({ sku, name, price, image }) => {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createCustomElement('span', 'item__price', price));
  section.appendChild(createProductImageElement(image, 'item__image'));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
};

const applyCartSaveLogic = () => {
    const itemsArr = Array.from(document.querySelectorAll('.cart__item'))
      .map((item) => `${item.lastChild.src} <li>${item.innerText}</li>`);
    saveCartItems(JSON.stringify(itemsArr));
  };

const calculateSubtotal = async () => {
  const storedItems = JSON.parse(getSavedCartItems());
  const subtotalSection = document.querySelector('.total-price');
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
  applyCartSaveLogic();
  calculateSubtotal();
};

const cartItemClickListener = (event) => {
  if (event.target.parentElement.className === 'cart__item') event.target.parentElement.remove();
  else event.target.remove();
  applyCartSaveLogic();
  calculateSubtotal();
};

const createCartItemElement = ({ sku, name, salePrice, image }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.appendChild(createProductImageElement(image, 'cart__img'));
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;

const addItemToCart = async (event) => {
  const listItem = event.target.parentElement;
  const item = await fetchItem(getSkuFromProductItem(listItem));
  const { id, title, price, thumbnail } = item;
  cartList.appendChild(createCartItemElement({
    sku: id,
    name: title,
    salePrice: price,
    image: thumbnail,
  }));
  applyCartSaveLogic();
  await calculateSubtotal();
};

const applyAddItemToCartLogic = () => {
    const addCartBtn = document.querySelectorAll('.item__add');
    addCartBtn.forEach((button) => button.addEventListener('click', addItemToCart));  
};

const applyRemoveItemFromCartLogic = () => {
  Array.from(document.querySelectorAll('.cart__item'))
  .forEach((item) => item.addEventListener('click', cartItemClickListener));
};

const createProductList = async () => {
  displayLoadingScreen();
  const productList = await fetchProducts('computador');
  const productSection = document.querySelector('.items');
  productList.results.forEach((product) => {
    const item = createProductItemElement({
      sku: product.id,
      name: product.title,
      price: product.price,
      image: product.thumbnail,
    });
    productSection.appendChild(item);
  });
  applyAddItemToCartLogic();
  hideLoadingScreen();
};

const retrieveCartItems = () => {
  const storedItems = JSON.parse(getSavedCartItems());
  if (storedItems) {
    storedItems.forEach((item) => {
      const info = item.split(' <li>');
      cartList.innerHTML += `<li>${info[1]}`;
      cartList.lastChild.className = 'cart__item';
      cartList.lastChild.appendChild(createProductImageElement(info[0], 'cart__img'));
    });
    applyRemoveItemFromCartLogic();
  }
  calculateSubtotal();
};

window.onload = () => {
  createProductList();
  retrieveCartItems();
  clearCartButton.addEventListener('click', clearCart);
};
