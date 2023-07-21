import prismaDb from '@/lib/prisma-db';
import { ProductClient } from './components/client';
import { ProductColumn } from './components/columns';
import { format } from 'date-fns';
import { formatter } from '@/lib/utils';

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await prismaDb.product.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: 'desc' },
    include: { category: true, color: true, size: true },
  });

  const formattedProducts: ProductColumn[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    price: formatter.format(product.price.toNumber()),
    isArchived: product.isArchived,
    isFeatured: product.isFeatured,
    category: product.category.name,
    size: product.size.name,
    color: product.color.value,
    createdAt: format(product.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
