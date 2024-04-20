import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

function OrderConfirmation() {
    const { state } = useLocation();
    const orderId = state ? state.orders : null;
    const order = useSelector(state => state.orders[orderId]);

    console.log("ORDERCONFIRMATIONID", order);
    return (
        <>
            <h1>Thank you for order #{orderId}</h1>
        </>
    )
}

export default OrderConfirmation
