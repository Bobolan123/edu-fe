import { User } from "lucide-react";
import CartDropdown from "./CartDropdown";

const cartItems = [
    {
        id: 1,
        title: "Microservices with Node JS and React",
        instructor: "Stephen Grider",
        price: 379000,
        originalPrice: 2179000,
        image: "/placeholder.svg?height=120&width=120",
    },
    {
        id: 2,
        title: "MongoDB - The Complete Developer's Guide 2025",
        instructor: "Academind by Maximilian Sch...",
        price: 389000,
        originalPrice: 2209000,
        image: "/placeholder.svg?height=120&width=120",
    },
    {
        id: 3,
        title: "Node.js, Express, MongoDB & More: The Complete Bootcamp",
        instructor: "Jonas Schmedtmann",
        price: 459000,
        originalPrice: 2499000,
        image: "/placeholder.svg?height=120&width=120",
    },
    {
        id: 4,
        title: "The Complete Node.js Developer Course (3rd Edition)",
        instructor: "Andrew Mead, Rob Percival",
        price: 479000,
        originalPrice: 2239000,
        image: "/placeholder.svg?height=120&width=120",
    },
];
const Cart = () => {
    return (
        <>
            <CartDropdown cartItems={cartItems} />
        </>
    );
};

export default Cart;
