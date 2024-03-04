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
    filename: '../api/database.db',
    driver: Database,
  });
  db.exec(
    `CREATE TABLE IF NOT EXISTS product (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT NOT NULL,
      url TEXT NOT NULL,
      UNIQUE (name, description)
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
    `INSERT OR REPLACE INTO product
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

const migrateFromSqliteDb = async (db: DatabaseType) => {
  const oldDb = await open({
    filename: 'database old.db',
    driver: Database,
  });
  const products = await oldDb.all(`SELECT * FROM product`);
  console.log('Migrating', products.length, 'products');
  for (const product of products) {
    await insertProduct(db, product);
  }
};

export const main = async () => {
  const db = await getDb();
  // db.exec(`DELETE FROM product`);
  // await migrateFromJSON(db);

  // await insertProduct(db, {
  //   name: 'Chaleco Felix Black',
  //   description: 'Cotton',
  //   price: 100,
  //   image: 'image1.jpg',
  //   url: 'http://example.com/product1',
  // });

  // migrateFromSqliteDb(db);

  const allProducts = await getAllProducts(db);
  console.log(allProducts.length);
};

main();
