import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOwnedShopOrders } from "../../../store/sell";
import './SellerDashboard.css';
import { price } from "../../../../utils";
import Menu from "./Menu";

function SellerDashboard({ sessionUser }) {
    const dispatch = useDispatch();

    const shop = () => {
        if (Object.values(useSelector(state => state.user[sessionUser?.id]?.Shop)) !== null) return Object.values(useSelector(state => state.user[sessionUser?.id]?.Shop))
    }

    console.log("HELLO", Object.values(useSelector(state => state.user[sessionUser?.id]?.Shop)))
    const activeListings = shop?.filter(listing => listing.stockQty > 0).length
    const soldListings = shop?.filter(listing => listing.stockQty === 0).length
    const shopOrders = Object.values(useSelector((state) => state.sell));
    console.log("SHOPORDERS", shopOrders);
    const [showMenu] = useState(false);
    const [isTablet] = useState(window.innerWidth <= 1024 && window.innerWidth >= 481);

    useEffect(() => {
        dispatch(fetchOwnedShopOrders());
    }, [dispatch]);

    const sellerContainerStyle = {
        marginLeft: isTablet && showMenu ? '225px' : '0',
        transition: 'margin-left 0.2s ease-in-out'
    };

    let totalEarnings = 0;
    let totalItems = 0;

    shopOrders.forEach(order => {
        order?.CartItems?.forEach(item => {
            totalEarnings += item.cartQty * item.Listing.price
            totalItems += item.cartQty;
        })
    })

    return (
        <>
            <div className="sellerContainer">
                <Menu sessionUser={sessionUser} />
                {shopOrders && (
                    <div style={sellerContainerStyle} className="sellerRightContainer">
                        <h2>Your Latest Stats</h2>
                        <div className="sellerStats">
                            <div>
                                <h2>{price(totalEarnings)}</h2>
                                <div>total earnings</div>
                            </div>
                            <div>
                                <h2>{totalItems}</h2>
                                <div>{totalItems === 1 ? 'item sold' : 'total items sold'}</div>
                            </div>
                            <div>
                                <h2>{shopOrders.length}</h2>
                                <div>{shopOrders.lengths === 1 ? 'order' : 'total orders'}</div>
                            </div>
                            <div>
                                <h2>{activeListings}</h2>
                                <div>{activeListings === 1 ? 'active listing' : 'active listings'}</div>
                            </div>
                            <div>
                                <h2>{soldListings}</h2>
                                <div>{soldListings === 1 ? 'inactive listing' : 'inactive listings'}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default SellerDashboard;
