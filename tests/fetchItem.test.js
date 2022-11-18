require('../mocks/fetchSimulator');
const { fetchItem } = require('../helpers/fetchFuncs');
const item = require('../mocks/item');

describe('2 - Teste a função fetchItem', () => {
  it('Testa se é uma função', () => {
    expect.assertions(1);
    expect(typeof fetchItem).toBe('function');
  });
  it('Testa se fetch foi chamado ao executar a função com o argumento "MLB1615760527"', async () => {
    expect.assertions(1);
    await fetchItem('MLB1615760527');
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it('Testa se fetch utiliza o endpoint correto ao chamar a função com o argumento "MLB1615760527"', async () => {
    expect.assertions(1);
    const expected = "https://api.mercadolibre.com/items/MLB1615760527";
    await fetchItem('MLB1615760527');
    expect(fetch).toHaveBeenCalledWith(expected);
  });
  it('Testa se o retorno da função é igual ao objeto item ao executá-la com o argumento "MLB1615760527"', async () => {
    expect.assertions(1);
    const response = await fetchItem('MLB1615760527');
    expect(response).toEqual(item);
  });
  it('Testa se retorna um erro com a mensagem: "You must provide an url" ao chamar a função sem argumento', async () => {
    expect.assertions(1);
    const failedRequest = await fetchItem();
    expect(failedRequest).toEqual(new Error('You must provide an url'));
  });
});
