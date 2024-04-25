import '../Checkout.css';
import CheckoutLogin from './CheckoutLogin';
import CheckoutSignup from './CheckoutSignup';
import { Link } from 'react-router-dom';

function CheckoutUser() {
    const cartId = localStorage.getItem('cartId')
    return (
        <>
            <h3><Link to="/">Home</Link>&nbsp;&nbsp;<i className="fa-solid fa-angle-right" style={{ fontSize: "small" }} />&nbsp;&nbsp;<Link to="/cart">Shopping Cart</Link>&nbsp;&nbsp;<i className="fa-solid fa-angle-right" style={{ fontSize: "small" }} />&nbsp;&nbsp;Checkout</h3>
            <div style={{ marginTop: "35px", marginBottom: "35px" }}>
                Please log in or sign up to check out.
            </div>
            <div className='checkoutUserContainer'>
                <CheckoutLogin cartId={cartId} />

                <CheckoutSignup cartId={cartId} />
            </div>
        </>
    )
}

export default CheckoutUser
