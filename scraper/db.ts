import { open } from 'sqlite';
import { Database } from 'sqlite3';

export type Product = {
  name: string;
  description: string;
  price: number;
  image: string;
  url: string;
};

type DatabaseType = Awaited<ReturnType<typeof open>>;
export const getDb = async () => {
  const db = await open({
    filename: 'database.db',
    driver: Database,
  });
  db.exec(
    `CREATE TABLE IF NOT EXISTS product (
      id INTEGER PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      price REAL,
      image TEXT,
      url TEXT,
      CONSTRAINT uc_product_name_description UNIQUE (name, description)
    )`
  );

  // Insert example
  // db.exec(
  //   `INSERT INTO product
  //     (name, description, price, image, url) VALUES
  //     ("Product 5", "Description 1", 100, "image1.jpg", "http://example.com/product1")`
  // );
  return db;
};

export const insertProduct = async (db: DatabaseType, product: Product) => {
  await db.run(
    `INSERT INTO product
      (name, description, price, image, url) VALUES
      (?, ?, ?, ?, ?)`,
    [
      product.name,
      product.description,
      product.price,
      product.image,
      product.url,
    ]
  );
};

export const getAllProducts = async (db: DatabaseType) => {
  return db.all(`SELECT * FROM product`);
};

export const getProductByName = async (db: DatabaseType, name: string) => {
  return db.get(`SELECT * FROM product WHERE name = ?`, [name]);
};

const migrateFromJSON = async (db: DatabaseType) => {
  const products = require('./allProducts.json');
  console.log('Migrating', products.length, 'products');
  let i = 0;
  for (const product of products) {
    try {
      await insertProduct(db, product);
    } catch (error) {
      console.error('Error inserting product', product, error, i);
    }
    i++;
  }
};

export const main = async () => {
  const db = await getDb();
  // db.exec(`DELETE FROM product`);
  // await migrateFromJSON(db);
  const allProducts = await getAllProducts(db);
  console.log(allProducts.length);
};

// main();
