import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart, loadCartItems, removeCartItem } from "../../../store/cart";
import './ShoppingCart.css';
import { useModal } from "../../../context/Modal";
import { price, plantName } from "../../../../utils";

function ShoppingCartModal({ cartId, navigate, updatedQty }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const cartItems = useSelector(state => state.cart?.cartItems)
    // const cartTotal = useSelector(state => state.cart?.cartTotal);
    // const cartItemsLocalStorage = JSON.parse(localStorage.getItem('cartItems')) || [];
    const sessionUser = useSelector(state => state.session.user);
    const userId = sessionUser?.id;
    const [loading, setLoading] = useState(true);
    // 


    // const calculateSubtotal = () => {
    //     const total = cartItems.reduce((total, item) => {
    //         return total + (item.cartQty * item.Listing?.price);
    //     }, 0);
    //     return total.toFixed(2).toLocaleString('en-US', { maximumFractionDigits: 2 });
    // };

    // const calculateItemSubTotal = (item) => {
    //     let total = item.cartQty * item.Listing?.price
    //     return total.toFixed(2).toLocaleString('en-US', { maximumFractionDigits: 2 });
    // }

    const calculateSubtotal = () => {
        const total = cartItems.reduce((total, item) => {
            return total + (item.cartQty * item.Listing?.price);
        }, 0);
        return price(total);
    };

    const calculateItemSubTotal = (item) => {
        let total = item.cartQty * item.Listing?.price;
        return price(total);
    };

    useEffect(() => {
        const runDispatches = async () => {

            setLoading(true);
            await dispatch(fetchCart(cartId)).then(() => setTimeout(() => {
                setLoading(false);
            }, 500))

        }
        runDispatches();
    }, [dispatch, cartId])



    const handleRemoveItem = async (itemId) => {
        await dispatch(removeCartItem(cartId, itemId));

        // const updatedCartItemsLocalStorage = cartItemsLocalStorage.filter(item => item.id !== itemId);
        // localStorage.setItem('cartItems', JSON.stringify(updatedCartItemsLocalStorage));
        setLoading(true)
        const updatedCartItems = cartItems.filter(item => item.id !== itemId)
        dispatch(loadCartItems())
        dispatch(fetchCart(cartId))
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        setLoading(false)
    };

    const sellerItems = (cartItems, userId) => {
        return cartItems.some(item => {



            return item.Listing?.Seller?.id === userId;
        });
    };

    const checkout = () => {

        if (sellerItems(cartItems, userId)) {
            alert('Sellers cannot purchase their own items. Please remove any item(s) that belong to you before checking out.')
        } else {
            closeModal()
            navigate('/cart')
        }

    }

    return (
        <section className="shoppingModal">
            <h1>Your Shopping Cart</h1>
            {loading && <div style={{ marginTop: "40px" }} className="dots smDots"></div>}
            {!loading && cartItems?.length > 0 && (
                <div style={{ marginTop: "35px" }}>
                    {cartItems.map((item) => (

                        <div key={item.id} className="shoppingModalListing">
                            <div className="shoppingModalImgContainer">
                                <img
                                    src={item.Listing?.ListingImages?.[0]?.url}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        closeModal();
                                        navigate(`/listings/${item.Listing.id}`);
                                    }}
                                />
                            </div>
                            <div className="smInfo">
                                <div className="shoppingModalRow" style={{ marginTop: "-5px" }}>
                                    <h3>{plantName(item.Listing?.plantName)}</h3>
                                    <h3>{calculateItemSubTotal(item)}</h3>
                                </div>
                                <div>Pot Size: {item.Listing?.potSize}&#34;</div>
                                <div className="shoppingModalRow">
                                    <span>Quantity: {(item && updatedQty[item.id]) || (item && item.cartQty)}</span>

                                    <span><i className="fa-solid fa-trash-can" style={{ cursor: "pointer" }} onClick={() => handleRemoveItem(item.id)} /></span>
                                </div>
                            </div>
                        </div>
                    ))
                    }
                    <div className="subTotal">
                        <h3>Subtotal:</h3>
                        <h3>{calculateSubtotal()}</h3>
                    </div>
                    <div className="smButtons">
                        <button onClick={closeModal}>Continue Shopping</button>
                        <button onClick={checkout}>View Cart & Check Out</button>
                    </div>
                </div>
            )
            }
            {!loading && cartItems?.length === 0 &&
                (
                    <div style={{ marginTop: "35px" }}>Your cart is empty!</div>
                )
            }
        </section >
    )

}

export default ShoppingCartModal;
