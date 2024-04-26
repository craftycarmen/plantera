import { useEffect, useState } from 'react';
import * as sessionActions from '../../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCart, editCart } from '../../../store/cart';

function CheckoutLogin({ cartId }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [charCount, setCharCount] = useState({});
    const [errors, setErrors] = useState({});
    const cartItems = useSelector(state => state.cart.cartItems);

    useEffect(() => {
        const char = {}
        if (credential.trim().length < 4) char.credential = 'Not enough characters'
        if (password.trim().length < 6) char.password = 'Not enough characters'
        setCharCount(char)
    }, [credential, password])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            const data = await dispatch(sessionActions.login({ credential, password }));

            if (!cartId && data.cartId) {
                localStorage.setItem('cartId', data.cartId);
                cartId = data.cartId;
            }

            if (cartId) {
                await dispatch(fetchCart(cartId));
                await dispatch(editCart(cartId))
            }

            if (cartItems.length > 0 && data.user?.id) {
                const sellerItems = (cartItems, userId) => {
                    return cartItems.some(item => {
                        console.log("Item:", item);
                        console.log("User ID:", userId);
                        console.log("Seller ID:", item.Listing?.Seller?.id);
                        return item.Listing?.Seller?.id === data.user?.id;
                    })
                }
                if (sellerItems) {
                    alert('Please remove item(s) that belong to you before checking out.');
                    navigate('/cart');
                    return;
                }
            }
            navigate('/checkout')
        } catch (res) {
            console.error('Error during login:', res);
            const data = await res.json();
            if (data?.errors) {
                setErrors(data.errors);
            }
        }
    };

    const demoUser = async (e) => {
        e.preventDefault();

        try {
            let localCartId = localStorage.getItem('cartId');

            let data;

            if (!localCartId) {
                data = await dispatch(sessionActions.login({
                    credential: "PlanteraDemo",
                    password: "password"
                }));

                if (data.cartId) {
                    localCartId = data.cartId;
                    localStorage.setItem('cartId', data.cartId);
                }

                console.log("DATAAAAAA", data);

                if (cartItems.length > 0 && data?.user?.id) {
                    const sellerItems = (cartItems, userId) => {
                        return cartItems.some(item => {
                            console.log("Item:", item);
                            console.log("User ID:", userId);
                            console.log("Seller ID:", item.Listing?.Seller?.id);
                            return item.Listing?.Seller?.id === data?.user?.id;
                        })
                    }
                    if (sellerItems) {
                        alert('Please remove item(s) that belong to you before checking out.');
                        navigate('/cart');
                        return;
                    }
                }
            }

            if (localCartId) {
                data = await dispatch(sessionActions.login({
                    credential: "PlanteraDemo",
                    password: "password"
                }));
                dispatch(fetchCart(localCartId));
                dispatch(editCart(localCartId))

                console.log("DATAAAAAA2", data);
                if (cartItems.length > 0 && data?.user?.id) {
                    const sellerItems = (cartItems, userId) => {
                        return cartItems.some(item => {
                            console.log("Item:", item);
                            console.log("User ID:", userId);
                            console.log("Seller ID:", item.Listing?.Seller?.id);
                            return item.Listing?.Seller?.id === data?.user?.id;
                        })
                    }
                    if (sellerItems) {
                        alert('Please remove item(s) that belong to you before checking out.');
                        navigate('/cart');
                        return;
                    }

                }
            }


            navigate('/checkout')
        } catch (res) {
            console.error('Error during login:', res);
            const data = await res.json();
            if (data?.errors) {
                setErrors(data.errors);
            }
        }
    };

    return (
        <div>
            <h2>Log In</h2>
            <p className="error" style={{ marginTop: "10px", marginBottom: "0px" }}>
                {errors.credential &&
                    <><i className="fa-solid fa-circle-exclamation" /> {errors.credential}</>}
            </p>
            <form onSubmit={handleSubmit}>
                <div className="inputContainer">
                    <input
                        type="text"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        placeholder=""
                        id="credential"
                    />
                    <label htmlFor="credential" className="floating-label">Username or Email
                    </label>
                </div>
                <div className="inputContainer">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder=""
                        id="Password"
                    />
                    <label htmlFor="Password" className="floating-label">Password
                    </label>
                </div>
                <input type="hidden" name="cartId" value={cartId || ""} />
                <div>
                    <button
                        disabled={Object.values(charCount).length}
                        style={{ marginTop: "15px", width: "321px" }}
                        type="submit">Log In</button>
                </div>
            </form>
            <p>
                <a onClick={demoUser} className='checkDemoUser'>Log in as Demo User</a>
            </p>
        </div>
    )
}

export default CheckoutLogin;
