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

const createCartItemElement = ({ sku, title, price, image }) => {
  const li = document.createElement('li');
  const liSku = document.createElement('p');
  const liTitle = document.createElement('p');
  const liPrice = document.createElement('p');
  const section = document.createElement('section');
  const removeBtn = document.createElement('button');

  li.className = 'cart__item';
  liSku.innerText = sku;
  liSku.className = 'cart__item__sku';
  liTitle.innerText = title;
  liTitle.className = 'cart__item__title';
  liPrice.innerText = `R$ ${parseFloat(price).toFixed(2)}`;
  liPrice.className = 'cart__item__price';
  removeBtn.innerText = 'Remover item';
  removeBtn.className = 'cart__item__removeBtn'
  section.className = 'cart__item__section';

  section.appendChild(liTitle);
  section.appendChild(liPrice);
  section.appendChild(liSku);
  section.appendChild(removeBtn);
  li.appendChild(section);
  li.appendChild(createProductImageElement(image, 'cart__img'));
  removeBtn.addEventListener('click', cartItemClickListener);
  return li;
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

if (typeof module !== 'undefined') {
  module.exports = {
    createProductImageElement,
    createCustomElement,
    createProductItemElement,
    createCartItemElement,
    createProductList
  };
};