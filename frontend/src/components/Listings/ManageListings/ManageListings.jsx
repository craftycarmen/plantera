import { useDispatch, useSelector } from "react-redux";
import { fetchOwnedListings } from "../../../store/listings";
import { useEffect } from "react";
import DeleteListingModal from "../DeleteListingModal";
import OpenModalButton from "../../OpenModalButton";
import { Link } from "react-router-dom";
import './ManageListings.css';

function ManageListings() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user)
    const userId = sessionUser?.id;
    const listings = Object.values(useSelector(state => state.listings)).filter(listing => listing.sellerId = userId);

    const activeListings = listings.filter(listing => listing.stockQty > 0)
    const soldListings = listings.filter(listing => listing.stockQty === 0)

    useEffect(() => {
        dispatch(fetchOwnedListings())
    }, [dispatch])

    return (sessionUser &&
        <>
            <h1>Manage Your Listings</h1>

            <div>
                <h2>Active Listings</h2>
                <div className="listingsContainer">
                    {listings && activeListings?.length === 0 ? (
                        <div>No active listings!</div>
                    ) : (
                        activeListings.map(listing => (
                            <div key={listing.id}>
                                <Link to={`/listings/${listing.id}`}>
                                    <div className="listingImageContainer">
                                        <img
                                            className="listingImage"
                                            src={listing.ListingImages[0].url} />
                                    </div>
                                    <div className="listingNamePrice">
                                        <h2>{listing.plantName}</h2>
                                        <span>${listing.price}</span>
                                    </div>
                                </Link>
                                <div className="listingNamePrice">
                                    <div>Quantity: {listing.stockQty}</div>
                                    <div>
                                        <Link to={`/listings/${listing.id}/edit`}><button>Edit</button></Link>
                                        <OpenModalButton
                                            buttonText="Delete"
                                            modalComponent={<DeleteListingModal listingId={listing.id} />}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    )
                    }
                </div>

                <h2>Sold Listings</h2>
                <div className="listingsContainer">
                    {listings && soldListings?.length === 0 ? (
                        <div>No sold listings!</div>
                    ) : (
                        soldListings.map(listing => (
                            <div key={listing.id}>
                                <Link to={`/listings/${listing.id}`}>
                                    <div className="listingImageContainer soldOutImage">
                                        <img
                                            className="listingImage"
                                            src={listing.ListingImages[0].url} />
                                    </div>
                                    <div className="listingNamePrice">
                                        <h2>{listing.plantName}</h2>
                                        <span>${listing.price}</span>
                                    </div>
                                </Link>
                            </div>
                        ))
                    )
                    }
                </div>
            </div>



        </>
    )
}

export default ManageListings
