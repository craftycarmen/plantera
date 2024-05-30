import { useDispatch, useSelector } from "react-redux";
import { fetchOwnedListings } from "../../../store/listings";
import { useEffect } from "react";
import DeleteListingModal from "../DeleteListingModal";
import OpenModalButton from "../../OpenModalButton";
import { Link } from "react-router-dom";
import './ManageListings.css';
import ErrorHandling from "../../ErrorHandling";
import { price, listingName } from "../../../../utils";

function ManageListings() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user)
    const userId = sessionUser?.id;
    const listings = Object.values(useSelector(state => state.listings)).filter(listing => listing.sellerId === userId);

    const activeListings = listings.filter(listing => listing.stockQty > 0).sort((a, b) => (b.id - a.id))
    const soldListings = listings.filter(listing => listing.stockQty === 0).sort((a, b) => {
        a = (new Date(a.updatedAt)).getTime();
        b = (new Date(b.updatedAt)).getTime();
        return b - a;
    })

    useEffect(() => {
        dispatch(fetchOwnedListings())
    }, [dispatch])

    return (
        <>
            <h1>Manage Your Listings</h1>
            {!sessionUser ? (
                <ErrorHandling />
            ) : (listings &&
                <>
                    <div className="currentListings"><Link to={`/listings/new`}><button style={{ width: "fit-content" }}>Create New Listing</button></Link></div>

                    <h2>Active Listings</h2>
                    <div className="manageListingsContainer">
                        {listings && activeListings?.length === 0 ? (
                            <div className="currentListings">No active listings!</div>
                        ) : (
                            activeListings && activeListings.map(listing => (
                                <div className="currentListings" key={listing.id}>
                                    <Link to={`/listings/${listing.id}`}>
                                        <div className="manageListingImageContainer">
                                            <img
                                                className="manageListingImage"
                                                src={listing.ListingImages?.[0]?.url} />
                                        </div>
                                        <div className="manageListingInfo">
                                            <h3>{listingName(listing.plantName)}</h3>
                                            <div className="listingPrice">{price(listing.price)}</div>
                                        </div>
                                    </Link>
                                    <div className="manageListingInfo">
                                        <div>In Stock: {listing.stockQty}</div>
                                        <div className="listingButtons">
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

                    <h2 className="soldListingsHeader">Inactive & Sold Listings</h2>
                    <div className="manageListingsContainer">
                        {listings && soldListings?.length === 0 ? (
                            <div className="currentListings">No sold listings!</div>
                        ) : (
                            soldListings && soldListings.map(listing => (
                                <div className="currentListings" key={listing.id}>
                                    <Link to={`/listings/${listing.id}`}>
                                        <div className="manageListingImageContainer manageSoldOutImage">
                                            <img
                                                className="manageListingImage"
                                                src={listing.ListingImages[0].url} />
                                        </div>
                                        <div className="manageListingInfo">
                                            <h3>{listingName(listing.plantName)}</h3>
                                            <div className="listingPrice">{price(listing.price)}</div>
                                        </div>
                                    </Link>
                                    <div className="manageListingInfo">
                                        <div></div>
                                        <div className="listingButtons">
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
                </>
            )}
        </>
    )
}

export default ManageListings
