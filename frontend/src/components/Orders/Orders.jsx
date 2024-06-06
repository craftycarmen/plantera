import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOwnedBuyerOrders } from "../../store/order";

function Orders() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const userId = sessionUser?.id;
    const orders = Object.values(useSelector(state => state.orders));
    console.log(orders)
    useEffect(() => {
        dispatch(fetchOwnedBuyerOrders())
    }, [dispatch]);

    return (
        <>
            <h1>Orders</h1>
            <div>{orders?.map(order => (
                <>
                    <div>Orders</div>
                    <div>{order.id}</div>
                </>
            ))}
            </div>
        </>
    )
}

export default Orders;
