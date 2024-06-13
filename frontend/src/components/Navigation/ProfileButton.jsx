import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { clearCart, resetCartId } from '../../store/cart';
import { useNavigate, useLocation } from 'react-router-dom';
import { RiPlantLine } from "react-icons/ri";
import { BsBoxSeam } from "react-icons/bs";
import { FiSun } from "react-icons/fi";


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
            {location.pathname !== '/checkout/user' ? (
                <>

                    <span onClick={toggleMenu}>
                        {currUser ? (<i className="fa-regular fa-laugh-beam" />) : (<i className="fa-regular fa-face-smile" />)}
                    </span>

                    <div className={ulClassName} ref={ulRef}>
                        {currUser ? (
                            <div className='userInfo'>
                                <div>Hey, {currUser.username}!</div>
                                <div className='profileOptions'>
                                    <div><i className="fa-regular fa-face-smile" style={{ fontSize: "small", alignContent: "center" }} /></div><div><a onClick={() => {
                                        closeMenu()
                                        navigate(`/user/${currUser.id}`)
                                    }}>Profile</a></div>
                                    {isSeller && (
                                        <>
                                            <div><RiPlantLine style={{ marginTop: "4px" }} /></div><div><a onClick={() => {
                                                closeMenu()
                                                navigate(`/sell`)
                                            }}>Seller Dashboard</a></div>
                                        </>
                                    )
                                    }
                                    <div><FiSun style={{ marginTop: "4px" }} /></div><div><a onClick={() => {
                                        closeMenu()
                                        navigate(`/guides/current`)
                                    }}>Guides</a></div>
                                    <div><BsBoxSeam style={{ marginTop: "4px" }} /></div><div><a onClick={() => {
                                        closeMenu()
                                        navigate(`/orders`)
                                    }}>Orders</a></div>
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
                </>
            ) : (
                <span onClick={toggleMenu} style={{ cursor: "default" }}>
                    <i className="fa-regular fa-face-smile" style={{ cursor: "default" }} />
                </span>
            )}
        </div>
    );
}

export default ProfileButton;
