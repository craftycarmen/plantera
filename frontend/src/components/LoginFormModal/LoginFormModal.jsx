import { useEffect, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';
import { fetchCart } from '../../store/cart';

function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [charCount, setCharCount] = useState({});
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();
    const [cartId, setCartId] = useState(null);


    useEffect(() => {
        const char = {}
        if (credential.length < 4) char.credential = 'Not enough characters'
        if (password.length < 6) char.password = 'Not enough characters'
        setCharCount(char)
    }, [credential, password])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            let localCartId = localStorage.getItem('cartId');

            if (!localCartId) {
                const data = await dispatch(sessionActions.login({ credential, password }));

                if (data.cartId) {
                    localCartId = data.cartId;
                    localStorage.setItem('cartId', data.cartId);
                }
            }

            if (localCartId) {
                dispatch(fetchCart(localCartId));
            }
            closeModal();
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    const demoUser = async (e) => {
        e.preventDefault();

        try {
            let localCartId = localStorage.getItem('cartId');

            if (!localCartId) {
                const data = await dispatch(sessionActions.login({
                    credential: "PlanteraDemo",
                    password: "password"
                }));

                if (data.cartId) {
                    localCartId = data.cartId;
                    localStorage.setItem('cartId', data.cartId);
                }
            }

            if (localCartId) {
                dispatch(fetchCart(localCartId));
            }
            closeModal();
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    // const demoUser = (e) => {
    //     e.preventDefault();
    //     return dispatch(
    //         sessionActions.login({
    //             credential: "PlanteraDemo",
    //             password: "password",
    //         })
    //     )
    //         .then(closeModal)
    // };


    return (
        <section className='modal'>
            <h1>Log In</h1>
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

            <button onClick={demoUser}>Log In as Demo User</button>

        </section>
    );
}

export default LoginFormModal;
