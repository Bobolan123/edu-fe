import AdminLoginForm from "@/components/Admin/AdminLoginForm";
import Image from "next/image";

export default function AdminLogin() {
    return (
        <div className="min-h-screen flex items-center justify-center gap-10 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            {/* Logo Section - Similar to User Login */}
            <div className="hidden lg:block">
                <Image 
                    src="/logo.png" 
                    alt="Platform Logo" 
                    width={500} 
                    height={500}
                    className="max-w-md"
                />
            </div>
            
            {/* Login Form Section */}
            <div className="max-w-md w-full space-y-8">
                {/* Admin Header with Icon */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 relative">
                        Admin Portal
                        <div className="absolute top-0 right-24  bg-blue-600 rounded-full p-1.5">
                                <svg 
                                    className="w-4 h-4 text-white" 
                                    fill="currentColor" 
                                    viewBox="0 0 20 20"
                                >
                                    <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-.257-.257A6 6 0 1118 8zM10 2a8 8 0 100 16 8 8 0 000-16zm0 11a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                </svg>
                            </div>
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Secure access to platform management
                    </p>
                </div>

                {/* Security Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        <h3 className="text-sm font-medium text-blue-800">Secure Admin Access</h3>
                    </div>
                    <p className="mt-1 text-sm text-blue-700">
                        This portal is restricted to authorized administrators only. All login attempts are monitored and logged.
                    </p>
                </div>

                {/* Login Form */}
                <AdminLoginForm />

                {/* Footer */}
                <div className="text-center">
                    <p className="text-xs text-gray-500">
                        Authorized personnel only • Protected by enterprise security
                    </p>
                </div>
            </div>
        </div>
    );
}