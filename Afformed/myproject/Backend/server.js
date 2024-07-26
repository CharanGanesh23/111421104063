import express from 'express';
import cors from "cors"
import { products } from './products.js';

const app = express();
app.use(cors());
app.use(express.json());
app.get("/test",(req,res)=>{
    res.status(200).json(products)
})
app.get('/test/product/:productName', (req, res) => {
    const { productName } = req.params;
    const product = products.find(p => p.productName === productName);
    
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  });
  
app.get('/test/companies/:companyname/categories/:categoryname/products', (req, res) => {
    const { companyname, categoryname } = req.params;
    const { top = 10, minPrice = 0, maxPrice = Infinity, minRating = 0, maxRating = 5, availability, page = 1 } = req.query;
    const topN = parseInt(top, 10);
    const minPriceValue = parseFloat(minPrice);
    const maxPriceValue = parseFloat(maxPrice);
    const minRatingValue = parseFloat(minRating);
    const maxRatingValue = parseFloat(maxRating);
    const pageValue = parseInt(page, 10);
    const filteredProducts = products.filter(product => {
        let isValid = true;
        if (companyname && product.company !== companyname) {
            isValid = false;
        }
        if (categoryname && !product.productName.includes(categoryname)) {
            isValid = false;
        }
        if (product.price < minPriceValue || product.price > maxPriceValue) {
            isValid = false;
        }
        if (product.rating < minRatingValue || product.rating > maxRatingValue) {
            isValid = false;
        }
        if (availability && product.availability !== availability) {
            isValid = false;
        }

        return isValid;
    });

    const startIndex = (pageValue - 1) * topN;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + topN);    
    res.status(200).json(paginatedProducts);
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});