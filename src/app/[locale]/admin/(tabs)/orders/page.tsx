import AdminOrdersPage from '@/components/Admin/Orders/AdminOrdersPage';
import { getOrders } from '@/actions/orderActions';
import { redirect } from 'next/navigation';
import { OrderStatus, PaymentMethod } from '../../../../../../types/entities';

interface OrdersPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: OrderStatus;
    paymentMethod?: PaymentMethod;
  }>;
}

export default async function OrdersPage(props: OrdersPageProps) {
  const searchParams = await props.searchParams;
  
  try {
    const page = parseInt(searchParams.page || '1');
    const limit = 10;
    const search = searchParams.search;
    const status = searchParams.status;
    const paymentMethod = searchParams.paymentMethod;
    
    const ordersResponse = await getOrders(
      page, 
      limit, 
      search,
      status,
      paymentMethod
    );
    
    return (
      <AdminOrdersPage 
        orders={ordersResponse} 
        searchParams={searchParams}
      />
    );
  } catch (error) {
    console.error('Error fetching orders:', error);
    redirect('/admin?error=failed-to-load-orders');
  }
}