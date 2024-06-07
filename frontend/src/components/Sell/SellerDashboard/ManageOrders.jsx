import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import ErrorHandling from "../../ErrorHandling";
import Menu from "./Menu";
import { fetchOwnedShopOrders } from "../../../store/sell";
import { price } from "../../../../utils";
import { Link } from "react-router-dom";

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
    shopOrders.map(order => {
        order.CartItems.map(item => console.log("ITEM", item.Listing))
    })

    let totalEarnings = 0;
    let totalItems = 0;

    shopOrders.forEach(order => {
        order.CartItems.forEach(item => {
            totalEarnings += item.cartQty * item.Listing.price
            totalItems += item.cartQty;
        })
    })

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
                                        <h3>Unfulfilled Orders</h3>
                                        {shopOrders.map(order => (
                                            <div key={order.id} className="manageOrdersSection">
                                                <h4>Order #{order.id}</h4>
                                                <div className="orderInfo">
                                                    <div>
                                                        <div>Order Date: {order.createdAt && dateFormat(order.createdAt)}</div>
                                                        <div>Order Status: {order.orderStatus}</div>
                                                        <button>Update Status</button>
                                                    </div>
                                                    <div className="shipTo">
                                                        <div>Ship to:</div>
                                                        <div>
                                                            <div>{order.firstName} {order.lastName}</div>
                                                            <div>{order.address}</div>
                                                            <div>{order.city}, {order.state} {order.zipCode}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="items">
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th>Item</th>
                                                                <th>Qty</th>
                                                                <th>Price</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {order.CartItems?.map(item => (
                                                                <tr key={item.Listing?.id}>
                                                                    <td><Link to={`/listings/${item.Listing?.id}`} target="_blank" rel="noopener noreferrer">{item.Listing?.plantName}</Link></td>
                                                                    <td>{item.cartQty}</td>
                                                                    <td>{price(item.Listing?.price)}</td>
                                                                </tr>
                                                            ))}
                                                            <tr>
                                                                <td>Total</td>
                                                                <td>{totalItems}</td>
                                                                <td>{price(totalEarnings)}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <hr />
                                            </div>
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
