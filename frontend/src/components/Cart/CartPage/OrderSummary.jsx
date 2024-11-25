import { useDispatch, useSelector } from "react-redux";
import { fetchCart, fetchCartItems } from "../../../store/cart";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { price, plantName } from "../../../../utils";

function OrderSummary({ cartId, checkout }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartSummary = useSelector(state => state.cart.cartSummary);
    const cartTotal = useSelector(state => state.cart.cartTotal);
    const sessionUser = useSelector(state => state.session.user);
    const cartItems = useSelector(state => state.cart.cartItems)

    useEffect(() => {
        const runDispatches = async () => {
            await dispatch(fetchCart(cartId))
            await dispatch(fetchCartItems())
        }
        runDispatches();
    }, [dispatch, cartId])

    const sellerItems = (cartItems) => {
        return cartItems.some(item => {



            return item.Listing?.Seller?.id === sessionUser?.id;
        })
    }

    const handleCheckOut = () => {
        if (sessionUser) {
            const ownedItems = sellerItems(cartItems, sessionUser?.id)
            if (ownedItems) {
                alert('Sellers cannot purchase their own items. Please remove any item(s) that belong to you before checking out.');
                return;
            }
            navigate('/checkout')
        } else {
            navigate('/checkout/user')
        }
    }

    return (
        <div>
            <h2>Order Summary</h2>
            <div>
                {checkout ? (
                    <>
                        {cartItems && cartItems.map(item => (
                            <div className="orderSummaryItem" key={item.id}>
                                <div className="orderSummaryImgContainer">
                                    <img src={item.Listing?.ListingImages?.[0]?.url} />
                                    <span className="qtyCircle">
                                        <i className="fa-solid fa-circle" />

                                        <span className='cartQtyNum'>
                                            {item.cartQty}
                                        </span>

                                    </span>
                                </div>
                                <div className="orderListingInfo">
                                    <div style={{ fontWeight: '600' }}>
                                        {plantName(item.Listing?.plantName)}
                                    </div>
                                    <div className="orderSummaryItemSub">
                                        {price(item.cartItemsTotal)}</div>
                                    <div className="orderPot">{item.Listing?.potSize}&#34;</div>
                                </div>


                            </div>
                        ))}
                    </>
                ) : (<div></div>)}
                {cartTotal &&
                    <div className="subTotalSummary">
                        <span>Subtotal:</span>
                        <span>{price(cartSummary.cartTotal)}</span>
                    </div>}
                <div className="subTotalSummary">
                    <span>Shipping:</span>
                    <span>{price(cartSummary.shippingCost)}</span>
                </div>
                <div className="subTotalSummary">
                    <span>Taxes:</span>
                    <span>{price(cartSummary.taxAmount)}</span>
                </div>
                <div className="subTotalSummary">
                    <h2>Total:</h2>
                    <h2>{price(cartSummary.totalAmount)}</h2>
                </div>
                {checkout ? (<div></div>) : (<><button style={{ width: "100%", marginTop: "15px" }} onClick={handleCheckOut}>Check Out</button></>)}
            </div >
        </div >
    )
}

export default OrderSummary
