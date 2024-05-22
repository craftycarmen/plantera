import { NavLink, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import ShoppingCartButton from './ShoppingCartButton';
import { useEffect } from 'react';
import { fetchCart } from '../../store/cart';
import SearchButton from './SearchButton';

function Navigation({ isLoaded }) {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const user = useSelector(state => state.user[sessionUser?.id]?.User)
    const userCartId = useSelector(state => state.cart.cartId)
    const cartId = userCartId || localStorage.getItem('cartId')

    useEffect(() => {
        if (sessionUser) {
            dispatch(fetchCart(userCartId))
        }
    }, [sessionUser, dispatch, userCartId])


    return (
        <div className='navigation'>
            <NavLink to="/"><img className='planteraLogo' src='../../logo.png' /></NavLink>
            <div className='navLinks'>
                <span><Link to="/listings">SHOP</Link>&nbsp;&nbsp;&nbsp;</span>

                <span><Link to="/guides">INSPIRE</Link>&nbsp;&nbsp;&nbsp;</span>

                <span onClick={() => alert('Page coming soon')} >SELL</span>
            </div>
            <div className='rightNav'>

                {isLoaded && (
                    <SearchButton />
                )}


                {isLoaded && (
                    <ProfileButton user={user} />
                )}

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
