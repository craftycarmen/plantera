import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchShop } from "../../store/user";
import './User.css';
import ProfileImage from "./ProfileImage";

function Shop() {
    const { userId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.user[userId])
    const shop = user?.shop;
    const activeListings = shop?.filter(listing => listing.stockQty > 0)
    const soldListings = shop?.filter(listing => listing.stockQty === 0)

    const sessionUser = useSelector(state => state.session.user)

    useEffect(() => {
        dispatch(fetchShop(userId));
    }, [dispatch, userId])

    console.log(shop);
    return (user &&
        <div className="userProfilePageContainer">
            <ProfileImage userId={userId} />
            <div className="shopInfoContainer">
                <div className="shopName">
                    <h1>{user.username}&#39;s Shop</h1>
                    {sessionUser?.id === user.id &&
                        <button onClick={() => navigate(`/listings/current`)}>Manage Listings</button>
                    }
                </div>

                <div className="shopDescription">
                    <span style={{ fontWeight: "800" }}>About {user.username}'s Shop:</span>
                    <div>{user.shopDescription}</div>
                </div>
                <div>

                    {shop && shop.length > 0 && activeListings?.length === 0 &&

                        <div></div>
                    }

                    {shop && shop.length > 0 && activeListings?.length > 1 &&
                        <>
                            <h2>Current Listings</h2>
                            <div className="shopListingsContainer">
                                {
                                    activeListings && activeListings.map(listing => (

                                        <div className="currentListings" key={listing.id}>
                                            <Link to={`/listings/${listing.id}`}>
                                                <div className="shopImageContainer">
                                                    <img
                                                        className="shopImage"
                                                        src={listing.ListingImages?.[0]?.url} />
                                                    <div className="shopInfo">
                                                        <h3>{listing.plantName}</h3>
                                                        <span>${listing.price}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>

                                    ))
                                }
                            </div>
                        </>

                    }

                    {shop && shop.length > 0 && soldListings?.length === 0 &&
                        <div></div>
                    }
                    {shop && shop.length > 0 && soldListings?.length > 0 &&
                        <>
                            <h2>Sold Listings</h2>
                            <div className="shopListingsContainer">
                                {
                                    soldListings && soldListings.map(listing => (
                                        <div className="currentListings" key={listing.id}>
                                            <Link to={`/listings/${listing.id}`}>
                                                <div className="shopImageContainer soldOutShopImage">
                                                    <img
                                                        className="shopImage"
                                                        src={listing.ListingImages?.[0]?.url} />
                                                    <div className="shopInfo">
                                                        <h3>{listing.plantName}</h3>
                                                        <span>${listing.price}</span>
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
            </div>
        </div>
    )
}

export default Shop
