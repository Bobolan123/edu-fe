import { auth } from "@/auth";
import Checkout from "@/components/Checkout/Checkout";
import { sendRequest } from "../../../../utils/api";
import { ICart, ICartItem } from "../../../../types/entities";

export default async function CheckoutPage() {
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

    if (!cart?.data?.id) {
        return <div>Cart not found or is empty.</div>;
    }

    return (
        <Checkout
            cartItems={cart?.data?.cartItems as ICartItem[]}
            cartId={+cart.data.id}
        />
    );
}
