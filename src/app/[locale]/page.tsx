import HeroSection from "@/components/Home/HeroSection";
import CategoriesSection from "@/components/Home/CategoriesSection";
import FeaturedCoursesSection from "@/components/Home/FeaturedCoursesSection";
import LearningFeaturesSection from "@/components/Home/LearningFeaturesSection";
import TestimonialsSection from "@/components/Home/TestimonialsSection";
import { ICategory, ICourse } from "../../../types/entities";
import { sendRequest } from "../../../utils/api";

export default async function HomePage() {
    const courses = await sendRequest<IModelPaginate<ICourse>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses`,
        queryParams:{
            page:1,
            take:10
        },
        nextOption: {
            tags: "courses",
        },
    });
    const categories = await sendRequest<IModelPaginate<ICategory>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/categories`,
        queryParams:{
            page:1,
            take:10
        },
        nextOption: {
            tags: "categories",
        },
    });
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
