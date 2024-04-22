import { useDispatch, useSelector } from "react-redux";
import { fetchCart, fetchCartItems } from "../../../store/cart";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OrderSummary({ cartId, checkout }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartTotal = useSelector(state => state.cart.cartTotal);
    const sessionUser = useSelector(state => state.session.user);

    useEffect(() => {
        const runDispatches = async () => {
            await dispatch(fetchCart(cartId))
            await dispatch(fetchCartItems())
        }
        runDispatches();
    }, [dispatch, cartId])

    const estimatedTax = (total) => {
        let tax = (total * 0.0825).toFixed(2)
        return tax
    }

    const orderTotal = (subtotal, tax) => {
        return (subtotal + parseFloat(tax)).toFixed(2);
    }

    const handleCheckOut = () => {
        if (sessionUser) {
            navigate('/checkout')
        } else {
            navigate('/checkout/user')
        }
    }

    return (
        <div>
            <h2>Order Summary</h2>
            <div>
                {cartTotal &&
                    <div className="subTotalSummary">
                        <span>Subtotal:</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>}
                <div className="subTotalSummary">
                    <span>Shipping:</span>
                    <span>Free <i className="fa-regular fa-face-laugh-wink" /></span>
                </div>
                <div className="subTotalSummary">
                    <span>Estimated Tax:</span>
                    <span>${estimatedTax(cartTotal)}</span>
                </div>
                <div className="subTotalSummary">
                    <h2>Total:</h2>
                    <h2>${orderTotal(cartTotal, estimatedTax(cartTotal))}</h2>
                </div>
                {checkout ? (<div></div>) : (<><button style={{ width: "100%" }} onClick={handleCheckOut}>Check Out</button></>)}
            </div >
        </div >
    )
}

export default OrderSummary
