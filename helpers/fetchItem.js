const fetchItem = async (itemCode) => {
  const url = `https://api.mercadolibre.com/items/${itemCode}`;
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
    fetchItem,
  };
}
