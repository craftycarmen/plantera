import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import OrderSummary from "../Cart/CartPage/OrderSummary"
import { addOrder } from "../../store/order";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../../store/cart";

function Checkout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cart = useSelector(state => state.cart);

    const sessionUser = useSelector(state => state.session.user);
    console.log(cart);
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

    console.log(paymentDetails.length)
    const cartTotal = (cart.cartTotal * 1.0825).toFixed(2);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({});

        const order = {
            buyerId: sessionUser.id,
            firstName,
            lastName,
            address,
            city,
            state,
            zipCode,
            paymentMethod,
            paymentDetails,
            cartId: cart.cartId,
            orderTotal: Number(cartTotal)
        }

        let orderId = null;
        const res = await dispatch(addOrder(order))
        if (res) {
            orderId = res.id
            console.log("ORDERID", orderId);
            localStorage.removeItem('cartId');
            localStorage.removeItem('cartItems');
            dispatch(clearCart());
            navigate('/orderconfirmation', { state: { orders: orderId } })
        } else {
            console.error('Error creating order:', res);
            return;
        }
    }

    console.log(cart.id);

    return (
        <>
            <h1>Checkout</h1>
            {!sessionUser ? (<div>Nope</div>) :
                (<>
                    <div className="shoppingCartPageContainer">
                        <form onSubmit={handleSubmit}>
                            <h3>Shipping Address</h3 >
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
                            <h3>Payment Information</h3>

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
                    </div >
                </>
                )}

        </>
    )
}

export default Checkout
