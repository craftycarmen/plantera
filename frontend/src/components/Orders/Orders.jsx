import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOwnedBuyerOrders } from "../../store/order";
import { Link } from "react-router-dom";
import './Orders.css';
import ErrorHandling from "../ErrorHandling";

function Orders() {
    const dispatch = useDispatch();

    const sessionUser = useSelector(state => state.session.user);
    const orders = Object.values(useSelector(state => state.orders)).sort((a, b) => (b.id - a.id));
    console.log(orders)
    useEffect(() => {
        dispatch(fetchOwnedBuyerOrders())
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

    return (
        <>
            {!sessionUser ? (<ErrorHandling />) : (
                <>
                    <h1>Orders</h1>
                    <div>Review your orders below.</div>
                    <br />
                    {orders?.length === 0 ? (
                        <div>No orders placed yet. <Link to='/listings'>Shop now!</Link></div>
                    ) :
                        (

                            <div className="orderWrapper">{orders?.map(order => (
                                <>
                                    <div className="orderSection">

                                        <h3> <Link to={`/order/${order.id}`}>Order #{order.id}</Link></h3>
                                        <div>Order Date: {order.createdAt && dateFormat(order.createdAt)}</div>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Qty</th>
                                                    <th>Item</th>
                                                    <th>Seller</th>
                                                    <th>Order Item Status</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {order?.CartItems?.map(item => (
                                                    <tr key={item.id}>
                                                        <td>{item.cartQty}</td>
                                                        <td><Link to={`/listings/${item.Listing?.id}`} target="_blank" rel="noopener noreferrer">{item.Listing?.plantName}</Link></td>
                                                        <td><Link to={`/user/${item.Listing?.Seller?.id}/shop`} target="_blank" rel="noopener noreferrer">{item.Listing?.Seller?.username}</Link></td>
                                                        <td>{item.orderStatus}</td>
                                                    </tr>

                                                ))}
                                            </tbody>

                                        </table>
                                    </div>
                                    <hr />
                                </>
                            ))}
                            </div>
                        )}
                </>
            )}

        </>
    )
}

export default Orders;
