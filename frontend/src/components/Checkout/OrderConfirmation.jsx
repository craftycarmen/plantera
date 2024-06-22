import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchOrderItems } from "../../store/order";
import ErrorHandling from "../ErrorHandling";
import './Checkout.css'

function OrderConfirmation() {
    const { orderId } = useParams();
    const orderItems = useSelector(state => state.orders[orderId]?.orderItems?.OrderItems)
    const buyerId = useSelector(state => state.orders[orderId]?.orderItems?.Order?.buyerId)
    const order = useSelector(state => state.orders[orderId]?.orderItems?.Order)
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);

    const estimatedTax = (total) => {
        let tax = (total * 0.0825).toFixed(2)
        return tax.toLocaleString('en-US', { maximumFractionDigits: 2 })
    }

    useEffect(() => {
        const runDispatches = async () => {
            try {
                await dispatch(fetchOrderItems(orderId));
            } catch (error) {
                console.error("Error fetching order:", error);
            }
        };
        runDispatches();
    }, [dispatch, orderId]);


    return (
        <>
            {!sessionUser?.id &&
                <ErrorHandling />}
            {sessionUser && sessionUser?.id !== buyerId &&
                <>This isn&apos;t your order!</>}
            {sessionUser?.id === buyerId && order &&
                <>

                    <h1 style={{ marginBottom: "20px" }}>Thank you for your order! <i className="fa-regular fa-hand-peace" /></h1>
                    <div className="thankYouContainer">
                        <div>
                            <h2 style={{ marginBottom: "20px" }}>Order #{orderId}</h2>
                            <div className="orderDetails">
                                <div>
                                    <h3>Shipping Details</h3>
                                    <div>{sessionUser.firstName} {sessionUser.lastName}</div>
                                    <div>{order.address}</div>
                                    <div>{order.city}, {order.state} {order.zipCode}</div>
                                </div>
                                <div>
                                    <h3>Payment Details</h3>
                                    <div>{order.paymentMethod}</div>
                                    <div>x{order.paymentDetails}</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2>Order Summary</h2>
                            <div>
                                {orderItems && orderItems.map(item => (
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
                                        <div>
                                            <div style={{ fontWeight: '600' }}>
                                                {item.Listing?.plantName}
                                            </div>
                                            <div>{item.Listing?.potSize}&#34;</div>
                                        </div>

                                        <span className="orderSummaryItemSub">
                                            {/* ${item.orderItemsTotal.toFixed(2)} */}
                                        </span>

                                    </div>
                                ))}

                                <div className="subTotalSummary">
                                    <span>Subtotal:</span>
                                    <span>${order.subTotal?.toFixed(2)}</span>
                                </div>
                                <div className="subTotalSummary">
                                    <span>Shipping:</span>
                                    <span>Free <i className="fa-regular fa-face-laugh-wink" /></span>
                                </div>
                                <div className="subTotalSummary">
                                    <span>Taxes:</span>
                                    <span>${estimatedTax(order.orderTotal)}</span>
                                </div>
                                <div className="subTotalSummary">
                                    <h2>Total:</h2>
                                    <h2>${order.orderTotal.toFixed(2)}</h2>
                                </div>
                            </div >
                        </div>
                    </div>

                </>
            }
        </>
    )

}

export default OrderConfirmation
