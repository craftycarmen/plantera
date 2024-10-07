import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchShopReviews } from "../../../../store/reviews.js";
import { monthDayYear } from "../../../../../utils.js";
import { stars } from "../../../../../utils.jsx";
import ReviewTabs from "./ReviewTabs.jsx";

function ListingReviews({ listing, avgStars, numReviews }) {
    const dispatch = useDispatch();
    const listingReviews = Object.values(useSelector(state => state.reviews.reviews)).filter(review => review.Listing.id === listing.id).sort((a, b) => (b.id - a.id));
    const shopReviews = Object.values(useSelector(state => state.reviews.reviews)).sort((a, b) => (b.id - a.id));

    useEffect(() => {
        const fetchData = async () => {
            // await dispatch(fetchListingReviews(listing.id));
            if (listing && listing.Seller && listing.Seller.id) {
                await dispatch(fetchShopReviews(listing.Seller.id))
            }
        }
        fetchData()
    }, [dispatch, listing])

    return (numReviews > 0 &&
        <>
            <h2>Reviews</h2>
            <div>{numReviews === 0 ? (<span></span>) : (<span>{stars(avgStars)} ({numReviews})</span>)}</div>
            <div className={`reviewsSection ${listingReviews?.length === 0 ? 'shopReviewsOnly' : ''}`}>
                <ReviewTabs listingId={listing?.id} listingReviews={listingReviews?.length} shopReviews={shopReviews?.length} />
                <div>
                    {listingReviews?.length > 0 &&
                        <>
                            {listingReviews?.map((review) => (
                                <div key={review.id}>
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
                                            <div className="reviewStars">{stars(review.stars)}</div>
                                            <div>{review.review}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    }
                </div>
                {/* <div>
                    <h3>Shop Reviews ({shopReviews.length})</h3>
                    {shopReviews?.map((review) => (
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
                    ))}
                </div> */}
            </div>
        </>
    )
}

export default ListingReviews
