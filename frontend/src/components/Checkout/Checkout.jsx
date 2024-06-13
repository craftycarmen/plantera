import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import OrderSummary from "../Cart/CartPage/OrderSummary"
import { addOrder } from "../../store/order";
import { Link, useNavigate } from "react-router-dom";
import { clearCart } from "../../store/cart";
import ErrorHandling from "../ErrorHandling";

function Checkout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cart = useSelector(state => state.cart);

    const sessionUser = useSelector(state => state.session.user);
    const userId = sessionUser?.id;
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [paymentDetails, setPaymentDetails] = useState("");
    const [errors, setErrors] = useState({});

    const updateFirstName = (e) => setFirstName(e.target.value);
    const updateLastName = (e) => setLastName(e.target.value);
    const updateAddress = (e) => setAddress(e.target.value);
    const updateCity = (e) => setCity(e.target.value);
    const updateState = (e) => setState(e.target.value);
    const updateZipCode = (e) => setZipCode(e.target.value);
    const updatePaymentMethod = (e) => setPaymentMethod(e.target.value);
    const updatePaymentDetails = (e) => setPaymentDetails(e.target.value);

    const states = ['AL', 'AK', 'AZ', 'AR',
        'CA', 'CO', 'CT', 'DE', 'DC',
        'FL', 'GA', 'HI', 'ID', 'IL',
        'IN', 'IA', 'KS', 'KY', 'LA',
        'ME', 'MD', 'MA', 'MI', 'MN',
        'MS', 'MO', 'MT', 'NE', 'NV',
        'NH', 'NJ', 'NM', 'NY', 'NC',
        'ND', 'OH', 'OK', 'OR', 'PA',
        'RI', 'SC', 'SD', 'TN', 'TX',
        'UT', 'VT', 'VI', 'VA', 'WA',
        'WV', 'WI', 'WY']

    const cards = ['VIZZA', 'Plastercard', 'Americana Expresso']

    useEffect(() => {
        const errs = {};

        if (!firstName) errs.firstName = '';
        if (!lastName) errs.lastName = '';
        if (!address) errs.address = '';
        if (!city) errs.city = '';
        if (!state) errs.state = '';
        if (!zipCode) errs.zipCode = '';
        if (!paymentMethod) errs.paymentMethod = '';
        if (!paymentDetails) errs.paymentDetails = '';
        if (paymentDetails && isNaN(paymentDetails)) errs.paymentDetails = 'Payment details must be 4 digits';
        if (paymentDetails && paymentDetails.length !== 4) errs.paymentDetails = 'Payment details must be 4 digits';

        setErrors(errs);
    }, [firstName, lastName, address, city, state, zipCode, paymentMethod, paymentDetails])

    const cartTotal = (cart.cartTotal * 1.0825).toFixed(2);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({});

        const order = {
            buyerId: userId,
            firstName,
            lastName,
            address,
            city,
            state,
            zipCode,
            paymentMethod,
            paymentDetails,
            cartId: cart.cartId,
            subTotal: cart.cartTotal,
            orderTotal: Number(cartTotal)
        }

        let orderId = null;

        const res = await dispatch(addOrder(order))

        if (res) {

            orderId = res.order.id

            localStorage.removeItem('cartId');
            localStorage.removeItem('cartItems');
            dispatch(clearCart());
            // navigate('/orderconfirmation', { state: { orders: orderId } })
            navigate(`/order/${orderId}`)
        } else {
            console.error('Error creating order:', res);
            return;
        }
    }



    return (
        <>
            <h3><Link to="/">Home</Link>&nbsp;&nbsp;<i className="fa-solid fa-angle-right" style={{ fontSize: "small" }} />&nbsp;&nbsp;<Link to="/cart">Shopping Cart</Link>&nbsp;&nbsp;<i className="fa-solid fa-angle-right" style={{ fontSize: "small" }} />&nbsp;&nbsp;Checkout</h3>
            {cart.cartId === null && <div style={{ marginTop: "35px" }}>Your cart is empty!</div>}
            {!sessionUser && cart.cartId !== null && (<ErrorHandling />)}
            {sessionUser && cart.cartId !== null &&
                (<>
                    <div className="shoppingCartPageContainer">
                        <form onSubmit={handleSubmit}>
                            <h2>Shipping Address</h2 >
                            <div className='inputContainer'>
                                <input
                                    type='text'
                                    value={firstName}
                                    onChange={updateFirstName}
                                    placeholder=''
                                    id='firstName'
                                />
                                <label htmlFor='firstName' className='floating-label'>First Name*</label>
                            </div>
                            <div className='error'>{errors.firstName &&
                                <><i className="fa-solid fa-circle-exclamation" /> {errors.firstName}</>}</div>

                            <div className='inputContainer'>
                                <input
                                    type='text'
                                    value={lastName}
                                    onChange={updateLastName}
                                    placeholder=''
                                    id='firstName'
                                />
                                <label htmlFor='lastName' className='floating-label'>Last Name*</label>
                            </div>
                            <div className='error'>{errors.lastName &&
                                <><i className="fa-solid fa-circle-exclamation" /> {errors.lastName}</>}</div>

                            <div className='inputContainer'>
                                <input
                                    type='text'
                                    value={address}
                                    onChange={updateAddress}
                                    placeholder=''
                                    id='address'
                                />
                                <label htmlFor='address' className='floating-label'>*Address</label>
                            </div>
                            <div className='error'>{errors.address &&
                                <><i className="fa-solid fa-circle-exclamation" /> {errors.address}</>}</div>

                            <div className='inputContainer'>
                                <input
                                    type='text'
                                    value={city}
                                    onChange={updateCity}
                                    placeholder=''
                                    id='city'
                                />
                                <label htmlFor='city' className='floating-label'>*City</label>
                            </div>
                            <div className='error'>{errors.city &&
                                <><i className="fa-solid fa-circle-exclamation" /> {errors.city}</>}</div>

                            <div className='inputContainer'>
                                <select
                                    value={state}
                                    onChange={updateState}
                                    name="state"
                                >
                                    <option value="">-</option>
                                    {states.map(stateName => (
                                        <option
                                            key={stateName}
                                            value={stateName}
                                        >
                                            {stateName}
                                        </option>
                                    ))}
                                </select>
                                <label htmlFor='state' className='floating-label'>*State</label>
                            </div>
                            <div className='error'>{errors.state &&
                                <><i className="fa-solid fa-circle-exclamation" /> {errors.state}</>}</div>

                            <div className='inputContainer'>
                                <input
                                    type='text'
                                    value={zipCode}
                                    onChange={updateZipCode}
                                    placeholder=''
                                    id='zipCode'
                                />
                                <label htmlFor='zipCode' className='floating-label'>*ZIP Code</label>
                            </div>
                            <div className='error'>{errors.zipCode &&
                                <><i className="fa-solid fa-circle-exclamation" /> {errors.zipCode}</>}</div>

                            <br />
                            <h2>Payment Information</h2>

                            <div className='inputContainer'>
                                <select
                                    value={paymentMethod}
                                    onChange={updatePaymentMethod}
                                    name="paymentMethod"
                                >
                                    <option value="">-</option>
                                    {cards.map(card => (
                                        <option
                                            key={card}
                                            value={card}
                                        >
                                            {card}
                                        </option>
                                    ))}
                                </select>
                                <label htmlFor='paymentMethod' className='floating-label'>*Payment Method</label>
                            </div>
                            <div className='error'>{errors.paymentMethod &&
                                <><i className="fa-solid fa-circle-exclamation" /> {errors.paymentMethod}</>}</div>

                            <div className='inputContainer'>
                                <input
                                    type='text'
                                    value={paymentDetails}
                                    onChange={updatePaymentDetails}
                                    placeholder=''
                                    id='paymentDetails'
                                    minLength="4"
                                    maxLength="4"
                                />
                                <label htmlFor='paymentDetails' className='floating-label'>*Payment Details (4 digits)</label>
                            </div>
                            <div className='error'>{errors.paymentDetails &&
                                <><i className="fa-solid fa-circle-exclamation" /> {errors.paymentDetails}</>}</div>
                            <button
                                type="submit"
                                disabled={!!Object.values(errors).length}
                            >Place My Order</button>
                        </form >
                        <OrderSummary checkout={true} />
                    </div>
                </>

                )
            }
        </>
    )
}

export default Checkout
