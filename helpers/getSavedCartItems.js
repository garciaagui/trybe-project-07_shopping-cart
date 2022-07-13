// const getSavedCartItems = () => {
//   const x = localStorage.getItem('cartItems');
//   return JSON.parse(x);
// };

const getSavedCartItems = () => localStorage.getItem('cartItems');

if (typeof module !== 'undefined') {
  module.exports = getSavedCartItems;
}
