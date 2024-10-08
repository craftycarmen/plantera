import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchShopReviews } from "../../../store/reviews.js";
import { monthDayYear } from "../../../../utils.js";
import { stars } from "../../../../utils.jsx";
import ShopReviews from "../../User/ShopReviews.jsx";

function ListingReviews({ listing, avgStars, numReviews }) {
    const dispatch = useDispatch();
    const [showShopReviews, setShowShopReviews] = useState(false);
    const listingReviews = Object.values(useSelector(state => state?.reviews?.reviews)).filter(review => review?.Listing?.id === listing?.id).sort((a, b) => (b.id - a.id));
    const listingReviewsNum = listingReviews?.length;
    const shopReviews = Object.values(useSelector(state => state?.reviews?.reviews)).sort((a, b) => (b.id - a.id));
    const shopReviewsNum = shopReviews?.length;

    useEffect(() => {
        const fetchData = async () => {
            // await dispatch(fetchListingReviews(listing.id));
            if (listing && listing.Seller && listing.Seller.id) {
                await dispatch(fetchShopReviews(listing.Seller.id))
            }
        }
        fetchData()
    }, [dispatch, listing])

    useEffect(() => {
        if (listingReviewsNum === 0) {
            setShowShopReviews(true);
        }
    }, [listingReviewsNum]);

    return (
        <section className="reviewsContainer">
            <div className="reviewsHeader">
                <h2>Reviews</h2>
                <span>{numReviews === 0 ? (<span></span>) : (<span>{stars(avgStars)} ({numReviews})</span>)}</span>
            </div>
            <div className="orderTabs" style={{ marginTop: "20px" }}>
                {listingReviewsNum > 0 ? (
                    <div className={showShopReviews ? "notCurrentTab" : "currentTab"}
                        onClick={() => setShowShopReviews(false)}>
                        <h3>Listing Reviews ({listingReviewsNum})</h3>
                    </div>
                ) : null}
                <div className={showShopReviews ? "currentTab" : "notCurrentTab"} onClick={() => setShowShopReviews(true)}>
                    <h3>Shop Reviews ({shopReviewsNum})</h3>
                </div>
            </div>
            <div style={{ marginTop: "20px" }}>
                {showShopReviews ? (
                    <ShopReviews />
                ) : (
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

                )}

            </div>
        </section>
    )
}

export default ListingReviews
