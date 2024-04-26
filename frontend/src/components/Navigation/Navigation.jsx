import { NavLink, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import ShoppingCartButton from './ShoppingCartButton';
import { useEffect } from 'react';
import { fetchCart } from '../../store/cart';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);
    const user = useSelector(state => state.user[sessionUser?.id]?.User)
    // console.log("NOTSESHUSER", user);
    const userCartId = useSelector(state => state.cart.cartId)
    console.log("USERCARTIDNAV", userCartId);
    const dispatch = useDispatch();
    const cartId = userCartId || localStorage.getItem('cartId')
    // console.log("SESHUSER", sessionUser);
    useEffect(() => {
        if (sessionUser) {
            dispatch(fetchCart(userCartId))
        }
    }, [sessionUser, dispatch, userCartId])

    return (
        <div className='navigation'>
            <NavLink to="/"><img style={{ width: "350px" }} src='../../logo.png' /></NavLink>
            <div className='navLinks'>
                <Link to="/listings">SHOP</Link>&nbsp;&nbsp;&nbsp;

                <span onClick={() => alert('Page coming soon')} >INSPIRE</span>&nbsp;&nbsp;&nbsp;

                <span onClick={() => alert('Page coming soon')} >SELL</span>
            </div>
            <div className='rightNav'>
                <i className="fa-solid fa-magnifying-glass" onClick={() => alert('Feature coming soon')} />&nbsp;&nbsp;&nbsp;

                {isLoaded && (
                    <>
                        <ProfileButton user={user} />
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
