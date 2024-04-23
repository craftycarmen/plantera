import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchOrderItems } from "../../store/order";
import ErrorHandling from "../ErrorHandling";

function OrderConfirmation() {
    const { orderId } = useParams();
    const orderItems = useSelector(state => state.orders[orderId]?.orderItems?.OrderItems)
    const buyerId = useSelector(state => state.orders[orderId]?.orderItems?.Order.buyerId)
    const dispatch = useDispatch();
    const sessionUser = (state => state.session.user);

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
            {!sessionUser.id &&
                <ErrorHandling />}
            {sessionUser.id !== buyerId &&
                <>This isn't your order!</>}
            {sessionUser.id === buyerId &&
                <>
                    <h1>Thank you for order #{orderId} </h1>
                    {orderItems && orderItems.map(item => (
                        <div key={item.id}>
                            {item.Listing?.plantName} x {item.cartQty}
                        </div>
                    ))}
                </>
            }
        </>
    )
}

export default OrderConfirmation
