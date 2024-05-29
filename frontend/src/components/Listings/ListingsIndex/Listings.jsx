import { useDispatch, useSelector } from "react-redux";
import { fetchAllListings } from "../../../store/listings";
import { fetchListingResults } from "../../../store/search";
import { useCallback, useEffect, useState } from "react";
import './Listings.css';
import { Link } from "react-router-dom";
import { price, listingName } from "../../../../utils";
import FilterButton from "../../Filter/FilterButton";

function Listings() {
    const dispatch = useDispatch();
    const listings = Object.values(useSelector((state) => state.listings))
        .filter(listing => listing.stockQty > 0)
        .sort((a, b) => b.id - a.id)
    const filteredListings = Object.values(useSelector((state) => state.search))
        .filter(listing => listing.stockQty > 0)
        .sort((a, b) => b.id - a.id)
    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useState(null);
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
    };

    // const handleResize = () => {
    //     setIsMobile(window.innerWidth <= 480);
    //     setIsTablet(window.innerWidth <= 1024 && window.innerWidth >= 481);
    //     setColumns(getColumns(window.innerWidth));
    // }


    const handleResize = useCallback(() => {
        setIsMobile(window.innerWidth <= 480);
        setIsTablet(window.innerWidth <= 1024 && window.innerWidth >= 481);

        const newColumns = (getColumns(window.innerWidth));
        console.log("NEWCOLS", newColumns);
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
        marginTop: (isTablet || isMobile) && showFilter ? '0' : '0',
        transition: 'margin-left 0.2s ease-in-out'
    };


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

    const displayedListings = filters ? Object.values(filteredListings).slice(0, displayCount) : Object.values(listings).slice(0, displayCount);

    const handleShowMore = () => {
        const newCount = calculateDisplayCount(displayCount + columns);
        setDisplayCount(newCount);
    }

    console.log("DL", displayedListings.length);
    return (displayedListings &&
        <>
            <h1>Shop</h1>
            <div>Shop for plants from fellow plant lovers!</div>
            <br />
            <FilterButton onFilterToggle={handleFilterToggle} onFilterChange={handleFilterChange} />
            <br />
            {loading ? (
                <div style={listingsContainerStyle} className="dots"></div>
            ) : (
                <>
                    <div className="listingsContainer" style={listingsContainerStyle}>
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
                    </div>
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
        </>
    );
}

export default Listings
