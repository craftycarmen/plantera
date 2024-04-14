import { useDispatch, useSelector } from "react-redux";
import { fetchOwnedListings } from "../../../store/listings";
import { useEffect } from "react";
import DeleteListingModal from "../DeleteListingModal";
import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";
import { Link } from "react-router-dom";
import { soldOut } from "../../../../utils";
import './ManageListings.css';

function ManageListings() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user)
    const userId = sessionUser?.id;
    const listings = Object.values(useSelector(state => state.listings)).filter(listing => listing.sellerId = userId);

    useEffect(() => {
        dispatch(fetchOwnedListings())
    }, [dispatch])

    return (sessionUser &&
        <>
            <h1>Manage Your Listings</h1>
            {listings &&
                <div>
                    <h2>Active Listings</h2>
                    <div className="listingsContainer">
                        {listings.map(listing => (
                            listing.stockQty > 0 &&
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
                                        <div><Link to={`/listings/${listing.id}/edit`}>Edit</Link>&nbsp;</div>

                                        <OpenModalMenuItem
                                            itemText={<span>Delete</span>}
                                            modalComponent={<DeleteListingModal listingId={listing.id} />}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <hr />
                    <h2>Sold Listings</h2>
                    <div className="listingsContainer">
                        {listings.map(listing => (
                            listing.stockQty === 0 &&
                            <div key={listing.id}>
                                <Link to={`/listings/${listing.id}`}>
                                    <div className="soldOutImage">
                                        <img
                                            className="listingImage"
                                            src={listing.ListingImages[0].url} />
                                    </div>
                                    <div className="listingNamePrice">
                                        <h2>{listing.plantName}</h2>
                                        <span>${listing.price}</span>
                                    </div>
                                </Link>
                                <div>Quantity: {listing.stockQty && soldOut(listing.stockQty)}</div>
                            </div>
                        ))}
                    </div>
                </div>

            }

        </>
    )
}

export default ManageListings
