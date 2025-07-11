import { auth } from "@/auth";
import { ICart, ICartItem, ICategory, ICourse } from "../../../types/entities";
import { sendRequest } from "../../../utils/api";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
    const session = await auth();
    try {
        
    } catch (error) {
        
    }
    const cart = await sendRequest<IBackendRes<ICart>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/cart`,
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        nextOption: {
            tags: "cart",
        },
    });
    return (
        <>
            <NavbarClient cart={cart?.data as ICart} />
        </>         
    );
}
