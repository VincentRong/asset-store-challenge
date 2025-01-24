import axios from "axios";
import { PriceInfo, Product } from "./product";
import { redisClient } from "../redis/redisClient";

const LEGACY_SERVICE_API = 'http://legacy-backend-rl:81/api';

interface ProductList {
  total: number;
  products: Product[];
}

export class ProductClient {
    private static productClient: ProductClient;

    private constructor() {
        console.log("Singleton productClient created");
    }

    public static getProductClient(): ProductClient {
        if (!ProductClient.productClient) {
            ProductClient.productClient = new ProductClient();
        }
        return ProductClient.productClient;
      }

    // Fetches a list of products
    async getProducts(): Promise<Product[]> {
        const productsKey = 'products';
        const cachedProducts = await redisClient.get(productsKey);
        if(cachedProducts) {
            console.log("return cached products");
            return JSON.parse(cachedProducts);
        }
        const response = await axios.get(`${LEGACY_SERVICE_API}/products`);
        const productsData: ProductList = response.data;
        await redisClient.set(productsKey, JSON.stringify(productsData.products), { EX: 120 });
        console.log(productsData.products);
        return productsData.products;
    }

    // Fetches the price of a product by its ID
    async getProductPriceById(productId: string): Promise<number> {
        const productPriceKey = `product_price_${productId}`;
        const cachedPrice = await redisClient.get(productPriceKey);
        if(cachedPrice) {
            console.log("return cached price: ", cachedPrice);
            return parseFloat(cachedPrice);
        }
        const response = await axios.get(`${LEGACY_SERVICE_API}/products/price?id=${productId}`);
        const priceInfo: PriceInfo = await response.data;
        await redisClient.set(productPriceKey, priceInfo.price, { EX: 60 })
        return priceInfo.price;
    }
}