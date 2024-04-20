import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchCart, fetchCartItems, updateCartItemInCart, removeCartItem } from "../../../store/cart";
import './ShoppingCartPage.css';
import { Link } from "react-router-dom";
import OrderSummary from "./OrderSummary";

function ShoppingCartPage() {
    const dispatch = useDispatch();
    const cartId = localStorage.getItem("cartId")
    const cartItems = useSelector(state => state.cart.cartItems)
    // const cartTotal = useSelector(state => state.cart.cartTotal);
    const [localCartQty, setLocalCartQty] = useState({});

    useEffect(() => {
        const runDispatches = async () => {
            await dispatch(fetchCart(cartId))
            await dispatch(fetchCartItems())
        }
        runDispatches();
    }, [dispatch, cartId])

    useEffect(() => {
        const initialCartQty = {};
        cartItems.forEach(item => {
            const storedQty = localStorage.getItem(`cartQty_${item.id}`);
            initialCartQty[item.id] = storedQty ? parseInt(storedQty) : item.cartQty;
        });
        setLocalCartQty(initialCartQty)
    }, [cartItems])

    const calculateCartItemTotal = (item) => {
        if (item.Listing && item.Listing.price) {
            return item.Listing.price * localCartQty[item.id];
        }
        return 0;
    };

    const showListingPrice = (item) => {
        if (localCartQty[item.id] > 1) {
            return `$${item.Listing.price} each`
        }
    }

    // const addQty = (itemId) => {
    //     const updatedQty = localCartQty[itemId] + 1;
    //     if (updatedQty <= cartItems.find(item => item.id === itemId).Listing.stockQty) {
    //         setLocalCartQty(prevCartQty => ({
    //             ...prevCartQty,
    //             [itemId]: updatedQty
    //         }));
    // }

    const addQty = async (itemId) => {
        const updatedQty = localCartQty[itemId] + 1;
        const item = cartItems.find(item => item.id === itemId);
        if (updatedQty <= item.Listing.stockQty) {
            setLocalCartQty(prevCartQty => ({
                ...prevCartQty,
                [itemId]: updatedQty
            }));

            const updatedItem = {
                ...item,
                cartQty: updatedQty
            }

            await dispatch(updateCartItemInCart(cartId, updatedItem))
            await dispatch(fetchCartItems(cartId))
            await dispatch(fetchCart(cartId))
        }
    }

    const removeQty = async (itemId) => {
        const updatedQty = localCartQty[itemId] - 1;
        const item = cartItems.find(item => item.id === itemId);
        if (localCartQty[itemId] > 1) {
            setLocalCartQty(prevCartQty => ({
                ...prevCartQty,
                [itemId]: updatedQty
            }));

            const updatedItem = {
                ...item,
                cartQty: updatedQty
            }

            await dispatch(updateCartItemInCart(cartId, updatedItem))
            await dispatch(fetchCartItems(cartId))
            await dispatch(fetchCart(cartId))
        }
    }

    const handleRemoveItem = async (itemId) => {
        await dispatch(removeCartItem(cartId, itemId));
        dispatch(fetchCartItems());
        dispatch(fetchCart(cartId))
    };

    // const removeQty = (itemId) => {
    //     if (localCartQty[itemId] > 1) {
    //         const updatedQty = localCartQty[itemId] - 1;
    //         setLocalCartQty(prevCartQty => ({
    //             ...prevCartQty,
    //             [itemId]: updatedQty
    //         }));
    //     }
    // };

    // const handleUpdateCart = async () => {
    //     await Promise.all(cartItems.map(async (item) => {
    //         const updatedItem = {
    //             ...item,
    //             cartQty: localCartQty[item.id]
    //         };
    //         await dispatch(updateCartItemInCart(cartId, updatedItem));
    //     }));

    //     await dispatch(fetchCartItems());
    //     await dispatch(fetchCart(cartId))
    // }

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
                        <div>
                            {cartItems.map((item) => (
                                <div key={item.id} className="shoppingCartListing">
                                    <div className="shoppingCartImgContainer">
                                        <Link to={`/listings/${item.Listing?.id}`}><img src={item.Listing?.ListingImages?.[0]?.url} alt={item.Listing?.plantName} /></Link>
                                    </div>
                                    <div className="smInfo">
                                        <div className="shoppingCartRow">
                                            <h3>{item.Listing?.plantName}</h3>
                                            <div className="shoppingCartPrice">

                                                <h3>${calculateCartItemTotal(item)}</h3>
                                                <div>{showListingPrice(item)}
                                                </div>
                                            </div>
                                        </div>
                                        <div>Pot Size: {item.Listing?.potSize}&#34;</div>
                                        <div className="shoppingCartRow">
                                            <div className="quantityContainer">
                                                <span className="qtylabel">Quantity:</span>
                                                <div className="quantityInput">
                                                    <button onClick={() => addQty(item.id)}><i className="fa-solid fa-plus" style={{ fontSize: "x-small", color: "#E38251" }} /></button>
                                                    <input
                                                        className="inputBox"
                                                        type="number"
                                                        step="1"
                                                        min="1"
                                                        max={item.Listing?.stockQty}
                                                        value={localCartQty[item.id]}
                                                        name="cartQty"
                                                        readOnly
                                                    />
                                                    <button onClick={() => removeQty(item.id)}><i className="fa-solid fa-minus" style={{ fontSize: "x-small", color: "#E38251" }} /></button>
                                                </div>
                                            </div>
                                            <span><i className="fa-solid fa-trash-can" style={{ cursor: "pointer" }} onClick={() => handleRemoveItem(item.id)} /></span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <OrderSummary cartId={cartId} />
                </div>
            )}
        </>
    )
}

export default ShoppingCartPage;
