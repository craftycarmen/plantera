import { csrfFetch } from "./csrf";

// const LOAD_LISTING_REVIEWS = 'reviews/LOAD_LISTING_REVIEWS';
const LOAD_SHOP_REVIEWS = 'reviews/LOAD_SHOP_REVIEWS';
const CREATE_REVIEW = 'reviews/CREATE_REVIEW';

// export const loadListingReviews = (reviews) => ({
//     type: LOAD_LISTING_REVIEWS,
//     reviews
// });

export const loadShopReviews = (reviews) => ({
    type: LOAD_SHOP_REVIEWS,
    reviews
});

export const createReview = (review) => ({
    type: CREATE_REVIEW,
    review
});

// export const fetchListingReviews = (listingId) => async (dispatch) => {
//     const res = await fetch(`/api/listings/${listingId}/reviews`)

//     if (res.ok) {
//         const reviews = await res.json();
//         dispatch(loadListingReviews(reviews));
//         return reviews
//     } else {
//         const errors = await res.json();
//         return errors;
//     }
// }

export const fetchShopReviews = (userId) => async (dispatch) => {
    const res = await fetch(`/api/user/${userId}/reviews`)

    if (res.ok) {
        const reviews = await res.json();
        dispatch(loadShopReviews(reviews));
        return reviews
    } else {
        const errors = await res.json();
        return errors;
    }
}

export const addReview = (listingId, review) => async (dispatch, getState) => {
    const sessionUser = getState().session.user;

    const res = await csrfFetch(`/api/listings/${listingId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...review, buyerId: sessionUser.id })
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(createReview(data));
        return data;
    } else {
        const errors = await res.json();
        return errors;
    }
}

const initialState = {
    reviews: {},
    avgStars: 0,
    numReviews: 0
};

const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {

        case LOAD_SHOP_REVIEWS: {
            console.log("ACTIONS", action.reviews.ShopReviews);
            const { avgStars, numReviews, Reviews } = action.reviews.ShopReviews;
            let shopReviewsState = {
                reviews: {},
                avgStars: avgStars,
                numReviews: numReviews
            }

            if (Reviews.length > 0) {
                Reviews.forEach(review => {
                    shopReviewsState.reviews[review.id] = review;
                });

                // shopReviewsState.avgStars = action.reviews.ShopReviews.avgStars;
                // shopReviewsState.numReviews = action.reviews.ShopReviews.numReviews;
                // console.log("STATEE", shopReviewsState);
            }
            return shopReviewsState;
        }
        case CREATE_REVIEW: {
            return { ...state, [action.review.id]: action.review };
        }

        default:
            return { ...state }
    }
}

export default reviewsReducer
