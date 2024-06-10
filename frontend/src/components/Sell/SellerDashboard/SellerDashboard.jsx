import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOwnedShopOrders } from "../../../store/sell";
import { fetchOwnedListings } from "../../../store/listings";
import './SellerDashboard.css';
import { price } from "../../../../utils";
import Menu from "./Menu";

function SellerDashboard({ sessionUser }) {
    const userId = sessionUser?.id
    const dispatch = useDispatch();
    const shop = Object.values(useSelector(state => state.listings)).filter(listing => listing.sellerId === userId);
    const activeListings = shop?.filter(listing => listing.stockQty > 0).length
    const soldListings = shop?.filter(listing => listing.stockQty === 0).length
    const shopOrders = Object.values(useSelector((state) => state.sell));
    const [showMenu] = useState(false);
    const [isTablet] = useState(window.innerWidth <= 1024 && window.innerWidth >= 481);

    useEffect(() => {
        dispatch(fetchOwnedListings())
        dispatch(fetchOwnedShopOrders());
    }, [dispatch]);

    const sellerContainerStyle = {
        marginLeft: isTablet && showMenu ? '225px' : '0',
        transition: 'margin-left 0.2s ease-in-out'
    };

    let totalEarnings = 0;
    let totalItems = 0;

    shopOrders.forEach(order => {
        order?.CartItems?.forEach(item => {
            totalEarnings += item.cartQty * item.Listing.price
            totalItems += item.cartQty;
        })
    })

    const unfulfilled = shopOrders?.map(order => {
        const sellerItems = order?.CartItems?.filter(item => item.Listing?.sellerId === sessionUser?.id);

        const unshippedItems = sellerItems?.some(item => item.orderStatus === "Received" || item.orderStatus === "In Progress")
            ;
        if (unshippedItems) {
            return {
                ...order,
                CartItems: sellerItems
            }
        }
    }).sort((a, b) => (b.id - a.id)).filter(order => order?.CartItems?.length > 0).length


    const fulfilled = shopOrders?.map(order => {
        const sellerItems = order?.CartItems?.filter(item => item.Listing?.sellerId === sessionUser?.id);

        const allShipped = sellerItems?.every(item => item.orderStatus === "Shipped");

        if (allShipped && sellerItems.length > 0) {
            return {
                ...order,
                CartItems: sellerItems
            }
        }
    }).sort((a, b) => (b.id - a.id)).filter(order => order?.CartItems?.length > 0).length

    return (
        <>
            <div className="sellerContainer">
                <Menu sessionUser={sessionUser} />
                {shopOrders && (
                    <div style={sellerContainerStyle} className="sellerRightContainer">
                        <h2>Your Latest Stats</h2>
                        <div className="sellerStats">
                            <div className="sellerStatsRow">
                                <div>
                                    <h2>{price(totalEarnings)}</h2>
                                    <div>total earnings</div>
                                </div>
                                <div>
                                    <h2>{totalItems}</h2>
                                    <div>{totalItems === 1 ? 'item sold' : 'total items sold'}</div>
                                </div>
                            </div>
                            <div className="sellerStatsRow">
                                <div>
                                    <h2>{shopOrders.length}</h2>
                                    <div>{shopOrders.lengths === 1 ? 'order' : 'total orders'}</div>
                                </div>
                                <div>
                                    <h2>{unfulfilled}</h2>
                                    <div>{unfulfilled === 1 ? 'unfulfilled order' : 'unfulfilled orders'}</div>
                                </div>
                                <div>
                                    <h2>{fulfilled}</h2>
                                    <div>{fulfilled === 1 ? 'fulfilled order' : 'fulfilled orders'}</div>
                                </div>
                            </div>
                            <div className="sellerStatsRow">
                                <div>
                                    <h2>{activeListings}</h2>
                                    <div>{activeListings === 1 ? 'active listing' : 'active listings'}</div>
                                </div>
                                <div>
                                    <h2>{soldListings}</h2>
                                    <div>{soldListings === 1 ? 'inactive listing' : 'inactive listings'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default SellerDashboard;
