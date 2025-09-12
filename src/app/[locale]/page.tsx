import HeroSection from "@/components/Home/HeroSection";
import CategoriesSection from "@/components/Home/CategoriesSection";
import FeaturedCoursesSection from "@/components/Home/FeaturedCoursesSection";
import LearningFeaturesSection from "@/components/Home/LearningFeaturesSection";
import TestimonialsSection from "@/components/Home/TestimonialsSection";
import { ICategory, ICourse } from "../../../types/entities";
import { sendRequest } from "../../utils/api";
import { getCourses } from "@/actions/coursesAction";
import { getCategories } from "@/actions/categoriesAction";

export default async function HomePage() {
    const courses = await getCourses({ 
        page: 1, 
        limit: 10, 
        excludeEnrolled: true 
    });
    const categories = await getCategories({ page: 1, limit: 10 });


    return (
        <div>
            <HeroSection />
            <CategoriesSection categories={categories?.data?.result}/>
            <FeaturedCoursesSection courses={courses?.data?.result}/>
            <LearningFeaturesSection />
            <TestimonialsSection />
        </div>
    );
}
