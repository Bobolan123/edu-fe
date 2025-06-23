"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ICartItem } from "../../../../types/entities";
import { useCurrency } from "@/context/CurrencyContext";
import { currencyService } from "@/service/currency";

interface CartDropdownProps {
  cartItems: ICartItem[];
}

const StyledBadge = styled(Badge)({
  "& .MuiBadge-badge": {
    right: -3,
    top: 3,
    backgroundColor: "#3f50b5",
    color: "white",
    fontWeight: "bold",
  },
});

export default function CartDropdown({ cartItems = [] }: CartDropdownProps) {
  const { currency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  // Canonical price in VND
  const totalVND = cartItems.reduce(
    (sum, item) => sum + (item?.price || 0),
    0
  );

  // State for converted values
  const [displayTotal, setDisplayTotal] = useState<number>(totalVND);
  const [convertedMap, setConvertedMap] = useState<Record<string, number>>({});

  useEffect(() => {
    let active = true;

    const convert = async () => {
      if (currency === "VND") {
        const vnMap: Record<string, number> = {};
        cartItems.forEach((item) => {
          if (item.id != null) {
            vnMap[item.id.toString()] = item.price || 0;
          }
        });
        if (active) {
          setConvertedMap(vnMap);
          setDisplayTotal(totalVND);
        }
        return;
      }

      try {
        const rates = await currencyService.getExchangeRates();
        const rate = rates["USD"];
        const usdMap: Record<string, number> = {};

        cartItems.forEach((item) => {
          if (item.id != null) {
            const raw = item.price || 0;
            usdMap[item.id.toString()] = Math.round(raw * rate * 100) / 100;
          }
        });

        if (active) {
          setConvertedMap(usdMap);
          setDisplayTotal(Math.round(totalVND * rate * 100) / 100);
        }
      } catch (error) {
        console.error("Failed to fetch exchange rates:", error);
      }
    };

    convert();

    return () => {
      active = false;
    };
  }, [currency, cartItems, totalVND]);

  const fmt = (amount: number) => currencyService.formatPrice(amount, currency);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="p-2">
        <StyledBadge badgeContent={cartItems.length} color="default">
          <ShoppingCart className="h-6 w-6" />
        </StyledBadge>
      </button>

      {isOpen && (
        <div className="absolute top-8 right-2 mt-2 w-[380px] bg-white border rounded-md shadow-lg z-50">
          <div className="max-h-[400px] overflow-y-auto">
            {cartItems.map((item) => (
              <Link key={item.id} href={`/course/${item.course?.id ?? ""}`}>
                <div className="p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex gap-3">
                    <Image
                      className="rounded-md flex-shrink-0"
                      src={item.course?.thumbnail_url || "/placeholder.svg"}
                      alt={item.course?.title || "Course"}
                      width={60}
                      height={60}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                        {item.course?.title || "Untitled"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.course?.instructor?.name || "Unknown Instructor"}
                      </p>
                      <span className="font-bold mt-1 inline-block">
                        {fmt(convertedMap[item.id?.toString() ?? ""] ?? 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="p-4 border-t">
            <div className="flex justify-between mb-4">
              <span className="font-bold">Total:</span>
              <span className="font-bold">{fmt(displayTotal)}</span>
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
