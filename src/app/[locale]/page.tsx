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

    const a = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/auth/login`,{
        method:"POST",
        body: JSON.stringify({
            email:"bobolan12312@gmail.com",
            password:"123",
        }),
        credentials:'include'
    })

    console.log(await a.json())
    const res = await sendRequest<IBackendRes<ILogin>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/auth/login`,
        body: {
            email:"bobolan12312@gmail.com",
            password:"123",
        },
        useCredentials:true
    });
    console.log(res)
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
