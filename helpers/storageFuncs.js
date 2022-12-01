const getSavedCartItems = () => localStorage.getItem('cartItems');

const saveCartItems = (item) => {
  localStorage.setItem('cartItems', item);
};

if (typeof module !== 'undefined') {
  module.exports = {
    getSavedCartItems,
    saveCartItems,
  };
}
