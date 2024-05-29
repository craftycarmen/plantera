import { useDispatch, useSelector } from "react-redux";
import { fetchAllListings } from "../../../store/listings";
import { fetchListingResults } from "../../../store/search";
import { useCallback, useEffect, useState, useRef } from "react";
import './Listings.css';
import { Link } from "react-router-dom";
import { price, listingName } from "../../../../utils";
import FilterButton from "../../Filter/FilterButton";

function Listings() {
    const dispatch = useDispatch();
    const ulRef = useRef();
    const [sortOrder, setSortOrder] = useState('newest');
    let listings = Object.values(useSelector((state) => state.listings))
        .filter(listing => listing.stockQty > 0)
    let filteredListings = Object.values(useSelector((state) => state.search))
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
    filteredListings = sortedListings(filteredListings)

    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useState(null);
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [displayCount, setDisplayCount] = useState(8);
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
    const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024 && window.innerWidth >= 481);
    const getColumns = (width) => {
        if (width >= 1425) return 8;
        if (width <= 1424 && width >= 1190) return 3;
        if (width >= 992) return 4;
        if (width >= 768) return 4;
        return 4;
    }
    const [columns, setColumns] = useState(getColumns(window.innerWidth));

    const handleFilterToggle = () => {
        setShowFilter(!showFilter);
        setShowSortMenu(false)
    };

    const handleResize = useCallback(() => {
        setIsMobile(window.innerWidth <= 480);
        setIsTablet(window.innerWidth <= 1024 && window.innerWidth >= 481);

        const newColumns = (getColumns(window.innerWidth));
        setColumns(newColumns);
        setDisplayCount(newColumns);

    }, []);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize)
    }, [handleResize]);

    const calculateDisplayCount = (currCount) => {
        const rows = Math.ceil(currCount / columns);
        return rows * columns;
    }

    useEffect(() => {
        setDisplayCount(columns * 2);
    }, [columns]);

    const listingsContainerStyle = {
        marginLeft: (!isTablet && !isMobile) && showFilter ? '270px' : '0',
        marginRight: (!isTablet && !isMobile) && showSortMenu ? '230px' : '0',
        transition: 'margin-left 0.2s ease-in-out, margin-right 0.2s ease-in-out'
    };

    useEffect(() => {
        if (!showSortMenu || !ulRef.current) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowSortMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showSortMenu]);

    useEffect(() => {
        dispatch(fetchAllListings());
    }, [dispatch]);

    useEffect(() => {
        if (filters) {
            setLoading(true);
            dispatch(fetchListingResults(null, filters)).then(() => setTimeout(() => {
                setLoading(false);
            }, 500))
        }
    }, [dispatch, filters]);

    const handleFilterChange = (filterParams) => {
        setFilters(filterParams)
        setDisplayCount(columns * 2)
        setLoading(true)
    }

    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowSortMenu(!showSortMenu);
    }

    const handleSort = (order) => {
        setSortOrder(order);
        setShowSortMenu(false);
    }
    const handleShowMore = () => {
        const newCount = calculateDisplayCount(displayCount + columns);
        setDisplayCount(newCount);
    }

    const ulClassName = "sort-dropdown" + (showSortMenu ? "" : " hidden");

    const displayedListings = filters ? Object.values(filteredListings).slice(0, displayCount) : Object.values(listings).slice(0, displayCount);

    return (displayedListings &&
        <>
            <h1>Shop</h1>
            <div>Shop for plants from fellow plant lovers!</div>
            <br />
            <div className="filterSort">
                <FilterButton onFilterToggle={handleFilterToggle} onFilterChange={handleFilterChange} />
                <div className="sortButtonWrapper">
                    <span className="sortButton" onClick={toggleMenu}>
                        <i className="fa-solid fa-sort" /> Sort
                    </span>
                    <div className="outerSortWrapper">
                        {showSortMenu && (
                            <div className={ulClassName} ref={ulRef}>
                                <a onClick={() => handleSort('newest')}>Newest</a>
                                <a onClick={() => handleSort('oldest')}>Oldest</a>
                                <a onClick={() => handleSort('aToZ')}>Plant Name: A to Z</a>
                                <a onClick={() => handleSort('zToA')}>Plant Name: Z to A</a>
                                <a onClick={() => handleSort('lowToHigh')}>Price: Low to High</a>
                                <a onClick={() => handleSort('highToLow')}>Price: High to Low</a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="listingsContainer" style={listingsContainerStyle}>
                {loading ? (
                    <div className="dots"></div>
                ) : (
                    <>
                        {displayedListings.length === 0 ? (
                            <>
                                <div>No results found. Please refine or clear filters.</div>
                            </>
                        ) : (
                            <>
                                {displayedListings.map((listing) => (
                                    <div key={listing.id}>
                                        <Link to={`/listings/${listing.id}`} target="_blank" rel="noopener noreferrer">
                                            <div className="listingImageContainer">
                                                <img className="listingImage" src={listing.ListingImages?.[0]?.url} />
                                            </div>
                                            <div className="listingInfo">
                                                <h2>{listingName(listing.plantName)}</h2>
                                                <div className="listingPrice" style={{ marginTop: "3px" }}>{price(listing.price)}</div>
                                                <div>from {listing.Seller?.username}</div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </>
                        )}
                        <div className="showMoreDiv" style={listingsContainerStyle} >
                            {filters ? (filteredListings.length > displayCount && (

                                <button onClick={handleShowMore} style={{ width: "fit-content" }}>Show More</button>

                            )) : (listings.length > displayCount && (

                                <button onClick={handleShowMore} style={{ width: "fit-content" }}>Show More</button>

                            ))}
                        </div>
                    </>
                )

                }
            </div>
        </>
    );
}

export default Listings
