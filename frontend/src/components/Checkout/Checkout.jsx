import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import OrderSummary from "../Cart/CartPage/OrderSummary"
import { addOrder } from "../../store/order";
import { Link, useNavigate } from "react-router-dom";
import { clearCart } from "../../store/cart";
import ErrorHandling from "../ErrorHandling";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

function Checkout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const stripe = useStripe();
    const elements = useElements();

    const cart = useSelector(state => state.cart);

    const sessionUser = useSelector(state => state.session.user);
    const userId = sessionUser?.id;
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [setClientSecret] = useState("");

    const updateFirstName = (e) => setFirstName(e.target.value);
    const updateLastName = (e) => setLastName(e.target.value);
    const updateAddress = (e) => setAddress(e.target.value);
    const updateCity = (e) => setCity(e.target.value);
    const updateState = (e) => setState(e.target.value);
    const updateZipCode = (e) => setZipCode(e.target.value);

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

    useEffect(() => {
        const errs = {};

        if (!firstName) errs.firstName = '';
        if (!lastName) errs.lastName = '';
        if (!address) errs.address = '';
        if (!city) errs.city = '';
        if (!state) errs.state = '';
        if (!zipCode) errs.zipCode = '';

        setErrors(errs);
    }, [firstName, lastName, address, city, state, zipCode])

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({});
        setIsProcessing(true);

        const order = {
            buyerId: userId,
            firstName,
            lastName,
            address,
            city,
            state,
            zipCode,
            cartId: cart.cartId,
            subTotal: cart.cartTotal
        }

        let orderId = null;

        const res = await dispatch(addOrder(order))

        if (res) {
            const { clientSecret } = res;
            setClientSecret(clientSecret);

            if (!stripe || !elements) return;

            const cardElement = elements.getElement(CardElement);
            const paymentResult = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: `${firstName} ${lastName}`,
                        address: {
                            line1: address,
                            city: city,
                            state: state,
                            postal_code: zipCode,
                            country: "US"
                        }
                    }
                }
            });

            if (paymentResult.error) {
                console.error(paymentResult.error.message);
                setErrors({ payment: paymentResult.error.message });
                setIsProcessing(false);
            } else if (paymentResult.paymentIntent.status === "succeeded") {
                orderId = res.order.id

                localStorage.removeItem('cartId');
                localStorage.removeItem('cartItems');
                dispatch(clearCart());
                navigate(`/order/${orderId}`)
            }

        } else {
            console.error('Error creating order:', res);
            setIsProcessing(false);
            // return;
        }
    }



    return (
        <>
            <h3>
                <Link to="/">Home</Link>&nbsp;&nbsp;
                <i className="fa-solid fa-angle-right" style={{ fontSize: "small" }} />&nbsp;&nbsp;
                <Link to="/cart">Shopping Cart</Link>&nbsp;&nbsp;
                <i className="fa-solid fa-angle-right" style={{ fontSize: "small" }} />&nbsp;&nbsp;Checkout
            </h3>
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
                            <CardElement />
                            <div className='error'>{errors.payment &&
                                <><i className="fa-solid fa-circle-exclamation" /> {errors.payment}</>}</div>
                            <button
                                type="submit"
                                disabled={isProcessing || !!Object.values(errors).length}
                            >{isProcessing ? "Processing..." : "Place My Order"}</button>
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
