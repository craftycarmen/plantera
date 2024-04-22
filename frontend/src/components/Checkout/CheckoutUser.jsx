import { useEffect, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

function CheckoutUser() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [charCount, setCharCount] = useState({});
    const [errors, setErrors] = useState({});


    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [accountType, setAccountType] = useState("");
    const [image, setImage] = useState("")

    const updateFile = e => {
        const file = e.target.files[0];
        if (file) setImage(file);
    };

    let cartId = null;

    if (localStorage.getItem('cartId')) {
        cartId = localStorage.getItem('cartId')
    }

    useEffect(() => {
        const char = {}
        if (credential.length < 4) char.credential = 'Not enough characters'
        if (password.length < 6) char.password = 'Not enough characters'
        setCharCount(char)
    }, [credential, password])

    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const errs = {};
        if (!email) errs.email = '';
        if (email && !emailRegex.test(email)) errs.email = "Email format is invalid"
        if (!username) errs.username = '';
        if (!firstName) errs.firstName = '';
        if (!lastName) errs.lastName = '';
        if (!signupPassword) errs.signupPassword = '';
        if (!confirmPassword) errs.confirmPassword = '';
        if (username && username.length < 4) errs.username = 'Username must be 4 characters at minimum';
        if (signupPassword && signupPassword.length < 6) errs.signupPassword = 'Password must be 6 characters at minimum';
        if (confirmPassword && signupPassword !== confirmPassword) errs.confirmPassword = 'Password and confirm password must match';
        if (accountType !== "buyer" && accountType !== "seller") errs.accountType = '';

        setErrors(errs);
    }, [email, username, firstName, lastName, signupPassword, confirmPassword, accountType])

    const handleLogin = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.login({ credential, password, cartId }))
            .then(navigate('/checkout'))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });
    };


    const handleSignup = (e) => {
        e.preventDefault();
        if (signupPassword === confirmPassword) {
            setErrors({});
            return dispatch(
                sessionActions.signup({
                    email,
                    username,
                    firstName,
                    lastName,
                    password: signupPassword,
                    // bio,
                    // favoritePlant,
                    accountType,
                    image
                    // shopDescription,
                    // paymentMethod,
                    // paymentDetails
                })
            )
                .then(navigate('/checkout'))
                .catch(async (res) => {
                    console.log(res);

                    const data = await res.json();
                    console.log(data);
                    if (data?.errors) {
                        setErrors(data.errors);
                    }
                });
        }
        return setErrors({
            confirmPassword: "Confirm Password field must be the same as the Password field"
        });
    };


    return (
        <>
            <div>
                Please log in or sign up before checking out.</div>
            <div className='checkoutUserContainer'>
                <div>
                    <h2>Log In</h2>
                    <p className="error" style={{ marginTop: "10px", marginBottom: "0px" }}>
                        {errors.credential &&
                            <><i className="fa-solid fa-circle-exclamation" /> {errors.credential}</>}
                    </p>
                    <form onSubmit={handleLogin}>
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
                                id="password"
                            />
                            <label htmlFor="password" className="floating-label">Password
                            </label>
                        </div>
                        <input type="hidden" name="cartId" value={cartId || ""} />
                        <div>
                            <button
                                disabled={Object.values(charCount).length}
                                type="submit">Log In</button>
                        </div>
                    </form>
                </div>

                <div>
                    <h1>Sign Up</h1>
                    <form onSubmit={handleSignup}>
                        <div className="inputContainer">
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder=""
                                id="email"
                            />
                            <label htmlFor="email" className="floating-label">Email*</label>
                            <div className="error">{errors.email &&
                                <><i className="fa-solid fa-circle-exclamation" /> {errors.email}</>}</div>
                        </div>
                        <div className="inputContainer">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder=""
                                id="username"
                            />
                            <label htmlFor="username" className="floating-label">Username*</label>
                        </div>
                        <div className="error">{errors.username &&
                            <><i className="fa-solid fa-circle-exclamation" /> {errors.username}</>}</div>
                        <div className="inputContainer">
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder=""
                                id="firstname"
                            />
                            <label htmlFor="firstname" className="floating-label">First Name*</label>
                            <div className="error">{errors.firstName &&
                                <><i className="fa-solid fa-circle-exclamation" /> {errors.firstName}</>}</div>
                        </div>
                        <div className="inputContainer">
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder=""
                                id="lastname"
                            />
                            <label htmlFor="lastname" className="floating-label">Last Name*</label>
                            <div className="error">{errors.lastName &&
                                <><i className="fa-solid fa-circle-exclamation" /> {errors.lastName}</>}</div>
                        </div>
                        <div className="inputContainer">
                            <input
                                type="signupPassword"
                                value={signupPassword}
                                onChange={(e) => setSignupPassword(e.target.value)}
                                placeholder=""
                                id="signupPassword"
                            />
                            <label htmlFor="signupPassword" className="floating-label">Password*</label>
                            <div className="error">{errors.signupPassword &&
                                <><i className="fa-solid fa-circle-exclamation" /> {errors.signupPassword}</>}</div>
                        </div>
                        <div className="inputContainer">
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder=""
                                id="confirmpassword"
                            />
                            <label htmlFor="confirmpassword" className="floating-label">Confirm Password*</label>
                            <div className="error">{errors.confirmPassword &&
                                <><i className="fa-solid fa-circle-exclamation" /> {errors.confirmPassword}</>}</div>
                        </div>
                        {/* <div className="inputContainer">
                    <textarea
                        type="text"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder=""
                        id="bio"
                    />
                    <label htmlFor="bio" className="floating-label">Tell us about yourself!</label>
                    <div className="error">{errors.bio &&
                        <><i className="fa-solid fa-circle-exclamation" /> {errors.bio}</>}</div>
                </div> */}
                        {/* <div className="inputContainer">
                    <input
                        type="text"
                        value={favoritePlant}
                        onChange={(e) => setFavoritePlant(e.target.value)}
                        placeholder=""
                        id="favoritePlant"
                    />
                    <label htmlFor="favoritePlant" className="floating-label">What's your favorite plant?</label>
                    <div className="error">{errors.favoritePlant &&
                        <><i className="fa-solid fa-circle-exclamation" /> {errors.favoritePlant}</>}</div>
                </div> */}
                        <div className="inputContainer accountType">
                            Would you like to sell plants on Plantera?*
                            <div className='radioInput'>
                                <input
                                    type="radio"
                                    value="seller"
                                    name="accountType"
                                    defaultChecked={accountType === "seller"}
                                    onClick={() => setAccountType("seller")}
                                /><span>Yes</span>&nbsp;&nbsp;

                                <input
                                    type="radio"
                                    value="buyer"
                                    name="accountType"
                                    defaultChecked={accountType === "buyer"}
                                    onClick={() => setAccountType("buyer")}
                                /><span>No</span>
                            </div>
                            <div className="error">{errors.accountType &&
                                <><i className="fa-solid fa-circle-exclamation" /> {errors.accountType}</>}</div>
                        </div>
                        {/* <div className="inputContainer">
                    <textarea
                        type="text"
                        value={shopDescription}
                        onChange={(e) => setShopDescription(e.target.value)}
                        placeholder=""
                        id="shopDescription"
                    />
                    <label htmlFor="shopDescription" className="floating-label">Tell us about your shop!</label>
                    <div className="error">{errors.shopDescription &&
                        <><i className="fa-solid fa-circle-exclamation" /> {errors.shopDescription}</>}</div>
                </div> */}
                        {/* <div className="inputContainer">
                    Where do you want us to send your earnings?*
                    <div>
                        <select className="inputFields"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            name="paymentMethod"
                        >
                            <option value="">Select Payment Method</option>
                            {banks.map((bank, index) => (
                                <option key={bank} value={index + 1}>
                                    {bank}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="error">{errors.paymentMethod &&
                        <><i className="fa-solid fa-circle-exclamation" /> {errors.paymentMethod}</>}</div>
                </div>
                <div className="inputContainer">
                    <input
                        type="text"
                        value={paymentDetails}
                        onChange={(e) => setPaymentDetails(e.target.value)}
                        placeholder=""
                        id="paymentDetails"
                    />
                    <label htmlFor="paymentDetails" className="floating-label">Last 4 Digits of Payment Method*</label>
                    <div className="error">{errors.paymentDetails &&
                        <><i className="fa-solid fa-circle-exclamation" /> {errors.paymentDetails}</>}</div>
                </div> */}
                        <label>
                            Avatar
                            <input type="file" onChange={updateFile} />
                        </label>
                        <div>
                            <button style={{ marginTop: "15px" }}
                                disabled={Object.values(errors).length}
                                type="submit">Sign Up</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default CheckoutUser
