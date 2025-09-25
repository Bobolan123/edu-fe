import CreateCoursePage from "@/components/My-courses/Create/CreateCourse";
import { getCategories } from "@/actions/categoriesAction";

export default async function CreateACoursePage() {
    const categories = await getCategories()
  return <CreateCoursePage categories={categories?.data?.result ?? []} />
}
