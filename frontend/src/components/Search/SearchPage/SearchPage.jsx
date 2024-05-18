import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { price, listingName } from "../../../../utils";
import { fetchListingResults } from "../../../store/search";
import FilterButton from "../../Filter/FilterButton";

function SearchPage() {
    const dispatch = useDispatch();
    const listings = Object.values(useSelector(state => state.search))
        .filter(listing => listing.stockQty > 0)
        .sort((a, b) => b.id - a.id);
    const [error, setError] = useState(null);
    const { search: urlSearchTerm } = useParams();
    const searchTermRedux = useSelector(state => state.search.searchTerm);
    const [showFilter, setShowFilter] = useState(false);
    const [loading, setLoading] = useState(false);

    const getSearchFromLocal = () => {
        return localStorage.getItem('searchTerm');
    };

    const getSearchTerm = () => {
        const queryParams = new URLSearchParams(window.location.search);
        const searchTermFromURL = queryParams.get("search");
        return searchTermFromURL || getSearchFromLocal() || '';
    };

    const searchTerm = urlSearchTerm || searchTermRedux || getSearchTerm();

    const results = (length) => {
        if (length === 1) return `${length} result`;
        else return `${length} results`;
    };

    useEffect(() => {
        if (searchTerm) {
            setError(null);
            localStorage.setItem('searchTerm', searchTerm);
            setLoading(true); // Set loading to true before fetching
            dispatch(fetchListingResults(searchTerm))
                .then(() => {
                    setTimeout(() => {
                        setLoading(false); // Set loading to false after delay
                    }, 500); // Simulate loading delay
                })
                .catch(error => {
                    setError('No listings found');
                    setLoading(false); // Set loading to false on error
                    console.error('Error fetching listings:', error);
                });
        } else {
            localStorage.removeItem('searchTerm');
        }
    }, [dispatch, searchTerm]);

    const handleFilterToggle = () => {
        setShowFilter(!showFilter);
    };

    const handleFilterChange = (filterParams) => {
        setLoading(true); // Set loading to true before fetching
        dispatch(fetchListingResults(searchTerm, filterParams))
            .then(() => {
                setTimeout(() => {
                    setLoading(false); // Set loading to false after delay
                }, 500); // Simulate loading delay
            })
            .catch(error => {
                setError('No listings found');
                setLoading(false); // Set loading to false on error
                console.error('Error fetching listings:', error);
            });
    };

    const listingsContainerStyle = {
        marginLeft: showFilter ? '270px' : '0',
        transition: 'margin-left 0.2s ease-in-out'
    };

    return (
        <>
            <h1>Search Results</h1>
            {error || listings.length === 0 ? (
                <div className="noResultsContainer">
                    <div>No results found for &#34;{searchTerm}&#34;</div>
                    <br />
                    <FilterButton searchTerm={searchTerm} onFilterToggle={handleFilterToggle} onFilterChange={handleFilterChange} />
                </div>
            ) : (
                <>
                    <div>{results(listings.length)} for &#34;{searchTerm}&#34;</div>
                    <br />
                    <FilterButton searchTerm={searchTerm} onFilterToggle={handleFilterToggle} onFilterChange={handleFilterChange} />
                    <br />
                    <div className="listingsContainer" style={listingsContainerStyle}>
                        {loading ? (
                            <div className="dots"></div> // Ensure the loading dots are visible
                        ) : (
                            listings.map((listing) => (
                                listing && (
                                    <div key={listing.id}>
                                        <Link to={`/listings/${listing.id}`}>
                                            <div className="listingImageContainer">
                                                <img
                                                    className="listingImage"
                                                    src={listing.ListingImages?.[0]?.url} />
                                            </div>
                                            <div className="listingInfo">
                                                <h2>{listingName(listing.plantName)}</h2>
                                                <div className="listingPrice" style={{ marginTop: "3px" }}>{price(listing.price)}</div>
                                                <div>from {listing.Seller?.username}</div>
                                            </div>
                                        </Link>
                                    </div>
                                )
                            ))
                        )}
                    </div>
                </>
            )}
        </>
    );
}

export default SearchPage;
