import { useDispatch, useSelector } from "react-redux";
import { fetchAllListings } from "../../../store/listings";
import { fetchListingResults } from "../../../store/search";
import { useEffect, useState } from "react";
import './Listings.css';
import { Link } from "react-router-dom";
import { price, plantName } from "../../../../utils";
import FilterButton from "../../Filter/FilterButton";

function Listings() {
    const dispatch = useDispatch();
    const listings = Object.values(useSelector((state) => state.listings))
        .filter(listing => listing.stockQty > 0)
        .sort((a, b) => b.id - a.id)
    const filteredListings = useSelector((state) => state.search);
    const [error, setError] = useState(null)
    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useState(null)


    const handleFilterToggle = () => {
        setShowFilter(!showFilter);
    };

    const listingsContainerStyle = {
        marginLeft: showFilter ? '300px' : '0',
        transition: 'margin-left 0.2s ease-in-out'
    };


    useEffect(() => {
        dispatch(fetchAllListings())
    }, [dispatch])

    useEffect(() => {
        if (filters) dispatch(fetchListingResults(null, filters))
    }, [dispatch, filters])

    const handleFilterChange = (filterParams) => {
        setFilters(filterParams)
    }

    const displayedListings = filters ? Object.values(filteredListings) : Object.values(listings)

    return (displayedListings &&
        <>
            <h1>Shop</h1>
            <div>Shop for plants from fellow plant lovers!</div>
            <br />
            <FilterButton onFilterToggle={handleFilterToggle} onFilterChange={handleFilterChange} />
            <br />
            <div className="listingsContainer" style={listingsContainerStyle}>
                {
                    displayedListings.map((listing) => (
                        <div key={listing.id}>
                            <Link to={`/listings/${listing.id}`}>
                                <div className="listingImageContainer">
                                    <img
                                        className="listingImage"
                                        src={listing.ListingImages[0].url} />
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
    )
}

export default Listings
