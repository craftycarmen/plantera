import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { fetchCart, fetchCartItems, removeCartItem } from "../../../store/cart";
import './ShoppingCart.css';
import { Link } from "react-router-dom";

function ShoppingCartModal({ listing, cartQty, cartId }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    // const cart = useSelector(state => state.cart)
    const cartItems = useSelector(state => state.cart.cartItems)
    const cartTotal = useSelector(state => state.cart.cartTotal);

    console.log("CARTUSESELECTOR", cartItems);
    useEffect(() => {
        const runDispatches = async () => {
            await dispatch(fetchCart(cartId))
        }
        runDispatches();
    }, [dispatch, cartId])

    const handleRemoveItem = async (itemId) => {
        await dispatch(removeCartItem(cartId, itemId));
        dispatch(fetchCartItems());
    };

    return (
        <section className="shoppingModal">
            <h1>Your Shopping Cart</h1>
            {cartItems && cartItems.length === 0 &&
                (
                    <div style={{ marginTop: "35px" }}>Your cart is empty!</div>
                )
            }

            {cartItems && cartItems.length > 0 && (
                <div style={{ marginTop: "35px" }}>
                    {cartItems.map((item) => (

                        <div key={item.id} className="shoppingModalListing">
                            <div className="shoppingModalImgContainer">

                                <img src={item.Listing?.ListingImages?.[0]?.url} />

                            </div>
                            <div className="smInfo">
                                <div className="shoppigModalRow">
                                    <h3>{item.Listing?.plantName}</h3>
                                    <h3>${item.Listing?.price}</h3>
                                </div>
                                <div>Pot Size: {item.Listing?.potSize} 8.5" *</div>
                                <div className="shoppigModalRow">
                                    <span>Quantity: {item.cartQty}</span>
                                    <span><i className="fa-solid fa-trash-can" style={{ cursor: "pointer" }} onClick={() => handleRemoveItem(item.id)} /></span>
                                </div>
                            </div>
                        </div>
                    ))
                    }
                    {cartTotal && <div className="subTotal">
                        <h3>Subtotal:</h3>
                        <h3>${cartTotal}</h3>
                    </div>}

                    <button style={{ width: "100%" }}>Checkout</button>

                </div>
            )
            }
        </section >
    )

}

export default ShoppingCartModal;
