import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

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
                <i className="fa-solid fa-cart-shopping" />
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
