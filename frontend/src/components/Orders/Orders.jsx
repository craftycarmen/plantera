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
                                        <div>
                                            <div>Order Date: {order.createdAt && dateFormat(order.createdAt)}</div>
                                            {order?.CartItems.map(item => (
                                                <div key={item.id}>
                                                    <div>Order Status: {item.orderStatus}</div>
                                                </div>
                                            ))}

                                        </div>
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
