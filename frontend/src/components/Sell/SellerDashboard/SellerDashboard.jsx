import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOwnedShopOrders } from "../../../store/sell";
import './SellerDashboard.css';
import { price } from "../../../../utils";
import Menu from "./Menu";

function SellerDashboard({ sessionUser }) {
    const dispatch = useDispatch();

    const shopOrders = Object.values(useSelector((state) => state.sell));


    const [showMenu] = useState(false);
    const [isTablet] = useState(window.innerWidth <= 1024 && window.innerWidth >= 481);

    useEffect(() => {
        dispatch(fetchOwnedShopOrders());
    }, [dispatch]);

    const sellerContainerStyle = {
        marginLeft: isTablet && showMenu ? '225px' : '0',
        transition: 'margin-left 0.2s ease-in-out'
    };

    const totalItems = shopOrders.reduce((total, order) => total + (order.cartQty || 0), 0);
    const totalOrders = new Set(shopOrders.map(order => order.orderId)).size;
    const earnings = shopOrders.reduce((total, order) => total + (order.Listing.price * order.cartQty), 0);

    console.log(earnings);

    return (
        <div className="sellerContainer">
            <Menu sessionUser={sessionUser} />
            {shopOrders && (
                <div style={sellerContainerStyle} className="sellerRightContainer">
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
