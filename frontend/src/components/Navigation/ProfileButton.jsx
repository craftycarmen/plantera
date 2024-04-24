import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { clearCart, resetCartId } from '../../store/cart';
import { useNavigate } from 'react-router-dom';

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const cartId = localStorage.getItem('cartId')
    const navigate = useNavigate()

    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());

        if (user && cartId) {
            localStorage.removeItem('cartId');
            console.log('CartId cleared from localStorage');

            localStorage.removeItem('cartItems')
            dispatch(resetCartId())
            dispatch(clearCart())
        }
        closeMenu();
        navigate('/')
    };

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
        <div className='profileButtonWrapper'>
            <span onClick={toggleMenu}>
                <i className="fa-regular fa-face-smile" />
            </span>
            <div className={ulClassName} ref={ulRef}>
                {user ? (
                    <div className='userInfo'>
                        <div>Hey, {user.username}!</div>
                        <div><i className="fa-regular fa-face-smile" style={{ fontSize: "small" }} /> <a onClick={() => {
                            closeMenu()
                            navigate(`/user/${user.id}`)
                        }}>Profile</a></div>
                        {user.accountType === 'seller' &&
                            <div><i className="fa-solid fa-seedling" style={{ fontSize: "small" }} /> <a onClick={() => {
                                closeMenu()
                                navigate(`/listings/current`)
                            }}>Listings</a></div>
                        }
                        <div><i className="fa-solid fa-sun" style={{ fontSize: "small" }} /> Guides</div>
                        <div><i className="fa-solid fa-box-open" style={{ fontSize: "small" }} /> Orders</div>
                        <button onClick={logout}>Log Out</button>

                    </div>
                ) : (
                    <>
                        <div className='profileLink'>
                            <OpenModalMenuItem
                                itemText="Log In"
                                onItemClick={closeMenu}
                                modalComponent={<LoginFormModal />}
                            />
                        </div>
                        <div className='profileLink'>
                            <OpenModalMenuItem
                                itemText="Sign Up"
                                onItemClick={closeMenu}
                                modalComponent={<SignupFormModal navigate={navigate} />}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ProfileButton;
