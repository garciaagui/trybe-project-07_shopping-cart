const popupOperations = {
  added: 'Item adicionado!',
  removed: 'Item removido!',
  cleared: 'Carrinho limpo!'
}

const displayLoadingScreen = (value) => {
  const loadingScreen = document.querySelector('.loading-screen');
  loadingScreen.style.display = value;
};

const displayEmptyCartMessage = () => {
  const cartList = document.querySelector('.cart__items');
  const existingMessage = document.querySelector('.empty-cart-message');

  if (!cartList.children.length && !existingMessage) {
    const newMessage = document.createElement('div');
    newMessage.classList.add('empty-cart-message');
    newMessage.innerHTML = 'Carrinho vazio...';
    cartList.appendChild(newMessage);
  }

  if (cartList.children.length > 1 && existingMessage) {
    existingMessage.remove();
  }
};

const displayPopupAlert = (op) => {
  const container = document.querySelector('.popup-container');
  const popup = document.createElement('div');

  popup.classList.add(op);
  popup.innerHTML = popupOperations[op];
  container.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 3000)
}

const displayScrollDownCartTitle = () => {
  const scrollDownCartTitle = document.querySelector('.scroll-down-title');
  scrollDownCartTitle.innerText = 'Meu carrinho';
  if (window.scrollY > 58.8) {
    scrollDownCartTitle.style.display = 'block';
  } else scrollDownCartTitle.style.display = 'none';
};

if (typeof module !== 'undefined') {
  module.exports = {
    displayLoadingScreen,
    displayEmptyCartMessage,
    displayPopupAlert,
    displayScrollDownCartTitle,
  };
};