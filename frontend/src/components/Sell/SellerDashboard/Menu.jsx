import { useEffect, useState, useCallback, useRef } from "react";
import './SellerDashboard.css';
import { Link, useLocation } from "react-router-dom";

function Menu({ sessionUser }) {
    const ulRef = useRef();
    const [showMenu, setShowMenu] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
    const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024 && window.innerWidth >= 481);
    const location = useLocation();
    const handleResize = useCallback(() => {
        setIsMobile(window.innerWidth <= 480);
        setIsTablet(window.innerWidth <= 1024 && window.innerWidth >= 481);
    }, []);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);

    const toggleMenu = useCallback(() => {
        setShowMenu(prevState => !prevState);
    }, []);

    useEffect(() => {
        if (!showMenu || !ulRef.current) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                toggleMenu();
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu, toggleMenu]);

    const ulClassName = "seller-dropdown" + (showMenu ? "" : " hidden");

    return (
        <>
            {isMobile || isTablet ? (
                <div className="sellerLeftNav">
                    <span className="sellerMenuButton" onClick={(e) => {
                        e.stopPropagation();
                        toggleMenu();
                    }}>
                        <i className="fa-solid fa-bars" /> Menu
                    </span>
                    <div className="outerSellMenuWrapper">
                        {showMenu && (
                            <div className={ulClassName} ref={ulRef}>
                                {location.pathname === '/sell' ? (<div>Your Latest Stats</div>) : (<div><Link to='/sell'>Your Latest Stats</Link></div>)}

                                {location.pathname === '/sell/listings/current' ? (<div>Manage Your Listings</div>) : (<div><Link to='/sell/listings/current'>Manage Your Listings</Link></div>)}

                                {location.pathname === '/sell/listings/new' ? (<div>Create New Listing</div>) : (<div><Link to='/sell/listings/new'>Create New Listing</Link></div>)}

                                <div><Link to={`/user/${sessionUser?.id}/shop`} target="_blank" rel="noopener noreferrer">View Shop</Link></div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="sellerLeftNav">
                    {location.pathname === '/sell' ? (<div>Your Latest Stats</div>) : (<div><Link to='/sell'>Your Latest Stats</Link></div>)}

                    {location.pathname === '/sell/listings/current' ? (<div>Manage Your Listings</div>) : (<div><Link to='/sell/listings/current'>Manage Your Listings</Link></div>)}

                    {location.pathname === '/sell/listings/new' ? (<div>Create New Listing</div>) : (<div><Link to='/sell/listings/new'>Create New Listing</Link></div>)}

                    <div><Link to={`/user/${sessionUser?.id}/shop`} target="_blank" rel="noopener noreferrer">View Shop</Link></div>
                </div>
            )}
            <div className="vertical-line"></div>
        </>
    )
}

export default Menu;
