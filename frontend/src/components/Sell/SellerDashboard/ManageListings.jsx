import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import './SellerDashboard.css';
import Menu from "./Menu";
import { fetchOwnedListings } from "../../../store/listings";
import DeleteListingModal from "../../Listings/DeleteListingModal";
import OpenModalButton from "../../OpenModalButton";
import { Link } from "react-router-dom";
import ErrorHandling from "../../ErrorHandling";
import { price, listingName } from "../../../../utils";

function ManageSellerListings() {
    const dispatch = useDispatch();
    const [showMenu] = useState(false);
    const [isTablet] = useState(window.innerWidth <= 1024 && window.innerWidth >= 481);
    const sellerContainerStyle = {
        marginLeft: isTablet && showMenu ? '225px' : '0',
        transition: 'margin-left 0.2s ease-in-out'
    };
    const sessionUser = useSelector(state => state.session.user);
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
        <div className="sellerContainer">
            <Menu sessionUser={sessionUser} />
            <div style={sellerContainerStyle} className="sellerRightContainer">
                <h2>Manage Your Listings</h2>
                {!sessionUser ? (
                    <ErrorHandling />
                ) : (listings &&
                    <div className="manageListingsSection">
                        <h3>Active Listings</h3>
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

                        <h3 className="soldListingsHeader">Inactive & Sold Listings</h3>
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
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageSellerListings;
