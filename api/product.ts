import { Not, ILike } from 'typeorm';
import { Product } from './models';
import { Request, Response, NextFunction } from 'express';

export const getProductsWithPagination = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { limit, offset, search, sort, order } = req.query;

    const products = await Product.query(`
      SELECT * FROM product
      WHERE price != 0
      ${
        search
          ? `AND (name LIKE '%${search}%' OR description LIKE '%${search}%')`
          : ''
      }
      ${
        sort === 'price'
          ? `ORDER BY price ${order === 'DESC' ? 'DESC' : 'ASC'}`
          : ''
      }
      LIMIT ${limit ? Number(limit) : 10}
      OFFSET ${offset ? Number(offset) : 0}
    `);
    const total = (
      await Product.query(`
    SELECT COUNT(*) FROM product
    WHERE price != 0
    ${
      search
        ? `AND (name LIKE '%${search}%' OR description LIKE '%${search}%')`
        : ''
    }
  `)
    )[0]['COUNT(*)'];

    res.json({ products, total });
  } catch (error) {
    next(error);
  }
};

export const postProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, price, image, url } = req.body;
    // Validate input using Joi or other validation library
    // Create a new product in the database
    // Return the newly created product
    res.status(201).json({ message: 'Product created successfully' });
  } catch (error) {
    next(error);
  }
};
