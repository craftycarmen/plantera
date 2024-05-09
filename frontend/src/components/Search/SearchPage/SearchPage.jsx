import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { price, plantName } from "../../../../utils";
import { fetchListingResults } from "../../../store/search";
import FilterButton from "../../Filter/FilterButton";

function SearchPage() {
    const dispatch = useDispatch()
    const listings = Object.values(useSelector(state => state.search))
    const [error, setError] = useState(null)
    const { search: urlSearchTerm } = useParams();
    const searchTermRedux = useSelector(state => state.search.searchTerm);
    const [showFilter, setShowFilter] = useState(false);
    const filterRef = useRef(null);

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
    console.log("SEARCH", listings);

    const results = (length) => {
        if (length === 1) return `${length} result`
        else return `${length} results`
    }

    useEffect(() => {
        if (searchTerm) {
            setError(null)
            localStorage.setItem('searchTerm', searchTerm)
            dispatch(fetchListingResults(searchTerm))
                .catch(error => {
                    setError('No listings found')
                    console.error('Error fetching listings:', error);
                })
        } else {
            localStorage.removeItem('searchTerm');
        }
    }, [dispatch, searchTerm]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                setShowFilter(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleFilterToggle = () => {
        setShowFilter((prevShowFilter) => !prevShowFilter);
    };

    return (
        <>
            <h1>Search Results</h1>
            {error || listings.length === 0 ? (
                <>
                    <div>No results found.</div>
                    <br />
                    <FilterButton searchTerm={searchTerm} onFilterToggle={handleFilterToggle} />
                </>
            ) : (
                <>
                    <div>{listings.length && results(listings.length)} for &#34;{searchTerm}&#34;</div>
                    <br />
                    <FilterButton searchTerm={searchTerm} onFilterToggle={handleFilterToggle} />
                    <br />
                    <div className={`listingsContainer${showFilter ? ' rightPosition' : ''}`} ref={filterRef}>
                        {
                            listings && listings?.map((listing) => (
                                listing && (
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
                                )
                            ))
                        }
                    </div>
                </>
            )}
        </>
    )
}

export default SearchPage
