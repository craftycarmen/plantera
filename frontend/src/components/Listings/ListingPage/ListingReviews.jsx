import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchListingReviews } from "../../../store/reviews";
import { monthDayYear } from "../../../../utils";

function ListingReviews({ listing }) {
    const dispatch = useDispatch();
    const reviews = Object.values(useSelector(state => state.reviews)).sort((a, b) => (b.id - a.id));
    console.log("REVIEWS", reviews);
    useEffect(() => {
        const fetchData = async () => {
            await dispatch(fetchListingReviews(listing.id));
        }
        fetchData()
    }, [dispatch, listing.id])

    const stars = (num) => {
        let filledStars = [];
        let unfilledStars = [];

        for (let i = 0; i < parseInt(num); i++) {
            filledStars.push(<span className="stars">&#9733;</span>)
        }

        let remainingStars = 5 - num;

        for (let i = 0; i < parseInt(remainingStars); i++) {
            unfilledStars.push(<span className="stars">&#9734;</span>)
        }

        return [filledStars, unfilledStars]
    }

    return (
        <>
            <h2>Reviews</h2>
            <h3>Listing Reviews ({reviews.length})</h3>
            {reviews?.map((review) => (
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
    )
}

export default ListingReviews
