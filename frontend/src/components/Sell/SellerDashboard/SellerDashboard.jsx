import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOwnedShopOrders } from "../../../store/sell";
import './SellerDashboard.css';
import { Link } from "react-router-dom";
import { price } from "../../../../utils";

function SellerDashboard() {
    const dispatch = useDispatch();

    const shopOrders = Object.values(useSelector((state) => state.sell));

    const ulRef = useRef();
    const [showMenu, setShowMenu] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
    const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024 && window.innerWidth >= 481);

    useEffect(() => {
        dispatch(fetchOwnedShopOrders());
    }, [dispatch]);

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

    const sellerContainerStyle = {
        marginLeft: isTablet && showMenu ? '225px' : '0',
        transition: 'margin-left 0.2s ease-in-out'
    };

    const ulClassName = "seller-dropdown" + (showMenu ? "" : " hidden");

    const totalItems = shopOrders.reduce((total, order) => total + (order.cartQty || 0), 0);
    const totalOrders = new Set(shopOrders.map(order => order.orderId)).size;
    const earnings = shopOrders.reduce((total, order) => total + (order.Listing.price * order.cartQty), 0);

    console.log(earnings);

    return (
        <div className="sellerContainer">
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
                                Your Latest Stats
                                <Link to='/listings/current'>Manage Listings</Link>
                                <Link to='/listings/new'>Create New Listing</Link>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="sellerLeftNav">
                    Your Latest Stats
                    <Link to='/listings/current'>Manage Listings</Link>
                    <Link to='/listings/new'>Create New Listing</Link>
                </div>
            )}
            <div className="vertical-line"></div>
            {shopOrders && (
                <div style={sellerContainerStyle}>
                    <h2>Your Latest Stats</h2>
                    <div className="sellerStats">
                        <div>
                            <h2>{price(earnings)}</h2>
                            <div>total earnings</div>
                        </div>
                        <div>
                            <h2>{totalItems}</h2>
                            <div>total items sold</div>
                        </div>
                        <div>
                            <h2>{totalOrders}</h2>
                            <div>total orders</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SellerDashboard;
