import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { chicken, fish, mutton } from '../controller/product.controller.js';
import { addReview, searchProduct } from '../controller/product.controller.js';
import { limiter } from '../middleware/rateLimit.js';

const route = express.Router();

route.get('/chicken', limiter, chicken)
 
route.get('/mutton', limiter, mutton)

route.get('/fish', limiter, fish )

route.patch('/:category/review', limiter, protectRoute, addReview);

route.get('/search/:product', limiter, protectRoute, searchProduct);


export default route