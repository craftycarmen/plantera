import { useDispatch, useSelector } from "react-redux";
import { useCallback, useState, useEffect } from "react";
import ErrorHandling from "../../../ErrorHandling";
import Menu from "../Menu";
import { fetchOwnedShopOrders } from "../../../../store/sell";
import { useLocation } from "react-router-dom";
import './ManageOrders.css';
import UnfulfilledOrders from "./UnfulfilledOrders";
import FulfilledOrders from "./FulfilledOrders";
import ManageOrdersTabs from "./ManageOrdersTabs";
import Sell from "../../SellPage/Sell";

function ManageOrders() {
    const dispatch = useDispatch();
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
    const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024 && window.innerWidth >= 481);
    const [showMenu, setShowMenu] = useState(!(isMobile || isTablet));

    const sellerContainerStyle = {
        marginLeft: (!isTablet && !isMobile) && showMenu ? '250px' : '0',
        transition: 'margin-left 0.2s ease-in-out'
    };
    const sessionUser = useSelector(state => state.session.user);
    const user = useSelector(state => state.user[sessionUser?.id]?.User)
    const currUser = user || sessionUser;
    const isSeller = currUser && currUser.accountType === 'seller';
    const shopOrders = Object.values(useSelector((state) => state.sell));

    const unfulfilled = shopOrders?.map(order => {
        const sellerItems = order?.CartItems?.filter(item => item.Listing?.sellerId === sessionUser?.id);

        const unshippedItems = sellerItems?.some(item => item.orderStatus === "Received" || item.orderStatus === "Processing")
            ;
        if (unshippedItems) {
            return {
                ...order,
                CartItems: sellerItems
            }
        }
    }).sort((a, b) => (b.id - a.id)).filter(order => order?.CartItems?.length > 0)

    const fulfilled = shopOrders?.map(order => {
        const sellerItems = order?.CartItems?.filter(item => item.Listing?.sellerId === sessionUser?.id);

        const allShipped = sellerItems?.every(item => item.orderStatus === "Shipped");

        if (allShipped && sellerItems.length > 0) {
            return {
                ...order,
                CartItems: sellerItems
            }
        }
    }).sort((a, b) => (b.id - a.id)).filter(order => order?.CartItems?.length > 0)


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

    const handleToggle = () => {
        setShowMenu(!showMenu);
    };

    const handleResize = useCallback(() => {
        setIsMobile(window.innerWidth <= 480);
        setIsTablet(window.innerWidth <= 1024 && window.innerWidth >= 481);

    }, []);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize)
    }, [handleResize]);

    return (
        <>
            {(!sessionUser || (sessionUser && !isSeller)) &&
                <Sell />
            }
            {sessionUser && isSeller &&
                <>
                    <h1>Sell(er Dashboard) for {sessionUser.username}</h1>
                    <div>Purge your plants and plant babies on Plantera, and get paid!</div>
                    <br />
                    <div>
                        <div className="filterSort">
                            <Menu sessionUser={sessionUser} handleToggle={handleToggle} />
                        </div>
                        <div style={sellerContainerStyle} className="sellerDashContainer">
                            <h2>Manage Orders</h2>
                            {!sessionUser ? (
                                <ErrorHandling />
                            ) : (
                                shopOrders && (
                                    <div className="manageListingsSection">
                                        {shopOrders.length === 0 ? (
                                            <div>No orders yet!</div>
                                        ) : (
                                            <div className="unfulfilledFulfilled">
                                                <div className="ordersWrapper">
                                                    <ManageOrdersTabs />
                                                    <UnfulfilledOrders unfulfilled={unfulfilled} shopOrders={shopOrders} dateFormat={dateFormat} />
                                                </div>
                                                {location.pathname === '/sell/orders/fulfilled' &&
                                                    <div className="ordersWrapper">
                                                        <FulfilledOrders fulfilled={fulfilled} shopOrders={shopOrders} dateFormat={dateFormat} />
                                                    </div>
                                                }
                                            </div>

                                        )}
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </>
            }
        </>
    );
}

export default ManageOrders;


// import { useDispatch, useSelector } from "react-redux";
// import { useState, useEffect } from "react";
// import ErrorHandling from "../../../ErrorHandling";
// import Menu from "../Menu";
// import { fetchOwnedShopOrders } from "../../../../store/sell";
// import { price } from "../../../../../utils";
// import { Link } from "react-router-dom";
// import UpdateOrderModal from "../UpdateOrderModal";
// import OpenModalMenuItem from "../../../Navigation/OpenModalMenuItem";
// import './ManageOrders.css';

// function ManageOrders() {
//     const dispatch = useDispatch();
//     const [showMenu] = useState(false);
//     const [isTablet] = useState(window.innerWidth <= 1024 && window.innerWidth >= 481);
//     const sellerContainerStyle = {
//         marginLeft: isTablet && showMenu ? '225px' : '0',
//         transition: 'margin-left 0.2s ease-in-out'
//     };
//     const sessionUser = useSelector(state => state.session.user);
//     const shopOrders = Object.values(useSelector((state) => state.sell));

//     const unfulfilled = shopOrders?.map(order => {
//         const sellerItems = order?.CartItems?.filter(item => item.Listing?.sellerId === sessionUser?.id);

//         const unshippedItems = sellerItems?.some(item => item.orderStatus === "Received" || item.orderStatus === "In Progress")
//             ;
//         if (unshippedItems) {
//             return {
//                 ...order,
//                 CartItems: sellerItems
//             }
//         }
//     }).sort((a, b) => (b.id - a.id)).filter(order => order?.CartItems?.length > 0)


//     const fulfilled = shopOrders?.map(order => {
//         const sellerItems = order?.CartItems?.filter(item => item.Listing?.sellerId === sessionUser?.id);

//         const allShipped = sellerItems?.every(item => item.orderStatus === "Shipped");

//         if (allShipped && sellerItems.length > 0) {
//             return {
//                 ...order,
//                 CartItems: sellerItems
//             }
//         }
//     }).sort((a, b) => (b.id - a.id)).filter(order => order?.CartItems?.length > 0)


//     useEffect(() => {
//         dispatch(fetchOwnedShopOrders());
//     }, [dispatch]);

//     const dateFormat = (date) => {
//         let newDate = new Date(date)
//         const enUSFormatter = new Intl.DateTimeFormat('en-US', {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric',
//         });
//         return enUSFormatter.format(newDate)
//     }

//     return (
//         <>
//             <h1>Sell(er Dashboard) for {sessionUser.username}</h1>
//             <div>Purge your plants and plant babies on Plantera, and get paid!</div>
//             <br />
//             <div className="sellerContainer">
//                 <Menu sessionUser={sessionUser} />
//                 <div style={sellerContainerStyle} className="sellerRightContainer">
//                     <h2>Manage Orders</h2>
//                     {!sessionUser ? (
//                         <ErrorHandling />
//                     ) : (
//                         shopOrders && (
//                             <div className="manageListingsSection">
//                                 {shopOrders.length === 0 ? (
//                                     <div>No orders yet!</div>
//                                 ) : (
//                                     <div className="unfulfilledFulfilled">
//                                         <div>
//                                             <h3>Unfulfilled Orders</h3>
//                                             {unfulfilled && unfulfilled.length === 0 ? (
//                                                 <div>No unfulfilled orders!</div>
//                                             ) : (
//                                                 <div>
//                                                     <div style={{ paddingBottom: "20px" }}>Please fulfill all orders within 3 business days from order date.</div>
//                                                     {unfulfilled.map(order => {
//                                                         let orderTotalEarnings = 0;
//                                                         let orderTotalItems = 0;
//                                                         order?.CartItems?.forEach(item => {
//                                                             orderTotalEarnings += item.cartQty * item?.Listing?.price;
//                                                             orderTotalItems += item?.cartQty;
//                                                         });
//                                                         return (
//                                                             <div key={order.id} className="manageOrdersSection">
//                                                                 <h4>Order #{order.id}</h4>
//                                                                 <div className="orderInfo">
//                                                                     <div>
//                                                                         <div>Order Date: {order.createdAt && dateFormat(order.createdAt)}</div>
//                                                                     </div>
//                                                                     <div className="shipTo">
//                                                                         <div>Ship to:</div>
//                                                                         <div>
//                                                                             <div>{order.firstName} {order.lastName}</div>
//                                                                             <div>{order.address}</div>
//                                                                             <div>{order.city}, {order.state} {order.zipCode}</div>
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="items">
//                                                                     <table>
//                                                                         <thead>
//                                                                             <tr>
//                                                                                 <th>Item</th>
//                                                                                 <th>Qty</th>
//                                                                                 <th>Price</th>
//                                                                                 <th>Order Item Status</th>
//                                                                             </tr>
//                                                                         </thead>
//                                                                         <tbody>
//                                                                             {order.CartItems?.map(item => (
//                                                                                 <tr key={item.Listing?.id}>
//                                                                                     <td><Link to={`/listings/${item.Listing?.id}`} target="_blank" rel="noopener noreferrer">{item.Listing?.plantName}</Link> ({price(item.Listing?.price)}/ea)</td>
//                                                                                     <td>{item.cartQty}</td>
//                                                                                     <td>
//                                                                                         <div>{price(item.cartQty * item.Listing?.price)}</div>
//                                                                                     </td>
//                                                                                     <td><OpenModalMenuItem
//                                                                                         itemText={<span>{item.orderStatus} <i className="fa-solid fa-pen" /></span>}
//                                                                                         modalComponent={<UpdateOrderModal orderId={order.id} status={item.orderStatus} name={item.Listing?.plantName} itemId={item.id} />} /></td>
//                                                                                 </tr>
//                                                                             ))}
//                                                                             <tr>
//                                                                                 <td>Total</td>
//                                                                                 <td>{orderTotalItems}</td>
//                                                                                 <td>{price(orderTotalEarnings)}</td>
//                                                                             </tr>
//                                                                         </tbody>
//                                                                     </table>
//                                                                 </div>
//                                                                 <hr />
//                                                             </div>
//                                                         );
//                                                     })}
//                                                 </div>
//                                             )}
//                                         </div>
//                                         <div>
//                                             <h3>Fulfilled Orders</h3>
//                                             {fulfilled && fulfilled.length === 0 ? (
//                                                 <div>No fulfilled orders!</div>)
//                                                 : (
//                                                     <div>
//                                                         {fulfilled.map(order => {
//                                                             let orderTotalEarnings = 0;
//                                                             let orderTotalItems = 0;
//                                                             order?.CartItems?.forEach(item => {
//                                                                 orderTotalEarnings += item.cartQty * item?.Listing?.price;
//                                                                 orderTotalItems += item.cartQty;
//                                                             });
//                                                             return (
//                                                                 <div key={order.id} className="manageOrdersSection">
//                                                                     <h4>Order #{order.id}</h4>
//                                                                     <div className="orderInfo">
//                                                                         <div>
//                                                                             <div>Order Date: {order.createdAt && dateFormat(order.createdAt)}</div>
//                                                                         </div>
//                                                                         <div className="shipTo">
//                                                                             <div>Ship to:</div>
//                                                                             <div>
//                                                                                 <div>{order.firstName} {order.lastName}</div>
//                                                                                 <div>{order.address}</div>
//                                                                                 <div>{order.city}, {order.state} {order.zipCode}</div>
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                     <div className="items">
//                                                                         <table>
//                                                                             <thead>
//                                                                                 <tr>
//                                                                                     <th>Item</th>
//                                                                                     <th>Qty</th>
//                                                                                     <th>Price</th>
//                                                                                     <th>Order Item Status</th>
//                                                                                 </tr>
//                                                                             </thead>
//                                                                             <tbody>
//                                                                                 {order.CartItems?.map(item => (
//                                                                                     <tr key={item.Listing?.id}>
//                                                                                         <td><Link to={`/listings/${item.Listing?.id}`} target="_blank" rel="noopener noreferrer">{item.Listing?.plantName}</Link> ({price(item.Listing?.price)}/ea)</td>
//                                                                                         <td>{item.cartQty}</td>
//                                                                                         <td>
//                                                                                             <div>{price(item.cartQty * item.Listing?.price)}</div>
//                                                                                         </td>
//                                                                                         <td>{item.orderStatus}</td>
//                                                                                     </tr>
//                                                                                 ))}
//                                                                                 <tr>
//                                                                                     <td>Total</td>
//                                                                                     <td>{orderTotalItems}</td>
//                                                                                     <td>{price(orderTotalEarnings)}</td>
//                                                                                 </tr>
//                                                                             </tbody>
//                                                                         </table>
//                                                                     </div>
//                                                                     <hr />
//                                                                 </div>
//                                                             );
//                                                         })}
//                                                     </div>
//                                                 )}
//                                         </div>
//                                     </div>

//                                 )}
//                             </div>
//                         )
//                     )}
//                 </div>
//             </div>
//         </>
//     );
// }

// export default ManageOrders;
