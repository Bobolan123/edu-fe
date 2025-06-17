"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ICartItem } from "../../../../types/entities";

interface CartDropdownProps {
    cartItems: ICartItem[];
}

// Styled MUI Badge component
const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
        right: -3,
        top: 3,
        backgroundColor: "#3f50b5",
        color: "white",
        fontWeight: "bold",
    },
}));

export default function CartDropdown({ cartItems }: CartDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    const totalPrice = cartItems.reduce((sum, item) => sum + (item?.price || 0), 0);
    const totalOriginalPrice = cartItems.reduce(
        (sum, item) => sum + (item?.course?.price || 0),
        0
    );

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button className="p-2">
                <StyledBadge badgeContent={cartItems?.length || 0} color="default">
                    <ShoppingCart className="h-6 w-6" />
                </StyledBadge>
            </button>

            {isOpen && (
                <div className="absolute top-8 right-2 mt-2 w-[380px] bg-white border rounded-md shadow-lg z-50">
                    <div className="max-h-[400px] overflow-y-auto">
                        {cartItems?.map((item) => (
                            <Link
                                key={item?.id}
                                href={`/course/${item?.course?.id ?? ""}`}
                            >
                                <div className="p-4 border-b hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="flex gap-3">
                                        <div className="flex-shrink-0">
                                            <Image
                                                src={item?.course?.thumbnail_url || "/placeholder.svg"}
                                                alt={item?.course?.title || "Course"}
                                                width={60}
                                                height={60}
                                                className="rounded-md"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                                                {item?.course?.title || "Untitled"}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {item?.course?.instructor?.name || "Unknown Instructor"}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="font-bold">
                                                    đ{item?.price?.toLocaleString?.() || "0"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="p-4 border-t">
                        <div className="flex justify-between mb-4">
                            <span className="font-bold">Total:</span>
                            <div>
                                <span className="font-bold">
                                    đ{totalPrice.toLocaleString()}
                                </span>
                            </div>
                        </div>
                        <Link href="/cart">
                            <button className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
                                Go to cart
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
