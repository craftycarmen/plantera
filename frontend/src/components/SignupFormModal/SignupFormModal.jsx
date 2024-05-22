import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import { fetchCart, editCart } from '../../store/cart';
import { titleCase } from '../../../utils';

function SignupFormModal({ navigate }) {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    // const [bio, setBio] = useState("");
    // const [favoritePlant, setFavoritePlant] = useState("");
    // const [accountType, setAccountType] = useState("");
    // const [shopDescription, setShopDescription] = useState("");
    // const [paymentMethod, setPaymentMethod] = useState("");
    // const [paymentDetails, setPaymentDetails] = useState("");
    const [image, setImage] = useState("");
    const [imageLoading, setImageLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();
    const [cartId] = useState(null);



    const updateFile = e => {
        const file = e.target.files[0];
        if (file) setImage(file);
    };

    // const banks = ['Bank of Americano', 'Pursuit', 'Fells Wargo']

    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const errs = {};
        if (!email) errs.email = '';
        if (email && !emailRegex.test(email)) errs.email = "Email format is invalid"
        if (!username) errs.username = '';
        if (!firstName) errs.firstName = '';
        if (!lastName) errs.lastName = '';
        if (!password) errs.password = '';
        if (!confirmPassword) errs.confirmPassword = '';
        if (!image) errs.image = '';
        if (username && username.trim().length < 4) errs.username = 'Username must be 4 characters at minimum';
        if (password && password.trim().length < 6) errs.password = 'Password must be 6 characters at minimum';
        if (confirmPassword && password !== confirmPassword) errs.confirmPassword = 'Password and confirm password must match';
        // if (accountType !== "buyer" && accountType !== "seller") errs.accountType = '';

        setErrors(errs);
    }, [email, username, firstName, lastName, password, confirmPassword, image])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password === confirmPassword) {
            setErrors({});

            try {
                setImageLoading(true);
                const data = await dispatch(
                    sessionActions.signup({
                        email,
                        username,
                        firstName: titleCase(firstName),
                        lastName: titleCase(lastName),
                        password,
                        // accountType,
                        image
                    })
                );

                let localCartId = localStorage.getItem('cartId');
                if (!localCartId && data.cartId) {
                    localCartId = data.cartId;
                    localStorage.setItem('cartId', data.cartId);
                }

                if (localCartId) {
                    await dispatch(fetchCart(localCartId));
                    await dispatch(editCart(localCartId));
                }
                const reduxStateString = localStorage.getItem('reduxState');
                const reduxState = JSON.parse(reduxStateString);
                const userId = reduxState.session.user.id;
                console.log("USERIDHELLO", userId);

                closeModal();
                if (!location.pathname.startsWith('/checkout/user')) {
                    navigate(`/user/${userId}/completeprofile`)
                }

            } catch (res) {
                console.error('Error during signup:', res);
                const data = await res.json();
                if (data?.errors) {
                    setErrors(data.errors);
                }
                setImageLoading(false);
            }
        } else {
            setErrors({
                confirmPassword: "Confirm Password field must be the same as the Password field"
            });
        }
    };

    return (
        <section className='modal signupModal'>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
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
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder=""
                        id="password"
                    />
                    <label htmlFor="password" className="floating-label">Password*</label>
                    <div className="error">{errors.password &&
                        <><i className="fa-solid fa-circle-exclamation" /> {errors.password}</>}</div>
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
                {/* <div className="inputContainer accountType">
                    Would you like to sell plants on Plantera?*
                    <div className='radioInput' style={{ paddingBottom: '10px' }}>
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
                </div> */}
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
                <div className='inputContainer'>
                    <input
                        type="file"
                        onChange={updateFile}
                        accept=".jpg, .jpeg, .png"
                        id='image'
                    />
                    <label htmlFor='image' className='floating-label'>Profile Image*</label>
                </div>
                {imageLoading && (<div style={{ marginLeft: "125px", marginTop: "5px", padding: "0px" }} className="dots"></div>)}
                <input type="hidden" name="cartId" value={cartId || ""} />
                <div>
                    <button style={{ marginTop: "15px" }}
                        disabled={Object.values(errors).length}
                        type="submit">Sign Up</button>
                </div>
            </form>
            <div className='demosignup'>
                <div>Already a Plantera user?</div>
                <div>
                    <OpenModalMenuItem
                        itemText={<span className="modalLink">Log in</span>}
                        modalComponent={<LoginFormModal />}
                    />
                </div>
            </div>
        </section >
    );
}

export default SignupFormModal;
