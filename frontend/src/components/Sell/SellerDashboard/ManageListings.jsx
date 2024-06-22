import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import './SellerDashboard.css';
import Menu from "./Menu";
import { fetchOwnedListings } from "../../../store/listings";
import DeleteListingModal from "../../Listings/DeleteListingModal";
import OpenModalButton from "../../OpenModalButton";
import { Link } from "react-router-dom";
import ErrorHandling from "../../ErrorHandling";
import { price, listingName } from "../../../../utils";
import Sell from "../SellPage/Sell";

function ManageSellerListings() {
    const dispatch = useDispatch();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
    const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024 && window.innerWidth >= 481);
    const [showMenu, setShowMenu] = useState(!(isMobile || isTablet));

    const sellerContainerStyle = {
        marginLeft: (!isTablet && !isMobile) && showMenu ? '250px' : '0',
        width: (!isTablet && !isMobile) && showMenu ? 'auto' : 'auto',
        transition: 'margin-left 0.2s ease-in-out'
    };
    const sessionUser = useSelector(state => state.session.user);
    const userId = sessionUser?.id;
    const user = useSelector(state => state.user[sessionUser?.id]?.User)
    const currUser = user || sessionUser;
    const isSeller = currUser && currUser.accountType === 'seller';
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


    const handleToggle = () => {
        setShowMenu(!showMenu);
    };

    const handleResize = useCallback(() => {
        setIsMobile(window.innerWidth <= 480);
        setIsTablet(window.innerWidth <= 1024 && window.innerWidth >= 481);

    }, []);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize)
    }, [handleResize]);

    return (
        <>
            {(!sessionUser || (sessionUser && !isSeller)) &&
                <Sell />
            }
            {sessionUser && isSeller &&
                <>
                    <h1>Sell(er Dashboard) for {sessionUser?.username}</h1>
                    <div>Purge your plants and plant babies on Plantera, and get paid!</div>
                    <br />
                    <div>
                        <div className="filterSort">
                            <Menu sessionUser={sessionUser} handleToggle={handleToggle} />
                        </div>
                        <div style={sellerContainerStyle} className="sellerRightContainer">
                            <h2>Manage Listings</h2>
                            {!sessionUser ? (
                                <ErrorHandling />
                            ) : (listings &&
                                <div className="manageListingsSection">
                                    <h3>Active Listings</h3>
                                    <div className="manageListingsContainer">
                                        {listings && activeListings?.length === 0 ? (
                                            <div className="currentListings" style={{ justifySelf: "start" }}>No active listings! <Link to='/sell/listings/new'>Create a new listing.</Link></div>
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
                                            <div className="currentListings" style={{ justifySelf: "start" }}>No inactive & sold listings!</div>
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
                </>
            }
        </>
    );
}

export default ManageSellerListings;
