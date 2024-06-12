import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { price, listingName } from "../../../../utils";
import { fetchListingResults } from "../../../store/search";
import FilterButton from "../../Filter/FilterButton";
import SortListingsButton from "../../Listings/SortListingsButton/SortListingsButton";

function SearchPage() {
    const dispatch = useDispatch();

    const [sortOrder, setSortOrder] = useState('newest');
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [filtersApplied, setFiltersApplied] = useState(false);
    let listings = Object.values(useSelector(state => state.search))
        .filter(listing => listing.stockQty > 0)

    const sortedListings = (listings) => {
        switch (sortOrder) {
            case 'aToZ':
                return listings.sort((a, b) => a.plantName.localeCompare(b.plantName));
            case 'zToA':
                return listings.sort((a, b) => b.plantName.localeCompare(a.plantName));
            case 'lowToHigh':
                return listings.sort((a, b) => (a.price - b.price));
            case 'highToLow':
                return listings.sort((a, b) => (b.price - a.price));
            case 'oldest':
                return listings.sort((a, b) => (a.id - b.id));
            case 'newest':
            default:
                return listings.sort((a, b) => (b.id - a.id))

        }
    }

    listings = sortedListings(listings)

    const [error, setError] = useState(null);
    const { search: urlSearchTerm } = useParams();
    const searchTermRedux = useSelector(state => state.search.searchTerm);
    const [showFilter, setShowFilter] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
    const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024 && window.innerWidth >= 481);

    const getColumns = (width) => {
        if (width >= 1425) return 8;
        if (width <= 1424 && width >= 1190) return 3;
        if (width >= 992) return 4;
        if (width >= 768) return 4;
        return 4;
    };

    const [columns, setColumns] = useState(getColumns(window.innerWidth));
    const [displayCount, setDisplayCount] = useState(columns * 2);

    const getSearchFromLocal = () => {
        return localStorage.getItem('searchTerm');
    };

    const handleResize = useCallback(() => {
        setIsMobile(window.innerWidth <= 480);
        setIsTablet(window.innerWidth <= 1024 && window.innerWidth >= 481);

        const newColumns = getColumns(window.innerWidth);
        setColumns(newColumns);
        setDisplayCount(prevCount => calculateDisplayCount(prevCount, newColumns));
    }, []);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);

    const calculateDisplayCount = (currCount, columns) => {
        const rows = Math.ceil(currCount / columns);
        return rows * columns;
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
            setLoading(true);
            dispatch(fetchListingResults(searchTerm))
                .then(() => {
                    setTimeout(() => {
                        setLoading(false);
                    }, 500);
                })
                .catch(error => {
                    setError('No listings found');
                    setLoading(false);
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
        setFiltersApplied(true)
        setLoading(true);
        dispatch(fetchListingResults(searchTerm, filterParams))
            .then(() => {
                setTimeout(() => {
                    setLoading(false);
                }, 500);
            })
            .catch(error => {
                setError('No listings found');
                setLoading(false);
                console.error('Error fetching listings:', error);
            });
    };

    const handleSort = (order) => {
        setSortOrder(order);
        setShowSortMenu(false);
    }

    const toggleSortMenu = () => {
        setShowSortMenu(prevState => !prevState);
    };

    const listingsContainerStyle = {
        marginLeft: (!isTablet && !isMobile) && showFilter ? '270px' : '0',
        marginRight: (!isTablet && !isMobile) && showSortMenu ? '230px' : '0',
        transition: 'margin-left 0.2s ease-in-out'
    };


    const displayedListings = Object.values(listings).slice(0, displayCount);

    const handleShowMore = () => {
        const newCount = calculateDisplayCount(displayCount + columns, columns);
        setDisplayCount(newCount);
    };

    return (
        <>
            <h1>Search Results</h1>
            {error || displayedListings?.length === 0 && !filtersApplied ? (
                <div>No results found for &#34;{searchTerm}&#34;. Please try a different search term.</div>
            ) : (
                <>
                    <div>{results(listings?.length)} for &#34;{searchTerm}&#34;</div>
                    <br />
                    <div className="filterSort">
                        <FilterButton searchTerm={searchTerm} onFilterToggle={handleFilterToggle} onFilterChange={handleFilterChange} />
                        <SortListingsButton handleSort={handleSort} showSortMenu={showSortMenu} toggleSortMenu={toggleSortMenu} currentSortOrder={sortOrder} />
                    </div>
                </>
            )}
            <div className="listingsContainer" style={listingsContainerStyle}>
                {loading ? (
                    <div className="dots"></div>
                ) : (
                    <>
                        {displayedListings?.length === 0 ? (
                            <>
                                {filtersApplied &&
                                    <div>No results found with given filters. Please refine or clear filters.</div>
                                }
                            </>
                        ) : (
                            <>
                                {displayedListings?.map((listing) => (
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
                                ))}

                                {!loading &&
                                    <div className="showMoreDiv" style={listingsContainerStyle}>
                                        {listings.length > displayCount && (
                                            <button onClick={handleShowMore} style={{ width: "fit-content" }}>Show More</button>
                                        )}
                                    </div>
                                }
                            </>
                        )}
                    </>
                )}
            </div>
        </>
    )
}

export default SearchPage;
