import express from 'express';
import { register, login, logout, account, checkAuth,updateProfile } from '../controller/auth.controller.js';

import protectRoute from '../middleware/protectRoute.js';

import {regValidate} from "../middleware/register/regValidate.js";
import { regCondition } from '../middleware/register/regCondition.js';

import { loginValidate } from '../middleware/login/loginValidate.js';
import { loginCondition } from '../middleware/login/loginCondition.js';

//ratelimit middleware import
import { limiter } from '../middleware/rateLimit.js';


const route = express.Router();

route.post('/register', limiter, regCondition, regValidate, register);

route.post('/login', limiter, loginCondition, loginValidate, login);

route.get('/logout', limiter, logout)

route.put('/update', protectRoute, updateProfile);

route.get('/account', protectRoute, account)

route.get("/check",checkAuth)

export default route;
