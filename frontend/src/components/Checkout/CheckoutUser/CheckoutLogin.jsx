import { useEffect, useState } from 'react';
import * as sessionActions from '../../../store/session';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function CheckoutLogin() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [credential, setCredential] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [charCount, setCharCount] = useState({});
    const [errors, setErrors] = useState({});

    let cartId = null;

    if (localStorage.getItem('cartId')) {
        cartId = localStorage.getItem('cartId')
    }

    useEffect(() => {
        const char = {}
        if (credential.length < 4) char.credential = 'Not enough characters'
        if (loginPassword.length < 6) char.loginPassword = 'Not enough characters'
        setCharCount(char)
    }, [credential, loginPassword])

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.login({ credential, loginPassword, cartId }))
            .then(navigate('/checkout'))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });
    };

    const demoUser = (e) => {
        e.preventDefault();
        return dispatch(
            sessionActions.login({
                credential: "PlanteraDemo",
                password: "password",
                cartId: cartId
            })
        )
            .then(navigate('/checkout'))
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
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder=""
                        id="loginPassword"
                    />
                    <label htmlFor="loginPassword" className="floating-label">Password
                    </label>
                </div>
                <input type="hidden" name="cartId" value={cartId || ""} />
                <div>
                    <button
                        disabled={Object.values(charCount).length}
                        type="submit">Log In</button>
                </div>
            </form>
            <span onClick={demoUser} style={{ cursor: "pointer" }}>Log In as Demo User</span>
        </div>
    )
}

export default CheckoutLogin;
