import Checkout from "@/components/Checkout/Checkout";
import { getCart } from "@/actions/cartActions";
import { ICartItem } from "../../../../types/entities";

export default async function CheckoutPage() {
    const cart = await getCart();

    if (!cart?.id) {
        return <div>Cart not found or is empty.</div>;
    }

    return (
        <Checkout
            cartItems={cart?.cartItems as ICartItem[]}
            cartId={String(cart.id)}
        />
    );
}
