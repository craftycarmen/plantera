import { csrfFetch } from "./csrf";

const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS';
// const LOAD_SHOP_REVIEWS = 'reviews/LOAD_SHOP_REVIEWS';
const CREATE_REVIEW = 'reviews/CREATE_REVIEW';

export const loadReviews = (reviews) => ({
    type: LOAD_LISTING_REVIEWS,
    reviews
});

// export const loadShopReviews = (reviews) => ({
//     type: LOAD_SHOP_REVIEWS,
//     reviews
// });

export const createReview = (review) => ({
    type: CREATE_REVIEW,
    review
});

export const fetchListingReviews = (listingId) => async (dispatch) => {
    const res = await fetch(`/api/listings/${listingId}/reviews`)

    if (res.ok) {
        const reviews = await res.json();
        dispatch(loadReviews(reviews));
        return reviews
    } else {
        const errors = await res.json();
        return errors;
    }
}

export const fetchShopReviews = (userId) => async (dispatch) => {
    const res = await fetch(`/api/user/${userId}/reviews`)

    if (res.ok) {
        const reviews = await res.json();
        dispatch(loadReviews(reviews));
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

const reviewsReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_REVIEWS: {
            const reviewsState = {}

            if (action.review.Reviews !== 'No reviews found') {
                action.review.Reviews.forEach(review => {
                    reviewsState[review.id] = review;
                })
                return reviewsState
            } else {
                return state
            }
        }

        case CREATE_REVIEW: {
            return { ...state, [action.review.id]: action.review };
        }

        default:
            return { ...state }
    }
}

export default reviewsReducer
