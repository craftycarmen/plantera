import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchCart, fetchCartItems, updateCartItemInCart, removeCartItem } from "../../../store/cart";
import './ShoppingCartPage.css';
import { Link } from "react-router-dom";
import OrderSummary from "./OrderSummary";
import { price } from "../../../../utils";

function ShoppingCartPage() {
    const dispatch = useDispatch();
    const cartId = localStorage.getItem("cartId")

    const [localCartQty, setLocalCartQty] = useState({});

    const cartItems = useSelector(state => state.cart.cartItems)
    const cartItemsLocalStorage = JSON.parse(localStorage.getItem('cartItems')) || [];

    cartItems.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    useEffect(() => {
        const runDispatches = async () => {
            await dispatch(fetchCart(cartId))
            await dispatch(fetchCartItems())
        }
        runDispatches();
    }, [dispatch, cartId])

    useEffect(() => {
        const initialQty = {};

        const localStoredCartItems = localStorage.getItem('cartItems');
        const storedCartItems = localStoredCartItems ? JSON.parse(localStoredCartItems) : [];
        // const storedCartItems = JSON.parse(localStorage.getItem('cartItems') || []);

        storedCartItems.forEach(item => {
            initialQty[item.id] = item.cartQty;
        });
        setLocalCartQty(initialQty)
    }, [])

    const calculateCartItemTotal = (item) => {
        if (item.Listing && item.Listing.price) {
            const total = item.Listing.price * (localCartQty && localCartQty[item.id] ? localCartQty[item.id] : item.cartQty);
            return price(total)
        }
        return 0;
    };

    const showListingPrice = (item) => {
        if (localCartQty && localCartQty[item.id] && localCartQty[item.id] > 1 || item.cartQty > 1) {
            const total = item.Listing?.price
            const totalFormatted = price(total)
            return `${totalFormatted} each`
        }
    }

    const qtyInput = (itemId) => {
        if (localCartQty && localCartQty[itemId]) {
            return localCartQty[itemId];
        } else {
            const item = cartItems.find(item => item.id === itemId);
            return item ? item.cartQty : 0;
        }
    };


    const addQty = async (itemId) => {
        const updatedQty = (localCartQty[itemId] || 0) + 1;
        const item = cartItems.find(item => item.id === itemId);
        if (item && updatedQty <= item.Listing.stockQty) {
            setLocalCartQty(prevCartQty => ({
                ...prevCartQty,
                [itemId]: updatedQty
            }));

            const updatedItem = {
                ...item,
                cartQty: updatedQty
            }

            await dispatch(updateCartItemInCart(cartId, updatedItem))

            const cartItemsLocalStorage = JSON.parse(localStorage.getItem('cartItems')) || [];

            const updatedCartItemsLocalStorage = cartItemsLocalStorage.map(item => {
                if (item.id === itemId) {
                    return {
                        ...item,
                        cartQty: updatedQty
                    }
                }
                return item
            }
            );

            localStorage.setItem('cartItems', JSON.stringify(updatedCartItemsLocalStorage));


            await dispatch(fetchCartItems(cartId))
            await dispatch(fetchCart(cartId))

        }
    }

    const removeQty = async (itemId) => {
        const updatedQty = (localCartQty[itemId] || 0) - 1;
        const item = cartItems.find(item => item.id === itemId);
        if (item && updatedQty > 0) {
            setLocalCartQty(prevCartQty => ({
                ...prevCartQty,
                [itemId]: updatedQty
            }));

            const updatedItem = {
                ...item,
                cartQty: updatedQty
            }

            await dispatch(updateCartItemInCart(cartId, updatedItem))
            const cartItemsLocalStorage = JSON.parse(localStorage.getItem('cartItems')) || [];

            const updatedCartItemsLocalStorage = cartItemsLocalStorage.map(item => {
                if (item.id === itemId) {
                    return {
                        ...item,
                        cartQty: updatedQty
                    }
                }
                return item
            }
            );

            localStorage.setItem('cartItems', JSON.stringify(updatedCartItemsLocalStorage));
            await dispatch(fetchCartItems(cartId))
            await dispatch(fetchCart(cartId))
        }
    }

    const handleRemoveItem = async (itemId) => {
        await dispatch(removeCartItem(cartId, itemId));
        const updatedCartItemsLocalStorage = cartItemsLocalStorage.filter(item => item.id !== itemId);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItemsLocalStorage));

        await dispatch(fetchCartItems());
        await dispatch(fetchCart(cartId))
    };



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
                                    <div className="smInfo" style={{ height: "175px" }}>
                                        <div className="shoppingCartRow">
                                            <div><h3><Link to={`/listings/${item.Listing?.id}`}>{item.Listing?.plantName}</Link></h3>
                                                <div>from {item.Listing?.Seller?.username}</div>
                                            </div>
                                            <div className="shoppingCartPrice">

                                                <h3>{calculateCartItemTotal(item)}</h3>
                                                <div>{showListingPrice(item)}
                                                </div>
                                            </div>
                                        </div>
                                        <div>Pot Size: {item.Listing?.potSize}&#34;</div>
                                        <div className="shoppingCartRow">
                                            <div className="quantityContainer">
                                                <span className="qtylabel">Quantity:</span>
                                                <div className="quantityInput">
                                                    <button
                                                        onClick={() => addQty(item.id)}
                                                        disabled={(item.Listing?.stockQty === 1 && qtyInput(item.id) === 1) || (qtyInput(item.id) === item.Listing?.stockQty)}
                                                    >
                                                        <span className="qtyPlusMinus">
                                                            <i className="fa-solid fa-plus" />
                                                        </span>
                                                    </button>
                                                    <input
                                                        className="inputBox"
                                                        type="number"
                                                        step="1"
                                                        min="1"
                                                        max={item.Listing?.stockQty}
                                                        value={qtyInput(item.id)}
                                                        name="cartQty"
                                                        readOnly
                                                    />
                                                    <button
                                                        onClick={() => removeQty(item.id)}
                                                        disabled={qtyInput(item.id) === 1}
                                                    >
                                                        <span className="qtyPlusMinus">
                                                            <i className="fa-solid fa-minus" />
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                            <span><i className="fa-solid fa-trash-can" style={{ cursor: "pointer" }} onClick={() => handleRemoveItem(item.id)} /></span>
                                        </div>
                                        <div className="stockLevelMsg">
                                            {item.Listing.stockQty === 1 && (<div >Only 1 in stock!</div>)}

                                            {qtyInput(item.id) === item.Listing?.stockQty && item.Listing?.stockQty !== 1 && (<div>Only {item.Listing?.stockQty} in stock!</div>)}
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
