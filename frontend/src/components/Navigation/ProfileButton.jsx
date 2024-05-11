import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { clearCart, resetCartId } from '../../store/cart';
import { useNavigate, useLocation } from 'react-router-dom';

function ProfileButton() {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const cartId = localStorage.getItem('cartId')
    const navigate = useNavigate()
    const sessionUser = useSelector(state => state.session.user);
    const user = useSelector(state => state.user[sessionUser?.id]?.User)
    const currUser = user || sessionUser;
    const isSeller = currUser && currUser.accountType === 'seller';
    const location = useLocation();
    console.log(currUser);

    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);


    };

    useEffect(() => {
        const closeMenuWithDelay = () => {
            setTimeout(() => {
                setShowMenu(false);
            }, 100);
        };

        closeMenuWithDelay();
    }, [location]);

    useEffect(() => {
        if (!showMenu || !ulRef.current) return;

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

        if (currUser && cartId) {
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
            {location.pathname !== '/checkout/user' && (
                <div className={ulClassName} ref={ulRef}>
                    {currUser ? (
                        <div className='userInfo'>
                            <div>Hey, {currUser.username}!</div>
                            <div className='profileOptions'>
                                <div><i className="fa-regular fa-face-smile" style={{ fontSize: "small" }} /></div><div><a onClick={() => {
                                    closeMenu()
                                    navigate(`/user/${currUser.id}`)
                                }}>Profile</a></div>
                                {isSeller && (
                                    <>
                                        <div><i className="fa-solid fa-seedling" style={{ fontSize: "small" }} /></div><div><a onClick={() => {
                                            closeMenu()
                                            navigate(`/listings/current`)
                                        }}>Listings</a></div>
                                    </>
                                )
                                }
                                <div><i className="fa-solid fa-sun" style={{ fontSize: "small" }} /></div><div><a onClick={() => {
                                    closeMenu()
                                    navigate(`/guides/current`)
                                }}>Guides</a></div>
                                {/* <div><i className="fa-solid fa-box-open" style={{ fontSize: "small" }} /></div><div>Orders</div> */}
                            </div>
                            <button onClick={logout}>Log Out</button>

                        </div>
                    ) : (
                        <>

                            <div className='profileLink'>
                                <OpenModalMenuItem
                                    itemText="Log In"
                                    onItemClick={closeMenu}
                                    modalComponent={<LoginFormModal navigate={navigate} />}
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
            )}
        </div>
    );
}

export default ProfileButton;
