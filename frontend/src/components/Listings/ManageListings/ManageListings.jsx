import { useDispatch, useSelector } from "react-redux";
import { fetchOwnedListings } from "../../../store/listings";
import { useEffect } from "react";
import DeleteListingModal from "../DeleteListingModal";
import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";

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
                    {listings.map(listing => (
                        <div key={listing.id}>
                            {listing.plantName}
                            <OpenModalMenuItem
                                itemText={<span>Delete</span>}
                                modalComponent={<DeleteListingModal listingId={listing.id} />}
                            />
                        </div>
                    ))}
                </div>}
        </>
    )
}

export default ManageListings
