const fetchProducts = async (productName) => {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${productName}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

const fetchItem = async (itemId) => {
  const url = `https://api.mercadolibre.com/items/${itemId}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchProducts,
    fetchItem,
  };
}
