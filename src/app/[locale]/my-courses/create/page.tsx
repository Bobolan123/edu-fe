import CreateCoursePage from "@/components/My-learning/Create/CreateCourse";
import { getCategories } from "@/actions/categories";

export default async function CreateACoursePage() {
    const categories = await getCategories()
  return <CreateCoursePage categories={categories?.data?.result ?? []} />
}
