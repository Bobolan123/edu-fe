import { auth } from "@/auth";
import { getCurrentUserProfile } from "@/actions/userActions";
import { redirect } from "next/navigation";
import ProfilePageClient from "./ProfilePageClient";

export default async function ProfilePage() {
    const session = await auth();
    
    if (!session?.user) {
        redirect("/login");
    }

    let userProfile;
    try {
        userProfile = await getCurrentUserProfile();
    } catch (error) {
        console.error("Failed to fetch user profile:", error);
        // Fallback to session user data
        userProfile = {
            id: parseInt(session.user.id),
            name: session.user.name,
            email: session.user.email,
            avatar_url: session.user.avatar_url || null,
            bio: null,
            date_joined: new Date(),
            deleted_at: null,
            googleId: null,
            password: null,
            has_active_subscription: false,
            otp: null,
            otpExpired: null,
            isActive: true,
            role: null,
            courses: [],
            enrollments: [],
            subscriptions: [],
            certifications: [],
            reviews: [],
            quiz_submissions: []
        };
    }

    return <ProfilePageClient user={userProfile} />;
}