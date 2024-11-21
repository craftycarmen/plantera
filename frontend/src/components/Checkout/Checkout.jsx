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
    // const [setClientSecret] = useState("");
    const [isCardValid, setIsCardValid] = useState(false);

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
        setIsProcessing(false);
    }, [firstName, lastName, address, city, state, zipCode])

    useEffect(() => {
        if (elements) {
            const cardElement = elements.getElement(CardElement);

            if (cardElement) {
                cardElement.on('change', (e) => {
                    setIsCardValid(e.complete && !e.empty);

                });
            }
        }
    }, [elements]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({});
        setIsProcessing(true);

        if (!stripe || !elements) {
            setErrors({ payment: 'Stripe not loaded properly' });
            setIsProcessing(false);
            return;
        }

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

        const res = await dispatch(addOrder(order));

        if (!res || !res.clientSecret) {
            setErrors({ payment: 'Failed to create order' })
            setIsProcessing(false);
            return;
        }

        // setClientSecret(res.clientSecret)
        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
            setErrors({ payment: 'Card element not found.' })
            setIsProcessing(false);
            return;
        }

        const { error: cardError } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            // card: elements.getElement(CardElement),
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
        });

        if (cardError) {
            setErrors({ payment: cardError.message });
            setIsProcessing(false);
            return;
        }

        const paymentResult = await stripe.confirmCardPayment(res.clientSecret, {
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
        console.log("PAYMENRESLT", paymentResult);

        if (paymentResult.error) {
            console.error(paymentResult.error.message);

            if (paymentResult.error.message === "Your card was declined. Your request was in test mode, but used a non test card. For a list of valid test cards, visit: https://stripe.com/docs/testing.") {
                setErrors({
                    payment: "DEMO MODE ONLY: Please use 4242 4242 4242 4242 as the card number."
                });
                setIsProcessing(false);
            }
            setErrors({ payment: paymentResult.error.message });
            setIsProcessing(false);
        } else if (paymentResult.paymentIntent.status === "succeeded") {
            orderId = res.order.id
            localStorage.removeItem('cartId');
            localStorage.removeItem('cartItems');
            dispatch(clearCart());
            navigate(`/order/${orderId}`)
        }

    }

    const copy = async (text) => {
        await navigator.clipboard.writeText(text);
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
                            <p>
                                <strong>DEMO MODE:</strong> Use the following test card details to simulate a transaction:
                                <ul>
                                    <li>Card Number: <a onClick={() => copy("4242 4242 4242 4242")}>4242 4242 4242 4242<sup><i className="fa-regular fa-copy" style={{ marginLeft: "5px" }} /></sup></a>

                                    </li>
                                    <li>
                                        Expiration Date: <a onClick={() => copy("1227")}>12/27<sup><i className="fa-regular fa-copy" style={{ marginLeft: "5px" }} /></sup></a> (or any future date)
                                    </li>
                                    <li>
                                        CVC: <a onClick={() => copy("000")}>000<sup><i className="fa-regular fa-copy" style={{ marginLeft: "5px" }} /></sup></a> (or any three digits)
                                    </li>
                                </ul>
                            </p>
                            <br />
                            <CardElement
                                options={{
                                    hidePostalCode: true,
                                    style: {
                                        base: {
                                            fontFamily: '"Space Mono", monospace',
                                            color: '#28635A',
                                        }
                                    }
                                }} />
                            <div className='error'>{errors.payment &&
                                <><i className="fa-solid fa-circle-exclamation" /> {errors.payment}</>}</div>
                            <button
                                type="submit"
                                disabled={isProcessing || !!Object.values(errors).length || !isCardValid}
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
