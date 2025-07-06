import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'

import authroute from './route/authroute.js';
import productroute from './route/productroute.js'; 
import cartroute from './route/cartroute.js';

//dotenv configuration
import dotenv from 'dotenv'

//database connection import
import dbConnection from './database/dbConnection.js';

//import helmet for header security
import helmet from 'helmet';

import protectRoute from './middleware/protectRoute.js';
import { limiter } from './middleware/rateLimit.js';

const app = express();
dotenv.config()

app.use(cors({  origin: "http://localhost:5173",
  credentials: true}));
app.use(express.json());
app.use(cookieParser())
app.use(helmet());

app.use("/api/auth", authroute);

app.use('/api/allproducts', productroute);

app.use('/api/cart',limiter , cartroute)

app.listen(8000, () => {
  console.log("Server is running on port 8000");

  //connecting db
  dbConnection()
});
