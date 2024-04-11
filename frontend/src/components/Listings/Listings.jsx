import { useDispatch, useSelector } from "react-redux";
import { fetchAllListings } from "../../store/listings";
import { useEffect } from "react";
import './Listings.css';

function Listings() {
    const dispatch = useDispatch();
    const listings = Object.values(useSelector((state) => state.listings))
    listings.map((listing) => {
        console.log(listing.ListingImages)

    })
    useEffect(() => {
        dispatch(fetchAllListings())
    }, [dispatch])

    return (listings &&
        <>
            <h1>Shop</h1>
            <div className="listingsContainer">
                {
                    listings.map((listing) => (
                        <div key={listing.id}>
                            <img
                                className="listingImage"
                                src={listing.ListingImages[0].url} />
                            <div>
                                <h2>{listing.plantName}</h2>
                                <div>${listing.price}</div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default Listings
