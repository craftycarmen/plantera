import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchOrderItems } from "../../store/order";
import ErrorHandling from "../ErrorHandling";
import OrderSummary from "../Cart/CartPage/OrderSummary";
import './Checkout.css'

function OrderConfirmation() {
    const { orderId } = useParams();
    const orderItems = useSelector(state => state.orders[orderId]?.orderItems?.OrderItems)
    const buyerId = useSelector(state => state.orders[orderId]?.orderItems?.Order?.buyerId)
    const order = useSelector(state => state.orders[orderId]?.orderItems?.Order)
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);

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
    console.log("ORDERITEMS", order);
    console.log(sessionUser.id);
    return (
        <>
            {!sessionUser.id &&
                <ErrorHandling />}
            {sessionUser.id !== buyerId &&
                <>This isn&apos;t your order!</>}
            {sessionUser.id === buyerId &&
                <>

                    <h1>Thank you for your order! <i className="fa-regular fa-hand-peace" /></h1>
                    <div style={{ marginBottom: "20px" }}>We apreciate your support! We've emailed you this order confirmation.
                    </div>
                    <div className="thankYouContainer">
                        <div>
                            <h2>Order Details</h2>
                            <div className="orderDetails">
                                <div>
                                    <div>Order: #{orderId}</div>
                                    <div>Order Status: {order.orderStatus}</div>
                                </div>
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
                        <OrderSummary orderConfirmation={true} />
                    </div>
                </>
            }
        </>
    )
}

export default OrderConfirmation
