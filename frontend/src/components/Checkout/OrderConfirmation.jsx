import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchOrderItems } from "../../store/order";

function OrderConfirmation() {
    const { orderId } = useParams();
    const orderItems = useSelector(state => state.orders[orderId]?.orderItems)
    const dispatch = useDispatch();

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

    console.log("ORDERITEMS", orderItems);
    return (
        <>
            <h1>Thank you for order {orderId} </h1>
            {orderItems && orderItems.map(item => (
                <div key={item.id}>
                    {item.Listing?.plantName}
                </div>
            ))}
        </>
    )
}

export default OrderConfirmation
