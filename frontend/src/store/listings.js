import { csrfFetch } from './csrf';

const LOAD_ALL_LISTINGS = 'listings/LOAD_ALL_LISTINGS';
const LOAD_ONE_LISTING = 'listings/LOAD_ONE_LISTING';
const CREATE_LISTING = 'listings/CREATE_LISTING';

export const loadAllListings = (listings) => ({
    type: LOAD_ALL_LISTINGS,
    listings
});

export const loadOneListing = (listing) => ({
    type: LOAD_ONE_LISTING,
    listing
});

export const createListing = (listing) => ({
    type: CREATE_LISTING,
    listing
});

export const fetchAllListings = () => async (dispatch) => {
    const res = await fetch('/api/listings');

    if (res.ok) {
        const listings = await res.json();
        dispatch(loadAllListings(listings));
        return listings;
    } else {
        const errors = await res.json();
        return errors;
    }
}

export const fetchOneListing = (listingId) => async (dispatch) => {
    const res = await fetch(`/api/listings/${listingId}`)

    if (res.ok) {
        const listing = await res.json();
        dispatch(loadOneListing(listing));
        return listing;
    } else {
        const errors = await res.json();
        return errors;
    }
}

export const addListing = (listing) => async (dispatch) => {
    const res = await csrfFetch('/api/listings', {
        method: 'POST',
        body: JSON.stringify(listing)
    });

    if (res.ok) {
        const listing = await res.json();
        dispatch(createListing(listing));
        return listing;
    } else {
        const errors = await res.json();
        return errors;
    }
}

const listingsReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_ALL_LISTINGS: {
            const listingsState = { ...state };
            action.listings.Listings.forEach(listing => {
                listingsState[listing.id] = listing;
            });

            return listingsState;
        }

        case LOAD_ONE_LISTING: {
            return { ...state, [action.listing.id]: action.listing }
        }

        case CREATE_LISTING: {
            const listingState = {}
            listingState[action.listing.id] = action.listing
            return listingState
        }
        default:
            return { ...state }
    }
}

export default listingsReducer
