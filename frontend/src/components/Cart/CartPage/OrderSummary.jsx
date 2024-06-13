import { useDispatch, useSelector } from "react-redux";
import { fetchCart, fetchCartItems } from "../../../store/cart";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { price, plantName } from "../../../../utils";

function OrderSummary({ cartId, checkout }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
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

    const estimatedTax = (total) => {
        const tax = (total * 0.0825)
        return tax.toFixed(2).toLocaleString('en-US', { maximumFractionDigits: 2 })
    }

    const orderTotal = (subtotal, tax) => {
        const total = subtotal + parseFloat(tax)
        return price(total)
    }

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
                                        ${item.cartItemsTotal.toFixed(2)}</div>
                                    <div className="orderPot">{item.Listing?.potSize}&#34;</div>
                                </div>


                            </div>
                        ))}
                    </>
                ) : (<div></div>)}
                {cartTotal &&
                    <div className="subTotalSummary">
                        <span>Subtotal:</span>
                        <span>{price(cartTotal)}</span>
                    </div>}
                <div className="subTotalSummary">
                    <span>Shipping:</span>
                    <span>Free <i className="fa-regular fa-face-laugh-wink" /></span>
                </div>
                <div className="subTotalSummary">
                    <span>Estimated Taxes:</span>
                    <span>${estimatedTax(cartTotal)}</span>
                </div>
                <div className="subTotalSummary">
                    <h2>Total:</h2>
                    <h2>{orderTotal(cartTotal, estimatedTax(cartTotal))}</h2>
                </div>
                {checkout ? (<div></div>) : (<><button style={{ width: "100%" }} onClick={handleCheckOut}>Check Out</button></>)}
            </div >
        </div >
    )
}

export default OrderSummary
