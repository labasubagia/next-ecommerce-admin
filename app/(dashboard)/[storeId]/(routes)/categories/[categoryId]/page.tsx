import prismaDb from '@/lib/prisma-db';
import { CategoryForm } from './components/category-form';

const CategoryPage = async ({
  params,
}: {
  params: { storeId: string; categoryId: string };
}) => {
  const category = await prismaDb.category.findUnique({
    where: { id: params.categoryId },
  });

  const billboards = await prismaDb.billboard.findMany({
    where: { storeId: params.storeId },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-1 p-8 pt-6">
        <CategoryForm billboards={billboards} initialData={category} />
      </div>
    </div>
  );
};

export default CategoryPage;
