import prismaDb from '@/lib/prisma-db';
import { OrderClient } from './components/client';
import { OrderColumn } from './components/columns';
import { format } from 'date-fns';
import { formatter } from '@/lib/utils';

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await prismaDb.order.findMany({
    where: { storeId: params.storeId },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const formattedOrders: OrderColumn[] = orders.map((order) => ({
    id: order.id,
    phone: order.phone,
    address: order.address,
    products: order.items.map((item) => item.product.name).join(', '),
    isPaid: order.isPaid,
    totalPrice: formatter.format(
      order.items.reduce(
        (total, item) => total + item.product.price.toNumber(),
        0,
      ),
    ),
    createdAt: format(order.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
