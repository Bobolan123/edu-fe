import Cart from "@/components/Cart/Cart";
import { getCart } from "@/actions/cartActions";

export default async function CartPage() {
    const cart = await getCart();
    
    return (
        <div>
            <Cart cartItems={cart?.cartItems} />
        </div>
    );
}
