const cartList = document.querySelector('.cart__items');
const clearCartButton = document.querySelector('.empty-cart-btn');
const searchButton = document.querySelector('.search-btn');
const currencyFormat = { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' };
const popupOperations = {
  added: 'Item adicionado!',
  removed: 'Item removido!',
  cleared: 'Carrinho limpo!'
}

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

const displayEmptyCartMessage = () => {
  if (!cartList.children.length) {
    const emptyCartMessage = document.createElement('div');
    emptyCartMessage.classList.add('empty-cart-message');
    emptyCartMessage.innerHTML = 'Carrinho vazio...';
    cartList.appendChild(emptyCartMessage);
  }
};

const hideEmptyCartMessage = () => {
  const emptyCartMessage = document.querySelector('.empty-cart-message');
  if (cartList.children.length && emptyCartMessage) {
    emptyCartMessage.remove();
  }
};

const displayPopupAlert = (operation) => {
  const container = document.querySelector('.popup-container');
  const popup = document.createElement('div');
  popup.classList.add(operation);
  popup.innerHTML = popupOperations[operation];
  container.appendChild(popup);
  setTimeout(() => {
    popup.remove();
  }, 3000)
}

const showScrollDownCartTitle = () => {
  const scrollDownCartTitle = document.querySelector('.scroll-down-title');
  scrollDownCartTitle.innerText = 'Meu carrinho';
  if (window.scrollY > 58.8) {
    scrollDownCartTitle.style.display = 'block';
  } else scrollDownCartTitle.style.display = 'none';
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
    const price = item.split('R$ ')[1].match(/\d+/g).join('.');
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

const createCartItemElement = ({ name, salePrice, image }) => {
  const li = document.createElement('li');
  const liTitle = document.createElement('p');
  const liPrice = document.createElement('p');
  const section = document.createElement('section');
  const removeBtn = document.createElement('button');

  li.className = 'cart__item';
  liTitle.innerText = name;
  liTitle.className = 'cart__item__title';
  liPrice.innerText = `R$ ${parseFloat(salePrice).toFixed(2)}`;
  liPrice.className = 'cart__item__price';
  removeBtn.innerText = 'Remover item';
  removeBtn.className = 'cart__item__removeBtn'
  section.className = 'cart__item__section';

  section.appendChild(liTitle);
  section.appendChild(liPrice);
  section.appendChild(removeBtn);
  li.appendChild(section);
  li.appendChild(createProductImageElement(image, 'cart__img'));
  removeBtn.addEventListener('click', cartItemClickListener);
  return li;
};

const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;

const addItemToCart = async (event) => {
  displayPopupAlert('added');
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
  hideEmptyCartMessage();
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

const createProductList = async (searchValue) => {
  displayLoadingScreen();
  clearProductList();
  const productList = await fetchProducts(searchValue);
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
      const priceIndex = info[1].indexOf('R$');
      const name = info[1].slice(0, priceIndex);
      const price = info[1].slice(priceIndex, info[1].indexOf('</li')).replace('R$', '');
      cartList.appendChild(createCartItemElement({ name, salePrice: price, image: info[0] }));
    });
    Array.prototype.slice.call(document.getElementsByTagName('br'))
      .forEach((item) => {
        item.remove();
      });
    applyRemoveItemFromCartLogic();
  }
  calculateSubtotal();
};

window.addEventListener('scroll', showScrollDownCartTitle);

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
