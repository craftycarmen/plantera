import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchOrderItems } from "../../store/order";
import ErrorHandling from "../ErrorHandling";
import './Checkout.css'
import { price } from "../../../utils";

function OrderConfirmation() {
    const { orderId } = useParams();
    const orderItems = useSelector(state => state.orders[orderId]?.orderItems?.OrderItems)
    const buyerId = useSelector(state => state.orders[orderId]?.orderItems?.Order?.buyerId)
    const order = useSelector(state => state.orders[orderId]?.orderItems?.Order);
    const payment = useSelector(state => state.orders[orderId]?.orderItems?.PaymentDetails);
    console.log("ORDER!!", order);
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    // const estimatedTax = (total) => {
    //     let tax = (total * 0.0825).toFixed(2)
    //     return tax.toLocaleString('en-US', { maximumFractionDigits: 2 })
    // }
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
                                    <div>{order.firstName} {order.lastName}</div>
                                    <div>{order.address}</div>
                                    <div>{order.city}, {order.state} {order.zipCode}</div>
                                </div>
                                <div>
                                    <h3>Payment Details</h3>
                                    <div><span style={{ fontWeight: "bold" }}>Payment Status:</span> {order.paymentStatus}</div>
                                    <div><span style={{ fontWeight: "bold" }}>Payment Method:</span> {payment.paymentMethod}</div>
                                    <div><span style={{ fontWeight: "bold" }}>Transaction ID:</span> {payment.transactionId}</div>
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
                                    <span>{price(order.subTotal / 100)}</span>
                                </div>
                                <div className="subTotalSummary">
                                    <span>Shipping:</span>
                                    <span>{price(order.shippingCost / 100)}</span>
                                </div>
                                <div className="subTotalSummary">
                                    <span>Taxes:</span>
                                    <span>{price(order.taxAmount / 100)}</span>
                                </div>
                                <div className="subTotalSummary">
                                    <h2>Total:</h2>
                                    <h2>{price(order.orderTotal / 100)}</h2>
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
