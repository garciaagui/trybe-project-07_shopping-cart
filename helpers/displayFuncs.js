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

if (typeof module !== 'undefined') {
  module.exports = {
    displayLoadingScreen,
    hideLoadingScreen,
    displayEmptyCartMessage,
    hideEmptyCartMessage,
    displayPopupAlert,
    showScrollDownCartTitle,
  };
};