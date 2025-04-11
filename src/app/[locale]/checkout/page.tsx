import { Metadata } from 'next';
import OrderSummary from '@/components/Checkout/OrderSummary';
import CheckoutForm from '@/components/Checkout/CheckoutForm';

export const metadata: Metadata = {
  title: 'Checkout - MindfulMaze',
  description: 'Complete your purchase and start learning',
};

// Mock data for the course
const mockCourseData = {
  id: 1,
  title: "Complete Web Development Bootcamp",
  originalPrice: 1349000,
  discountPercentage: 78,
  discountedPrice: 299000,
};

export default async function CheckoutPage() {
  // In a real app, you would fetch this data from your API
  const courseData = mockCourseData;
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CheckoutForm courseId={courseData.id} amount={courseData.discountedPrice} />
          </div>
          <div className="lg:col-span-1">
            <OrderSummary 
              originalPrice={courseData.originalPrice}
              discountPercentage={courseData.discountPercentage}
              discountedPrice={courseData.discountedPrice}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 