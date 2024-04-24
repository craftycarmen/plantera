import '../Checkout.css';
import CheckoutLogin from './CheckoutLogin';
import CheckoutSignup from './CheckoutSignup';

function CheckoutUser() {
    const cartId = localStorage.getItem('cartId')
    return (
        <>
            <div>
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
