// const saveCartItems = (item) => {
//   localStorage.setItem('cartItems', JSON.stringify(item));
// };

const saveCartItems = (item) => {
  localStorage.setItem('cartItems', item);
};

if (typeof module !== 'undefined') {
  module.exports = saveCartItems;
}
