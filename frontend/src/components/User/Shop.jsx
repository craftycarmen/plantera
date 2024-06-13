import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchProfile } from "../../store/user";
import './User.css';
import ProfileImage from "./ProfileImage";
import { price, listingName } from "../../../utils";
import Error404 from "../ErrorHandling/Error404";

function Shop() {
    const { userId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.user[userId]?.User)

    const shop = useSelector(state => state.user[userId]?.Shop)
    const activeListings = shop?.filter(listing => listing.stockQty > 0).sort((a, b) => (b.id - a.id))
    const soldListings = shop?.filter(listing => listing.stockQty === 0).sort((a, b) => {
        a = (new Date(a.updatedAt)).getTime();
        b = (new Date(b.updatedAt)).getTime();
        return b - a;
    })
    const sessionUser = useSelector(state => state.session.user)

    useEffect(() => {
        dispatch(fetchProfile(userId))
    }, [dispatch, userId])

    return (
        <>
            {user ? (
                <div className="userProfilePageContainer">
                    <ProfileImage userId={userId} />
                    <div className="username">
                        <h1>{user.username} <i className="fa-solid fa-angle-right" style={{ fontSize: "large" }} /> Shop</h1>
                        {sessionUser?.id === user.id &&
                            <button onClick={() => navigate(`/sell/listings`)}>Manage Listings</button>
                        }
                    </div>
                    <div className="shopInfoContainer">
                        {shop.length === 0 ? (
                            <>
                                {user?.accountType === "seller" ? (
                                    <div>No current or past listings.</div>
                                ) : (
                                    <div>This user does not have a shop.</div>
                                )}
                            </>
                        ) :
                            (
                                <>
                                    <div className="shopDescription">
                                        <span style={{ fontWeight: "800" }}>About {user.username}&#39;s Shop:</span>
                                        <div>{user.shopDescription}</div>
                                    </div>
                                    <div>

                                        {activeListings?.length === 0 &&
                                            <div></div>
                                        }
                                        {activeListings?.length > 0 &&
                                            <>
                                                <h2 className="soldListingsHeader">Current Listings</h2>
                                                <div className="shopListingsContainer">
                                                    {
                                                        activeListings && activeListings.map(listing => (
                                                            <div className="shopCurrentListings" key={listing.id}>

                                                                <div className="shopImageContainer">
                                                                    <Link to={`/listings/${listing.id}`}>
                                                                        <img
                                                                            className="shopImage"
                                                                            src={listing.ListingImages?.[0]?.url} />
                                                                        <div className="shopInfo">
                                                                            <h3>{listingName(listing.plantName)}</h3>
                                                                            <div className="shopListingPrice">{price(listing.price)}</div>
                                                                        </div>
                                                                    </Link>
                                                                </div>

                                                            </div>

                                                        ))
                                                    }
                                                </div>
                                            </>

                                        }

                                        {soldListings?.length === 0 &&
                                            <div></div>
                                        }
                                        {soldListings?.length > 0 &&
                                            <>
                                                <h2 className="soldListingsHeader">Past Listings</h2>
                                                <div className="shopListingsContainer">
                                                    {
                                                        soldListings && soldListings.map(listing => (
                                                            <div className="shopCurrentListings" key={listing.id}>

                                                                <Link to={`/listings/${listing.id}`}>
                                                                    <div className="shopImageContainer soldOutShopImage">
                                                                        <img
                                                                            className="shopImage soldOutImage"
                                                                            src={listing.ListingImages?.[0]?.url} />
                                                                        <div className="shopInfo">
                                                                            <h3>{listingName(listing.plantName)}</h3>
                                                                            <div className="shopListingPrice">{price(listing.price)}</div>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            </div>


                                                        ))
                                                    }
                                                </div>
                                            </>

                                        }

                                    </div>
                                </>

                            )}

                    </div>
                </div >
            ) : (
                <Error404 type="User" />
            )
            }
        </>
    )
}

export default Shop
