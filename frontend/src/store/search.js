
const LOAD_LISTING_RESULTS = 'search/LOAD_LISTING_RESULTS'
const SET_SEARCH_TERM = 'search/SET_SEARCH_TERM'

export const loadListingResults = (listings) => ({
    type: LOAD_LISTING_RESULTS,
    listings
})

export const setSearchTerm = (searchTerm) => ({
    type: SET_SEARCH_TERM,
    searchTerm
})

// export const fetchListingResults = (filters = {}) => async (dispatch) => {
//     let url = '/api/search';
//     const queryParams = [];

//     if (filters) {
//         let filtered = Object.values(filters)
//         queryParams.push(filtered.join(''))
//     }

//     if (queryParams.length > 0) {
//         url += `?${queryParams.join('&')}`
//     }

//     console.log("QUERY", queryParams);
//     console.log("URL", url);

export const fetchListingResults = (searchQuery) => async (dispatch) => {
    let url = '/api/search';
    const queryParams = [];

    if (searchQuery) {
        queryParams.push(`search=${searchQuery}`)
        dispatch(setSearchTerm(searchQuery))
    }

    if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`
    }

    console.log("QUERY", queryParams);
    console.log("URL", url);
    const res = await fetch(url);
    console.log("SEARCH RES", res);
    if (res.ok) {
        const listings = await res.json();
        dispatch(loadListingResults(listings))
    }
}

const searchReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_LISTING_RESULTS: {
            const listingsState = {};
            action.listings.Listings.forEach(listing => {
                listingsState[listing.id] = listing;
            });
            return listingsState;
        }
        case SET_SEARCH_TERM: {
            console.log("ACTION!!", action.searchTerm);
            return { ...state, searchTerm: action.searchTerm }
        }
        default:
            return { ...state }
    }
}

export default searchReducer
