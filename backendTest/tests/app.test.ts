import axios from 'axios';

const BASE_URL = 'http://backend_lb:80/api';

describe('integrate test product server', () => {
  it('Get product list', async () => {
    const response = await axios.get(`${BASE_URL}/products/`);
    expect(response.status).toBe(200);
    const ids = response.data.map((product: any) => product.id);
    expect(ids).toContainEqual("46172");
  });

  it('Get product price', async () => {
    const response = await axios.get(`${BASE_URL}/products/46172/`);
    expect(response.status).toBe(200);
  });
});
