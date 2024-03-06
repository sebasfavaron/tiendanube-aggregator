import express, { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
import { ILike, DataSource, Not } from 'typeorm';
import { Product } from './models';
import 'reflect-metadata';
import { getProductsWithPagination, postProduct } from './product';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Cors
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// Database connection
const dataSource = new DataSource({
  type: 'sqlite',
  database: 'database.db',
  entities: [Product],
  synchronize: true,
});
dataSource
  .initialize()
  .then(() => {
    console.log('Connected to SQLite database');
  })
  .catch((error: Error) => {
    console.error('Error connecting to database:', error.message);
  });

app.get('/', (_req: Request, res: Response) => {
  res.send('Welcome to the Product API!');
});

app.get('/products', getProductsWithPagination);

app.post('/products', postProduct);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
