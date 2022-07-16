const localStorageSimulator = require('../mocks/localStorageSimulator');
const saveCartItems = require('../helpers/saveCartItems');

localStorageSimulator('setItem');

describe('3 - Teste a função saveCartItems', () => {
  it('Testa se o método localStorage.setItem é chamado ao executar a função com o argumento "<ol><li>Item</li></ol>"', () => {
    expect.assertions(1);
    saveCartItems('<ol><li>Item</li></ol>');
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });
  it('Testa se o método localStorage.setItem é chamado com dois parâmetros, sendo o primeiro "cartItems" e o segundo o valor passado como argumento para saveCartItems', () => {
    expect.assertions(1);
    const item = '<ol><li>Item</li></ol>';
    saveCartItems(item);
    expect(localStorage.setItem).toHaveBeenCalledWith('cartItems', item);
  });
});
