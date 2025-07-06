import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { addToCart, getCart, removeCart } from '../controller/cart.controller.js';

const route = express.Router();

route.post('/addcart', protectRoute, addToCart);

route.get('/getcart', protectRoute, getCart);

route.post('/removecart', protectRoute, removeCart);

export default route;
