
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

export const fetchListingResults = (searchQuery, filters = {}) => async (dispatch) => {
    let url = '/api/search';
    const queryParams = [];

    if (searchQuery) {
        queryParams.push(`search=${searchQuery}`)
        // dispatch(setSearchTerm(searchQuery))
    }

    if (filters) {
        // let filtered = Object.values(filters)
        // queryParams.push(filtered.join(''))
        for (const [key, value] of Object.entries(filters)) {
            if (value !== undefined) queryParams.push(`${key}=${value}`)
        }
    }
    if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`
    }

    console.log("QUERY", queryParams);
    console.log("URL", url);
    console.log("FILTERS", filters);
    const res = await fetch(url);
    console.log("SEARCH RES", res);
    if (res.ok) {
        const listings = await res.json();
        dispatch(loadListingResults(listings))
        console.log("LISTINGS HERE", listings);
    } else if (res.status === 404) {
        dispatch(loadListingResults([]))
    } else {
        const errors = await res.json();
        return errors;
    }
}

const initialState = {
    searchTerm: '',
    listings: []
}
const searchReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SEARCH_TERM: {
            console.log("ACTION!!", action.searchTerm);
            return {
                ...state,
                searchTerm: action.searchTerm
            }
        }
        case LOAD_LISTING_RESULTS: {
            const listingsState = {};
            if (action.listings && action.listings.Listings) {
                action.listings.Listings.forEach(listing => {
                    listingsState[listing.id] = listing;
                });
            }
            // return listingsState;
            return {
                ...state,
                ...listingsState
            }
        }

        default:
            return { ...state }
    }
}

export default searchReducer
