import { useDispatch, useSelector } from "react-redux";
import { fetchAllListings } from "../../../store/listings";
import { useEffect } from "react";
import './Listings.css';
import { Link } from "react-router-dom";

function Listings() {
    const dispatch = useDispatch();
    const listings = Object.values(useSelector((state) => state.listings)).filter(listing => listing.stockQty > 0)

    useEffect(() => {
        dispatch(fetchAllListings())
    }, [dispatch])

    return (listings &&
        <>
            <h1>Shop</h1>
            <div>Shop for plants from fellow plant lovers!</div>
            <br />
            <div className="listingsContainer">
                {
                    listings.map((listing) => (
                        <div key={listing.id}>
                            <Link to={`/listings/${listing.id}`}>
                                <div className="listingImageContainer">
                                    <img
                                        className="listingImage"
                                        src={listing.ListingImages[0].url} />
                                </div>
                                <div className="listingInfo">
                                    <h2>{listing.plantName}</h2>
                                    <span>${listing.price}</span>
                                </div>
                                <div>from {listing.Seller?.username}
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
