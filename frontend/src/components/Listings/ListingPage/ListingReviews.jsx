import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchShopReviews } from "../../../store/reviews";
import { monthDayYear, stars } from "../../../../utils";

function ListingReviews({ listing }) {
    const dispatch = useDispatch();
    const listingReviews = Object.values(useSelector(state => state.reviews.reviews)).filter(review => review.Listing.id === listing.id).sort((a, b) => (b.id - a.id));
    const shopReviews = Object.values(useSelector(state => state.reviews.reviews)).sort((a, b) => (b.id - a.id));
    // const reviews = useSelector(state => state.reviews)
    console.log("REVIEWS", listingReviews)

    listingReviews.map(review => {
        console.log("HIIII", review.Reviewer.UserImages[0].url)
    })
    useEffect(() => {
        const fetchData = async () => {
            // await dispatch(fetchListingReviews(listing.id));
            await dispatch(fetchShopReviews(listing.Seller.id))
        }
        fetchData()
    }, [dispatch, listing.Seller.id])

    return (
        <>
            <h2>Reviews</h2>

            <h3>Listing Reviews ({listingReviews.length})</h3>
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

            <h3>Shop Reviews ({shopReviews.length})</h3>
            {shopReviews?.map((review) => (
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
                            <div className="reviewStars">{stars(review.stars)} &#183; <Link to={`/listings/${review.Listing.id}`}>{review.Listing.plantName}</Link></div>
                            <div>{review.review}</div>
                        </div>
                    </div>
                </div>
            ))}

        </>
    )
}

export default ListingReviews
