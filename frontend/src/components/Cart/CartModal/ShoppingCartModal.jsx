import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart, fetchCartItems, removeCartItem } from "../../../store/cart";
import './ShoppingCart.css';
import { useModal } from "../../../context/Modal";

function ShoppingCartModal({ cartId, navigate, updatedQty }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const cartItems = useSelector(state => state.cart?.cartItems)
    // const cartTotal = useSelector(state => state.cart?.cartTotal);
    const cartItemsLocalStorage = JSON.parse(localStorage.getItem('cartItems')) || [];
    const sessionUser = useSelector(state => state.session.user);
    const userId = sessionUser?.id;
    // console.log("CARTTOTALMODAL", cartTotal);
    console.log("CARTITEMSMODAL", cartItems);

    const calculateSubtotal = () => {
        const total = cartItems.reduce((total, item) => {
            return total + (item.cartQty * item.Listing?.price);
        }, 0);
        return total.toFixed(2).toLocaleString('en-US', { maximumFractionDigits: 2 });
    };

    const calculateItemSubTotal = (item) => {
        let total = item.cartQty * item.Listing?.price
        return total.toFixed(2).toLocaleString('en-US', { maximumFractionDigits: 2 });
    }

    useEffect(() => {
        const runDispatches = async () => {
            await dispatch(fetchCart(cartId))
        }
        runDispatches();
    }, [dispatch, cartId])

    console.log("Updated Quantity in ShoppingCartModal:", updatedQty);

    const handleRemoveItem = async (itemId) => {
        await dispatch(removeCartItem(cartId, itemId));

        const updatedCartItemsLocalStorage = cartItemsLocalStorage.filter(item => item.id !== itemId);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItemsLocalStorage));

        await dispatch(fetchCartItems());
        await dispatch(fetchCart(cartId))
    };

    const sellerItems = (cartItems, userId) => {
        return cartItems.some(item => {
            console.log("Item:", item);
            console.log("User ID:", userId);
            console.log("Seller ID:", item.Listing?.Seller?.id);
            return item.Listing?.Seller?.id === userId;
        });
    };

    const checkout = () => {

        if (sellerItems(cartItems, userId)) {
            alert('Please remove item(s) that belong to you before checking out.')
        } else {
            closeModal()
            navigate('/cart')
        }

    }

    return (
        <section className="shoppingModal">
            <h1>Your Shopping Cart</h1>
            {cartItems?.length > 0 && (
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
                                <div className="shoppingModalRow">
                                    <h3>{item.Listing?.plantName}</h3>
                                    {/* <h3>${item.cartItemsTotal}</h3> */}
                                    <h3>${calculateItemSubTotal(item)}</h3>
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
                        <h3>${calculateSubtotal()}</h3>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={closeModal}>Continue Shopping</button>
                        <button style={{ width: '100%', flexWrap: "nowrap" }} onClick={checkout}>View Cart & Check Out</button>
                    </div>
                </div>
            )
            }
            {cartItems?.length === 0 &&
                (
                    <div style={{ marginTop: "35px" }}>Your cart is empty!</div>
                )
            }
        </section >
    )

}

export default ShoppingCartModal;
