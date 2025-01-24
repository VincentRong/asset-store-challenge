import express from 'express';
import { param, validationResult } from 'express-validator';
import { Product } from './products/product';
import { ProductClient } from './products/productClient';

const app = express()

interface ProductList {
  total: number;
  products: Product[];
}

app.get('/api/products', async (req, res) => {
  try {
    const products = await ProductClient.getProductClient().getProducts();
    return res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ error: 'Internal Server Error'});
  }
});

app.get('/api/products/:productId',
  [
    param('productId').isNumeric().withMessage('Invalid product ID'),
  ], 
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.error('Invalid product ID:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      const productId = req.params.productId;
      const productPrice = await ProductClient.getProductClient().getProductPriceById(productId);
      return res.json({
        price: productPrice
      });
    } catch (error) {
      console.error('Error fetching product price:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    
})

export default app;