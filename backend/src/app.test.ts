import request from 'supertest'; 
import app from './app';
import { ProductClient } from './products/productClient';

// Mock ProductClient
jest.mock('./products/productClient');

describe('Express API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Products list', () => {
    it('should return a list of products if the external service returns 200', async () => {
      const mockProducts =  [
        { id: '1', name: 'Product A' },
        { id: '2', name: 'Product B' },
      ];

      const mockGetProducts = jest.fn().mockResolvedValue(mockProducts);
      (ProductClient.getProductClient as jest.Mock).mockReturnValue({
        getProducts: mockGetProducts,
      });

      const response = await request(app).get('/api/products');

      expect(mockGetProducts).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProducts);
    });
  });

  describe('Product price', () => {
    it('should return product price if the productId is valid', async () => {
      const mockGetProductPriceById = jest.fn().mockResolvedValue(10.99);
      (ProductClient.getProductClient as jest.Mock).mockReturnValue({
        getProductPriceById: mockGetProductPriceById,
      });

      const response = await request(app).get('/api/products/123');

      expect(mockGetProductPriceById).toHaveBeenCalledWith("123");
      expect(response.status).toBe(200);
      expect(response.body).toEqual( {"price": 10.99} );
    });

    it('should return error message if the productId is not numeric', async () => {
      const response = await request(app).get('/api/products/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body.errors[0].msg).toBe('Invalid product ID');
    });
  });
});
