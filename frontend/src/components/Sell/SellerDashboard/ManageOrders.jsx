import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import ErrorHandling from "../../ErrorHandling";
import Menu from "./Menu";
import { fetchOwnedShopOrders } from "../../../store/sell";

function ManageOrders() {
    const dispatch = useDispatch();
    const [showMenu] = useState(false);
    const [isTablet] = useState(window.innerWidth <= 1024 && window.innerWidth >= 481);
    const sellerContainerStyle = {
        marginLeft: isTablet && showMenu ? '225px' : '0',
        transition: 'margin-left 0.2s ease-in-out'
    };
    const sessionUser = useSelector(state => state.session.user);
    const shopOrders = Object.values(useSelector((state) => state.sell));

    useEffect(() => {
        dispatch(fetchOwnedShopOrders());
    }, [dispatch]);

    const dateFormat = (date) => {
        let newDate = new Date(date)
        const enUSFormatter = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        return enUSFormatter.format(newDate)
    }

    console.log("SHOP!", shopOrders);
    return (
        <>
            <h1>Sell(er Dashboard) for {sessionUser.username}</h1>
            <div>Purge your plants and plant babies on Plantera, and get paid!</div>
            <br />
            <div className="sellerContainer">
                <Menu sessionUser={sessionUser} />
                <div style={sellerContainerStyle} className="sellerRightContainer">
                    <h2>Manage Orders</h2>
                    {!sessionUser ? (
                        <ErrorHandling />
                    ) : (
                        shopOrders && (
                            <div className="manageListingsSection">
                                {shopOrders.length === 0 ? (
                                    <div>No orders yet!</div>
                                ) : (
                                    <div>
                                        {shopOrders.map(order => (
                                            <>
                                                <div>
                                                    Order #{order.id}
                                                </div>
                                                <div>Order Date: {order.createdAt && dateFormat(order.createdAt)}</div>
                                                <div>Order Status: {order.orderStatus}</div>
                                                <div>View & Update Order Status</div>
                                                <hr />
                                            </>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    )}
                </div>
            </div>
        </>
    );
}

export default ManageOrders
