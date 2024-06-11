import { Link, useLocation } from "react-router-dom"
import './ManageOrders.css';

function ManageOrdersTabs() {
    const location = useLocation();
    return (
        <div className="orderTabs">

            {location.pathname === '/sell/orders' ? (<div className="currentTab"><h3>Unfulfilled Orders</h3></div>) : (<div><Link to='/sell/orders'><h3>Unfulfilled Orders</h3></Link></div>)}

            {location.pathname === '/sell/orders/fulfilled' ? (<div className="currentTab"><h3>Fulfilled Orders</h3></div>) : (<div><Link to='/sell/orders/fulfilled'><h3>Fulfilled Orders</h3></Link></div>)}

        </div>
    )
}

export default ManageOrdersTabs
