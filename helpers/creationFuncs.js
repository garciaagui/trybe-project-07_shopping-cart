const createImageElement = (imageSource, className) => {
  const img = document.createElement('img');
  img.className = className;
  img.src = imageSource.replace('I', 'W');
  return img;
};

const createCustomProductElement = (element, className, innerText) => {
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
  section.appendChild(createCustomProductElement('span', 'item__sku', sku));
  section.appendChild(createCustomProductElement('span', 'item__title', name));
  section.appendChild(createCustomProductElement('span', 'item__price', price));
  section.appendChild(createImageElement(image, 'item__image'));
  section.appendChild(createCustomProductElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
};

const createCustomCartElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') e.addEventListener('click', (e) => { cartItemClickListener(e) });
  return e;
};

const createCartItemElement = ({ sku, title, price, image }) => {
  const li = document.createElement('li');
  const section = document.createElement('section');

  li.className = 'cart__item';
  section.className = 'cart__item__section';

  section.appendChild(createCustomCartElement('span', 'cart__item__sku', sku));
  section.appendChild(createCustomCartElement('span', 'cart__item__title', title));
  section.appendChild(createCustomCartElement('span', 'cart__item__price', `R$ ${parseFloat(price).toFixed(2)}`));
  section.appendChild(createCustomCartElement('button', 'cart__item__removeBtn', 'Remover item'));

  li.appendChild(section);
  li.appendChild(createImageElement(image, 'cart__img'));
  return li;
};

const createProductList = async (searchValue) => {
  displayLoadingScreen('flex');
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
  displayLoadingScreen('none');
};

if (typeof module !== 'undefined') {
  module.exports = {
    createImageElement,
    createCustomProductElement,
    createProductItemElement,
    createCustomCartElement,
    createCartItemElement,
    createProductList
  };
};