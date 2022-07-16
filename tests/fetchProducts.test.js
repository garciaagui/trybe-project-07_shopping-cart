require('../mocks/fetchSimulator');
const { fetchProducts } = require('../helpers/fetchProducts');
const computadorSearch = require('../mocks/search');

describe('1 - Teste a função fetchProducts', () => {
  it('Testa se é uma função', () => {
    expect.assertions(1);
    expect(typeof fetchProducts).toBe('function');
  })
  it('Teste se fetch foi chamado ao executar a função com o argumento "computador"', async () => {
    expect.assertions(1);
    await fetchProducts('computador');
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it('Teste se fetch utiliza o endpoint correto ao chamar a função com o  argumento "computador"', async () => {
    expect.assertions(1);
    const expected = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
    await fetchProducts('computador');
    expect(fetch).toHaveBeenCalledWith(expected);
  });
  it('Testa se o retorno da função é igual ao objeto computadorSearch ao executá-la com o argumento "computador"', async () => {
    expect.assertions(1);
    const response = await fetchProducts('computador');
    expect(response).toEqual(computadorSearch);
  });
  it('Testa se retorna um erro com a mensagem: "You must provide an url" ao chamar a função sem argumento', async () => {
    expect.assertions(1);
    const failedRequest = await fetchProducts();
    expect(failedRequest).toEqual(new Error('You must provide an url')); 
  });
});
