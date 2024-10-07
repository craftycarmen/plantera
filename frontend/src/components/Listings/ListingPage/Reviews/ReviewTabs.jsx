import { Link, useLocation } from "react-router-dom"

function ReviewTabs({ listingId, listingReviews, shopReviews }) {
    const location = useLocation();
    return (
        <div className="orderTabs">

            {location.pathname === `/listings/${listingId}` ? (<div className="currentTab"><h3>Listing Reviews ({listingReviews})</h3></div>) : (<div><Link to={`/listings/${listingId}/shop-reviews`}><h3>Shop Reviews ({shopReviews})</h3></Link></div>)}

            {location.pathname === `/listings/${listingId}/shop-reviews` ? (<div className="currentTab"><h3>Listing Reviews ({listingReviews})</h3></div>) : (<div><Link to={`/listings/${listingId}/shop-reviews`}><h3>Shop Reviews  ({shopReviews})</h3></Link></div>)}

        </div>
    )
}

export default ReviewTabs
