import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { addCart, addItemToCart, fetchCart, fetchCartItems, updateCartItemInCart } from "../../../store/cart";
import './ShoppingCartPage.css';

function ShoppingCartPage() {
    const dispatch = useDispatch();
    const cartId = localStorage.getItem("cartId")
    // const cart = useSelector(state => (state.cart[cartId]))
    const cartItems = useSelector(state => state.cart.cartItems)
    const cartTotal = useSelector(state => state.cart.cartTotal);
    console.log(cartItems);
    useEffect(() => {
        const runDispatches = async () => {
            await dispatch(fetchCart(cartId))
        }
        runDispatches();
    }, [dispatch, cartId])

    const handleRemoveItem = async (itemId) => {
        await dispatch(removeCartItem(cartId, itemId));
        dispatch(fetchCartItems());
        dispatch(fetchCart(cartId))
    };

    let [cartQty, setCartQty] = useState(1);

    let addQty = (e) => {
        e.preventDefault();
        if (cartQty >= 1 && cartQty < stockQty) {
            setCartQty(prevCartQty => prevCartQty + 1)
        }
    }

    let removeQty = (e) => {
        e.preventDefault();
        if (cartQty > 1) {
            setCartQty(prevCartQty => prevCartQty - 1)
            if (error) {
                setError("");
            }
        }
    }

    return (
        <>
            <h1>Your Shopping Cart</h1>
            {cartItems && cartItems.length === 0 &&
                (
                    <div style={{ marginTop: "35px" }}>Your cart is empty!</div>
                )
            }

            {cartItems && cartItems.length > 0 && (
                <div className="shoppingCartPageContainer">
                    <div>
                        <form>
                            {cartItems.map((item) => (

                                <div key={item.id} className="shoppingCartListing">
                                    <div className="shoppingCartImgContainer">
                                        <img
                                            src={item.Listing?.ListingImages?.[0]?.url}
                                        />
                                    </div>
                                    <div className="smInfo">
                                        <div className="shoppingCartRow">
                                            <h2>{item.Listing?.plantName}</h2>
                                            <h2>${item.cartItemsTotal}</h2>
                                        </div>
                                        <div>Pot Size: {item.Listing?.potSize}&#34;</div>
                                        <div className="shoppingCartRow">
                                            <div className="quantityContainer">
                                                <span className="qtylabel">Quantity:</span>
                                                <div className="quantityInput">
                                                    <button onClick={addQty}><i className="fa-solid fa-plus" style={{ fontSize: "x-small", color: "#E38251" }} /></button>
                                                    <input
                                                        className="inputBox"
                                                        type="number" step="1"
                                                        min="1"
                                                        max={item.Listing?.stockQty}
                                                        value={cartQty}
                                                        name="cartQty"
                                                    // onChange={handleQty} 
                                                    />

                                                    <button onClick={removeQty}><i className="fa-solid fa-minus" style={{ fontSize: "x-small", color: "#E38251" }} /></button>


                                                </div>
                                                <span><i className="fa-solid fa-trash-can" style={{ cursor: "pointer", marginLeft: "10px" }} onClick={() => handleRemoveItem(item.id)} /></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                            }

                        </form>
                    </div>
                    <div>Summary</div>
                </div>
            )
            }
        </>
    )
}

export default ShoppingCartPage
