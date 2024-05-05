import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { price, plantName } from "../../../../utils";
import { fetchListingResults, setSearchTerm } from "../../../store/search";

function SearchPage() {
    const dispatch = useDispatch()
    const listings = Object.values(useSelector(state => state.search))
    const { search: urlSearchTerm } = useParams();
    const searchTermRedux = useSelector(state => state.search.searchTerm);

    const getSearchFromLocal = () => {
        return localStorage.getItem('searchTerm')
    }

    const getSearchTerm = () => {
        const queryParams = new URLSearchParams(window.location.search);
        const searchTermFromURL = queryParams.get("search")
        return searchTermFromURL || getSearchFromLocal() || '';
    }

    const searchTerm = urlSearchTerm || searchTermRedux || getSearchTerm();

    console.log(searchTerm);
    console.log("SEARCH", searchTerm);

    const results = (length) => {
        if (length === 1) return `${length} result`
        else return `${length} results`
    }

    useEffect(() => {
        if (searchTerm) {
            dispatch(fetchListingResults(searchTerm));
            dispatch(setSearchTerm(searchTerm));
            localStorage.setItem('searchTerm', searchTerm);
        } else {
            localStorage.removeItem('searchTerm');
        }
    }, [dispatch, searchTerm]);


    return (
        <>
            <h1>Search Results</h1>
            {listings.length === 0 ? (
                <div>No results found.</div>
            ) : (
                <>
                    <div>{listings.length && results(listings.length)} for &#34;{searchTerm}&#34;</div>
                    <br />
                    <div className="listingsContainer">
                        {
                            listings && listings?.map((listing) => (
                                <div key={listing.id}>
                                    <Link to={`/listings/${listing.id}`}>
                                        <div className="listingImageContainer">
                                            <img
                                                className="listingImage"
                                                src={listing.ListingImages?.[0]?.url} />
                                        </div>
                                        <div className="listingInfo">
                                            <h2>{plantName(listing.plantName)}</h2>
                                            <div className="listingPrice" style={{ marginTop: "3px" }}>{price(listing.price)}</div>
                                            <div>from {listing.Seller?.username}
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        }
                    </div>
                </>
            )}
        </>
    )
}

export default SearchPage
