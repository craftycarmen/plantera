import { useDispatch, useSelector } from "react-redux";
import { fetchAllListings } from "../../../store/listings";
import { fetchListingResults } from "../../../store/search";
import { useEffect, useState } from "react";
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


    const handleFilterToggle = () => {
        setShowFilter(!showFilter);
    };

    const listingsContainerStyle = {
        marginLeft: showFilter ? '270px' : '0',
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
        setDisplayCount(8)
        setLoading(true)
    }

    const displayedListings = filters ? Object.values(filteredListings).slice(0, displayCount) : Object.values(listings).slice(0, displayCount);

    const handleShowMore = () => {
        setDisplayCount(prevCount => prevCount + 8);
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
                <div className="listingsContainer" style={listingsContainerStyle}>
                    {displayedListings.length === 0 ? (
                        <>
                            <div>No results found. Please refine or clear filters.</div>
                        </>
                    ) : (
                        <>
                            {displayedListings.map((listing) => (
                                <div key={listing.id}>
                                    <Link to={`/listings/${listing.id}`}>
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
                            {filters ? (filteredListings.length > displayCount && (
                                <div style={{ width: "100%", textAlign: "center" }}>
                                    <button onClick={handleShowMore} style={{ width: "fit-content" }}>Show More</button>
                                </div>
                            )) : (listings.length > displayCount && (
                                <div style={{ width: "100%", textAlign: "center" }}>
                                    <button onClick={handleShowMore} style={{ width: "fit-content" }}>Show More</button>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            )
            }
        </>
    );
}

export default Listings
