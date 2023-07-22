'use client';

import { Heading } from '@/components/ui/heading';
import { OrderColumn, columns } from './columns';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';

interface OrderClientProps {
  data: OrderColumn[];
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Orders (${data.length})`}
          description="List orders of your store"
        />
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="products" />
    </>
  );
};
