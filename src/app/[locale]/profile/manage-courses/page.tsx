import CoursesClient from "@/components/profile/CourseManagement/CoursesClient";
import {  IUser } from "../../../../../types/entities";
import { sendRequest } from "../../../../../ultils/api";
import { auth } from "@/auth";

export default async function TeacherCoursesPage() {
    const session = await auth();

    if (!session?.user) return null;

    const userRes = await sendRequest<IBackendRes<IUser>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/users/${session.user?.id}`,
        nextOption: {
            cache: "no-store",
            
        },
    });

    return <CoursesClient courses={userRes?.data?.courses || []} />;
}
