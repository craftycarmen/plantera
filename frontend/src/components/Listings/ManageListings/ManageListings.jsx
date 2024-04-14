import { useDispatch, useSelector } from "react-redux";
import { fetchOwnedListings } from "../../../store/listings";
import { useEffect } from "react";
import DeleteListingModal from "../DeleteListingModal";
import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";
import { Link } from "react-router-dom";
import { soldOut } from "../../../../utils";

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
                    {listings.map(listing => (
                        listing.stockQty > 4 &&
                        <div key={listing.id}>

                            {listing.plantName}
                            <div>Quantity: {listing.stockQty}</div>
                            <div>
                                <Link to={`/listings/${listing.id}/edit`}>Edit</Link>
                            </div>
                            <OpenModalMenuItem
                                itemText={<span>Delete</span>}
                                modalComponent={<DeleteListingModal listingId={listing.id} />}
                            />
                        </div>
                    ))}
                    <h2>Sold Listings</h2>
                    {listings.map(listing => (
                        listing.stockQty === 1 &&
                        <div key={listing.id}>

                            {listing.plantName}
                            <div>Quantity: {listing.stockQty && soldOut(listing.stockQty)}</div>
                        </div>
                    ))}
                </div>

            }

        </>
    )
}

export default ManageListings
