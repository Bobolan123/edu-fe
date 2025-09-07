import { sendRequest } from "../../../utils/api";
import { ICart, ICartItem } from "../../../../types/entities";
import { auth } from "@/auth";
import Cart from "@/components/Cart/Cart";

export default async function CartPage() {
    const session = await auth();
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
        <div>
            <Cart cartItems={cart?.data?.cartItems } />
        </div>
    );
}
