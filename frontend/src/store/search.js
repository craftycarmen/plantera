const LOAD_LISTING_RESULTS = 'search/LOAD_LISTING_RESULTS'

export const loadListingResults = (listings) => ({
    type: LOAD_LISTING_RESULTS,
    listings
})

export const fetchListingResults = (filters = {}) => async (dispatch) => {
    let url = '/api/search/';
    const queryParams = [];

    if (filters) {
        let filtered = Object.values(filters)
        queryParams.push(filtered.join(''))
    }

    if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`
    }

    const res = await fetch(url);

    if (res.ok) {
        const listings = await res.json();
        dispatch(loadListingResults(listings))
    }
}

const searchReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_LISTING_RESULTS: {
            const listingsState = { ...state };
            action.listings.Listings.forEach(listing => {
                listingsState[listing.id] = listing;
            });

            return listingsState;
        }
        default:
            return { ...state }
    }
}

export default searchReducer
