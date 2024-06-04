import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOwnedShopOrders } from "../../../store/sell";

function SellerDashboard() {
    const dispatch = useDispatch();

    const shopOrders = Object.values(useSelector((state) => state.sell))

    useEffect(() => {
        dispatch(fetchOwnedShopOrders())
    }, [dispatch]);

    console.log(shopOrders);

    const totalItems = shopOrders.reduce((total, order) => {
        return total + (order.cartQty || 0)
    }, 0);

    const totalOrders = new Set(shopOrders.map(order => order.orderId)).size;

    let earnings = 0;

    shopOrders.forEach(order => {
        let orderTotal = order.Listing.price * order.cartQty
        earnings = earnings + orderTotal
    })

    console.log(earnings);

    return (
        <>
            <div>Seller Dashboard</div>
            {shopOrders &&
                <>
                    <div>{totalItems} total items sold</div>
                    <div>{totalOrders} total orders</div>
                    <div>${earnings} total earninigs</div>
                </>
            }

        </>
    )
}

export default SellerDashboard
