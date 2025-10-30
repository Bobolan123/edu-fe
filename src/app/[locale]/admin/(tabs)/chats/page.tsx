import AdminChatsPage from '@/components/Admin/Chats/AdminChatsPage';
import { getAllSupportTickets } from '@/actions/supportTicketActions';
import { redirect } from 'next/navigation';
import { ISupportTicket } from '../../../../../../types/entities';

interface ChatsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    take?: string;
  }>;
}

export default async function ChatsPage(props: ChatsPageProps) {
  const searchParams = await props.searchParams;

  try {
    const page = parseInt(searchParams.page || '1');
    const search = searchParams.search;
    const status = searchParams.status;
    const take = searchParams.take;

    const ticketsResponse = await getAllSupportTickets({
      page,
      search,
      status,
      take
    });
    console.log(ticketsResponse)

    // Check if response is an error
    if ('success' in ticketsResponse && !ticketsResponse.success) {
      console.error('Failed to fetch tickets:', ticketsResponse.message);
      redirect('/admin?error=failed-to-load-chats');
    }

    // Type guard - ensure we have the correct structure
    const tickets: IModelPaginate<ISupportTicket> = ticketsResponse as IModelPaginate<ISupportTicket>;

    return (
      <AdminChatsPage
        tickets={tickets}
        searchParams={searchParams}
      />
    );
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    redirect('/admin?error=failed-to-load-chats');
  }
}
