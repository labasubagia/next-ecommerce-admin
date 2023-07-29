import prismaDb from '@/lib/prisma-db';

export const getSalesCount = async (storeId: string) => {
  const salesCount = await prismaDb.order.count({
    where: { storeId, isPaid: true },
  });

  return salesCount;
};
