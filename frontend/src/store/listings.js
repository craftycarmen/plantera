import { csrfFetch } from './csrf';

const LOAD_ALL_LISTINGS = 'listings/LOAD_ALL_LISTINGS';
const LOAD_ONE_LISTING = 'listings/LOAD_ONE_LISTING';
const CREATE_LISTING = 'listings/CREATE_LISTING';
const CREATE_LISTING_IMAGE = 'listings/CREATE_LISTING_IMAGE';

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

export const createListingImage = (post) => ({
    type: CREATE_LISTING_IMAGE,
    post
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
    const { plantName, description, price, potSize, stockQty, guideId, image } = listing;

    const formData = new FormData();
    formData.append("plantName", plantName);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("potSize", potSize);
    formData.append("stockQty", stockQty);
    formData.append("guideId", guideId);

    if (image) {
        formData.append("image", image)
        formData.append("imageable_id", listing.id)
        formData.append("imageable_type", "Listing")
    }

    const res = await csrfFetch('/api/listings', {
        method: 'POST',
        body: formData
        // body: JSON.stringify(listing)
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

        case CREATE_LISTING_IMAGE: {
            const imageState = { "images": [] }
            imageState["images"] = [action.post.image]
            return imageState
        }
        default:
            return { ...state }
    }
}

export default listingsReducer
