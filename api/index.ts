// server.ts

import express, { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
import { createConnection, Connection, Like } from 'typeorm';
import { Product } from './models';
import 'reflect-metadata';
import { ILike } from 'typeorm';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// Database connection
createConnection({
  type: 'sqlite',
  database: '../scraper/database.db', // Your SQLite database file
  entities: [Product], // Add other entities as needed
  synchronize: true, // Auto-create tables (for development only)
})
  .then((connection: Connection) => {
    console.log('Connected to SQLite database');
  })
  .catch((error: Error) => {
    console.error('Error connecting to database:', error.message);
  });

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Product API!');
});

app.get(
  '/products',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit, offset, search, sort, order } = req.query;
      const query = {
        skip: offset ? Number(offset) : 0,
        take: limit ? Number(limit) : 10,
        where: {},
        order: {},
      };

      if (search) {
        query.where = [
          { name: ILike(`%${search}%`) },
          { description: ILike(`%${search}%`) },
        ];
      }

      if (sort === 'price') {
        query.order = { price: order === 'DESC' ? 'DESC' : 'ASC' };
      }

      const [products, total] = await Product.findAndCount(query);
      res.json({ products, total });
    } catch (error) {
      next(error);
    }
  }
);

// Example route for creating a new product
app.post(
  '/products',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description, price, image, url } = req.body;
      // Validate input using Joi or other validation library
      // Create a new product in the database
      // Return the newly created product
      res.status(201).json({ message: 'Product created successfully' });
    } catch (error) {
      next(error);
    }
  }
);

// Add more routes for other CRUD operations (GET, PUT, DELETE)

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
