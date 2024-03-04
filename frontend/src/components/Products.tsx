import { useEffect, useState } from 'react';
import { Product, ProductData } from './Product';
import { InfiniteScroll } from './InfiniteScroll';

type ProductsApiResponse = {
  products: ProductData[];
  total: number;
};
const fetchProducts = async (limit: number, offset: number, search = '') => {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/products?limit=${limit}&offset=${offset}&search=${search}&sort=price&order=ASC`
    );
    if (!response.ok) throw new Error('Network response was not ok');

    return response.json() as Promise<ProductsApiResponse>;
  } catch (error) {
    throw new Error('Error fetching products');
  }
};

export const Products = () => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [limit] = useState(8);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);

  const fetchMoreData = async () => {
    const newOffset = offset + limit;
    const data = await fetchProducts(limit, newOffset, search);
    if (!data) return;

    setTotal(data.total);
    setProducts([...products, ...data.products]);
    setOffset(newOffset);
  };

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts(limit, offset, search);
      if (!data) return;

      setTotal(data.total);
      setProducts(data.products);
    };
    loadProducts();
  }, [search]);

  return (
    <div>
      <div className='bg-white rounded-md relative'>
        <div className='p-4'>
          <input
            type='text'
            placeholder='Search products...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='border border-gray-300 rounded-md px-3 py-2 w-full'
          />
          {total > 0 && (
            <div className='text-gray-500 text-right mt-2'>
              {total} products found
            </div>
          )}
        </div>
        <div className='mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8 min-h-[800px]'>
          <div className='mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
            {products.map((product) => (
              <Product
                key={product.url}
                name={product.name}
                description={product.description}
                price={product.price}
                image={product.image}
                url={product.url}
              />
            ))}
            {products.length === 0 && (
              <div className='text-center text-gray-500'>No products found</div>
            )}
          </div>
          {products.length > 0 && (
            <div className={`absolute bottom-0 max-h-full h-[2880px]`}>
              asd
              <InfiniteScroll fetchMoreData={fetchMoreData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
