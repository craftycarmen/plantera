import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useCartModal } from "../../../context/CartModal/Modal";
import { fetchCart } from "../../../store/cart";
import './ShoppingCart.css';

function ShoppingCartModal({ listing, cartQty, cartId }) {
    const closeModal = useCartModal();
    const dispatch = useDispatch();

    const cartItems = useSelector(state => state.cart.cartItems)
    console.log(cartItems);
    useEffect(() => {
        dispatch(fetchCart(cartId))
    }, [dispatch, cartId])

    return (
        <section className="shoppingModal">
            <h1>Shopping Cart</h1>
            {cartItems && cartItems.length === 0 &&
                (
                    <div>Your cart is empty!</div>
                )
            }

            {cartItems && cartItems.length > 0 && (
                <div>
                    {cartItems.map((item) => (

                        <div key={item.id} className="shoppingModalListing">
                            <div className="shoppingModalImgContainer"><img src={item.Listing?.ListingImages?.[0]?.url} /></div>
                            <div className="smInfo">
                                <div className="smQtyPrice">
                                    <h3>{item.Listing?.plantName}</h3>
                                    <h3>${item.Listing?.price}</h3>
                                </div>
                                <div>Pot Size: {item.Listing?.potSize} 8.5" *</div>
                                <span>Quantity: {item.cartQty}</span>

                            </div>
                        </div>
                    ))
                    }
                    <div>Subtotal: </div>
                    <button>Checkout</button>
                </div>
            )}
        </section >
    )

}

export default ShoppingCartModal;
