import prismaDb from '@/lib/prisma-db';

export const getTotalRevenue = async (storeId: string) => {
  const paidOrders = await prismaDb.order.findMany({
    where: { isPaid: true, storeId },
    include: { items: { include: { product: true } } },
  });
  const totalRevenue: number = paidOrders.reduce((total, order) => {
    const orderTotal: number = order.items.reduce(
      (subOrder, item) => subOrder + item.product.price.toNumber(),
      0,
    );
    return total + orderTotal;
  }, 0);
  return totalRevenue;
};
