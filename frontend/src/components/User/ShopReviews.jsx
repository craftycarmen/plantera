import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { monthDayYear } from "../../../utils.js";
import { stars } from "../../../utils.jsx";


function ShopReviews() {
    const shopReviews = Object.values(useSelector(state => state?.reviews?.reviews)).sort((a, b) => (b.id - a.id));
    return (
        shopReviews?.map((review) => (
            <div key={review.id} className="reviews">
                <div className="reviewer">
                    <div className="reviewerImageContainer">
                        <Link to={`/user/${review.Reviewer.id}`}>
                            <img
                                className="reviewerImage"
                                src={review.Reviewer.UserImages[0].url} />
                            <div className="reviewerImage-outline"></div>
                        </Link>
                    </div>
                    <div>
                        <div><Link to={`/user/${review.Reviewer.id}`}>{review.Reviewer.username}</Link> &#183; {monthDayYear(review.updatedAt)}</div>
                        <div className="reviewStars">{stars(review.stars)}
                            <div style={{ fontStyle: "italic" }}><Link to={`/listings/${review.Listing.id}`}>{review.Listing.plantName}</Link></div>
                        </div>
                        <div>{review.review}</div>
                    </div>
                </div>
            </div>
        ))
    )
}

export default ShopReviews
