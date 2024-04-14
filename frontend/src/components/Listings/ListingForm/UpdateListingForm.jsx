import { useParams } from "react-router-dom";
import ListingForm from "./ListingForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchOneListing } from "../../../store/listings";

function UpdateListingForm() {
    const { listingId } = useParams();
    const listing = useSelector(state => (
        state.listings[listingId]
    ));
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchOneListing(listingId));
    }, [dispatch, listingId]);

    if (!listing) return (<>No listings found</>)

    return (
        Object.keys(listing).length > 1 && (
            <>
                <ListingForm
                    listing={listing}
                    formType="Update Listing"
                />
            </>
        )
    )
}

export default UpdateListingForm
