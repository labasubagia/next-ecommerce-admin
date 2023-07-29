import prismaDb from '@/lib/prisma-db';
import { format } from 'date-fns';

interface GraphData {
  name: string;
  total: number;
}

export const getGraphRevenue = async (storeId: string) => {
  const paidOrders = await prismaDb.order.findMany({
    where: { isPaid: true, storeId },
    include: { items: { include: { product: true } } },
  });

  const monthlyRevenue: { [key: string]: number } = {};

  for (const order of paidOrders) {
    const month = format(order.createdAt, 'yyyy/MM');
    let revenueForOrder = 0;
    for (const item of order.items) {
      revenueForOrder += item.product.price.toNumber();
    }
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
  }

  const graphData: GraphData[] = Array(12)
    .fill(null)
    .map((_, index) => {
      const date = new Date();
      date.setDate(1);
      date.setMonth(index);
      return {
        name: format(date, 'MMM'),
        total: monthlyRevenue[format(date, 'yyyy/MM')] ?? 0,
      };
    });

  return graphData;
};
