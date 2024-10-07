import { Link, useLocation } from "react-router-dom"
import './ManageOrders.css';

function ReviewTabs() {
    const location = useLocation();
    return (
        <div className="orderTabs">

            {location.pathname === `/listings/${listingId}/reviews` ? (<div className="currentTab"><h3>Listing Reviews</h3></div>) : (<div><Link to='/sell/orders'><h3>Shop Reviews</h3></Link></div>)}

            {location.pathname === `/listings/${listingId}/shop-reviews` ? (<div className="currentTab"><h3>Fulfilled Orders</h3></div>) : (<div><Link to='/sell/orders/fulfilled'><h3>Fulfilled Orders</h3></Link></div>)}

        </div>
    )
}

export default ReviewTabs
