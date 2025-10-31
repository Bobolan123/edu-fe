import AdminReviewsPage from '@/components/Admin/Reviews/AdminReviewsPage';
import { getAllReviewsAdmin } from '@/actions/reviewsAction';
import { redirect } from 'next/navigation';
import { ReviewStatus } from '../../../../../../types/entities';

interface ReviewsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    rating?: string;
    minRating?: string;
    maxRating?: string;
    status?: ReviewStatus;
    minUpVotes?: string;
    sortBy?: "newest" | "oldest" | "highest_rating" | "lowest_rating";
  }>;
}

export default async function ReviewsPage(props: ReviewsPageProps) {
  const searchParams = await props.searchParams;
  
  try {
    const page = parseInt(searchParams.page || '1');
    const take = 10;
    const search = searchParams.search;
    const rating = searchParams.rating ? parseInt(searchParams.rating) : undefined;
    const minRating = searchParams.minRating ? parseInt(searchParams.minRating) : undefined;
    const maxRating = searchParams.maxRating ? parseInt(searchParams.maxRating) : undefined;
    const status = searchParams.status;
    const minUpVotes = searchParams.minUpVotes ? parseInt(searchParams.minUpVotes) : undefined;
    const sortBy = searchParams.sortBy ? (searchParams.sortBy.toLowerCase() as "newest" | "oldest" | "highest_rating" | "lowest_rating") : undefined;

    const reviewsResponse = await getAllReviewsAdmin({
      page,
      take,
      search,
      rating,
      minRating,
      maxRating,
      status,
      minUpVotes,
      sortBy
    });

    return (
      <AdminReviewsPage 
        reviews={reviewsResponse} 
        searchParams={searchParams}
      />
    );
  } catch (error) {
    console.error('Error fetching reviews:', error);
    redirect('/admin?error=failed-to-load-reviews');
  }
}