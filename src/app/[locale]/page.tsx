import HeroSection from '@/components/Home/HeroSection';
import CategoriesSection from '@/components/Home/CategoriesSection';
import FeaturedCoursesSection from '@/components/Home/FeaturedCoursesSection';
import LearningFeaturesSection from '@/components/Home/LearningFeaturesSection';
import TestimonialsSection from '@/components/Home/TestimonialsSection';

export default function HomePage() {
    return (
        <div>
            <HeroSection />
            <CategoriesSection />
            <FeaturedCoursesSection />
            <LearningFeaturesSection />
            <TestimonialsSection />
        </div>
    );
}
