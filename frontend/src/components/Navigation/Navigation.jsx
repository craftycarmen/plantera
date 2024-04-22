import { NavLink, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import ShoppingCartButton from './ShoppingCartButton';
import { useEffect } from 'react';
import { fetchCart } from '../../store/cart';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    const userCartId = useSelector(state => state.cart.cartId)
    console.log("USERCARTIDNAV", userCartId);
    const dispatch = useDispatch();
    const cartId = userCartId || localStorage.getItem('cartId')

    useEffect(() => {
        if (sessionUser) {
            dispatch(fetchCart(userCartId))
        }
    }, [sessionUser, dispatch, userCartId])

    return (
        <div className='navigation'>
            <NavLink to="/"><img style={{ width: "350px" }} src='../../logo.png' /></NavLink>
            <div className='navLinks'>
                <Link to="/listings">SHOP</Link>&nbsp;&nbsp;&nbsp;INSPIRE&nbsp;&nbsp;&nbsp;SELL
            </div>
            <div className='rightNav'>
                <i className="fa-solid fa-magnifying-glass" />&nbsp;&nbsp;&nbsp;

                {isLoaded && (
                    <>
                        <ProfileButton user={sessionUser} />
                    </>
                )}&nbsp;&nbsp;&nbsp;

                {isLoaded && (
                    <ShoppingCartButton cartId={cartId} />
                )}
            </div>
        </div>
    );
}

export default Navigation;

// *** WITHOUT LOGIN/SIGNUP MODALS ** //

// import { NavLink } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import ProfileButton from './ProfileButton';
// import './Navigation.css';

// function Navigation({ isLoaded }) {
//     const sessionUser = useSelector(state => state.session.user);

//     const sessionLinks = sessionUser ? (
//         <li>
//             <ProfileButton user={sessionUser} />
//         </li>
//     ) : (
//         <>
//             <li>
//                 <NavLink to="/login">Log In</NavLink>
//             </li>
//             <li>
//                 <NavLink to="/signup">Sign Up</NavLink>
//             </li>
//         </>
//     );

//     return (
//         <ul>
//             <li>
//                 <NavLink to="/">Home</NavLink>
//             </li>
//             {isLoaded && sessionLinks}
//         </ul>
//     );
// }

// export default Navigation;
