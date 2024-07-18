import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchOneListing } from "../../../store/listings";
import { useEffect, useState } from "react";
import './ListingPage.css';
import LinkedGuides from "./LinkedGuides";
import MeetTheSeller from "./MeetTheSeller";
import { addCart, addItemToCart, fetchCart, fetchCartItems, updateCartItemInCart, resetCartId, clearCart } from "../../../store/cart";
import ShoppingCartModal from "../../Cart/CartModal";
import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";
import { price } from "../../../../utils";
import Error404 from "../../ErrorHandling/Error404";
import ListingReviews from "./ListingReviews";
import { stars } from "../../../../utils.jsx";

function ListingPage() {
    const { listingId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const listing = useSelector(state => (state.listings[listingId]))

    const sessionUser = useSelector(state => state.session.user);

    const cart = useSelector(state => state.cart)
    const cartItems = useSelector(state => state.cart.cartItems)

    const avgStars = useSelector(state => state.reviews.avgStars);
    const numReviews = useSelector(state => state.reviews.numReviews)

    let [cartId, setCartId] = useState(() => {
        const storedCartId = localStorage.getItem('cartId');
        return storedCartId ? parseInt(storedCartId) : null;
    });

    useEffect(() => {
        const fetchData = async () => {

            await dispatch(fetchCart(cartId));
        };
        fetchData();

    }, [dispatch, cartId]);

    let [newCartItemId, setNewCartItemId] = useState(null);
    let existingItemId = null;
    let stockQty = listing?.stockQty || 1;
    let [cartQty, setCartQty] = useState(1);
    const [error, setError] = useState("");
    const [updatedQty, setUpdateQty] = useState({})

    useEffect(() => {
        const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        if (storedCartItems) dispatch(fetchCartItems(storedCartItems));
    }, [dispatch]);

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(fetchOneListing(listingId));
            if (cart.cartId) {
                dispatch(fetchCartItems(cart.cartId));
            } else {
                dispatch(fetchCart())
            }
        };
        fetchData();
    }, [dispatch, listingId, cart.cartId]);

    useEffect(() => {
        const fetchDataAndLocalStorageUpdate = async () => {
            if (cart.cartId !== null && cart.cartId !== undefined) {
                try {
                    const fetchedCart = await dispatch(fetchCartItems(cart.cartId));

                    if (fetchedCart !== null) {
                        const fetchedItems = await dispatch(fetchCartItems(cart.cartId));

                        if (fetchedItems !== undefined && fetchedItems.ShoppingCart) {
                            const updatedCartItems = fetchedItems.ShoppingCart.CartItems;

                            localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

                            dispatch({ type: 'cart/setCartItems', payload: updatedCartItems });
                        }
                    } else {

                        localStorage.removeItem('cartId');
                        localStorage.removeItem('cartItems');
                        dispatch(resetCartId());
                        dispatch(clearCart());
                    }
                } catch (error) {
                    console.error("Error fetching cart items:", error);
                }
            } else {

                localStorage.removeItem('cartId');
                localStorage.removeItem('cartItems');
                dispatch(resetCartId());
                dispatch(clearCart());

            }
        };

        fetchDataAndLocalStorageUpdate();
    }, [dispatch, cart.cartId, cartQty, listingId]);

    useEffect(() => {
        if (cart.cartItems) {
            const existingCartItem = cart.cartItems.find(item => item.id === existingItemId)
            if (existingCartItem) {
                setCartQty(existingCartItem.cartQty);
            }
        }
    }, [cart.cartItems, listingId, existingItemId])

    let addQty = (e) => {
        e.preventDefault();
        if (cartQty >= 1 && cartQty < stockQty) {
            setCartQty(prevCartQty => prevCartQty + 1)
        }
    }

    let removeQty = (e) => {
        e.preventDefault();
        if (cartQty > 1) {
            setCartQty(prevCartQty => prevCartQty - 1)
            if (error) {
                setError("");
            }
        }
    }


    const handleQty = (e) => {
        e.preventDefault();
        const newQty = parseInt(e.target.value);

        setCartQty(newQty);
        // setUpdateQty(prevUpdatedQty => ({ ...prevUpdatedQty, [listingId]: newQty }));
        // 
    };

    useEffect(() => {

    }, [updatedQty]);


    const handleAddToCart = async () => {
        let newCartId = cartId;
        let cartItemExists = false;



        if (cartId === null || !localStorage.getItem('cartId')) {
            const res = await dispatch(addCart());
            if (res) {
                newCartId = res.id;
                localStorage.setItem('cartId', newCartId);
                setCartId(newCartId);

            } else {
                console.error('Error creating cart:', res);
                return;
            }
        }

        const existingCartItem = cartItems.find(item => item.listingId === Number(listingId))

        if (existingCartItem) {
            cartItemExists = true;
            newCartItemId = existingCartItem.id;
        }

        const totalQty = cartQty;

        const cartItemsLocalStorage = JSON.parse(localStorage.getItem('cartItems')) || [];

        if (cartItemExists) {
            const updatedCartItem = { ...existingCartItem, cartQty: totalQty };

            const updatedCartItemsLocalStorage = cartItemsLocalStorage.map(item =>
                item.id === existingCartItem.id ? { ...item, cartQty: totalQty } : item
            );

            localStorage.setItem('cartItems', JSON.stringify(updatedCartItemsLocalStorage));

            await dispatch(updateCartItemInCart(cartId, updatedCartItem))

        } else {
            const newCartItem = {
                cartId: Number(newCartId),
                listingId: Number(listingId),
                cartQty: Number(cartQty)
            };

            const newItemRes = await dispatch(addItemToCart(newCartId, newCartItem))

            if (newItemRes) {
                newCartItemId = newItemRes.id
                setNewCartItemId(newCartItemId);
            }

            await dispatch(fetchCartItems(newCartId))

            let updatedItemsLocalStorage = JSON.parse(localStorage.getItem('cartItems')) || [];

            let existingItemIndex = updatedItemsLocalStorage.findIndex(item => item.listingId === Number(listingId))

            if (existingItemIndex !== -1) {
                updatedItemsLocalStorage[existingItemIndex].cartQty = totalQty;
            } else {
                updatedItemsLocalStorage.push({
                    id: newCartItemId,
                    listingId: Number(listingId),
                    cartQty: Number(totalQty)
                });
            }

            localStorage.setItem('cartItems', JSON.stringify(updatedItemsLocalStorage));

        }

        if (cartItemExists && !existingCartItem) {

            const newCartItem = {
                cartId: Number(newCartId),
                listingId: Number(listingId),
                cartQty: Number(cartQty)
            };
            await dispatch(addItemToCart(cartId, newCartItem));
        }

        setUpdateQty(prevUpdatedQty => ({ ...prevUpdatedQty, [listingId]: cartQty }));

        return true;
    }


    return (
        <>
            {listing ? (
                <>
                    <h3><Link to="/">Home</Link>&nbsp;&nbsp;<i className="fa-solid fa-angle-right" style={{ fontSize: "small" }} />&nbsp;&nbsp;<Link to="/listings">Shop</Link>&nbsp;&nbsp;<i className="fa-solid fa-angle-right" style={{ fontSize: "small" }} />&nbsp;&nbsp;{listing.plantName}</h3>
                    <div className="listingPageContainer">
                        <img className="listingPageImage" src={listing.ListingImages?.[0]?.url} />
                        <div>
                            <h1>{listing.plantName}</h1>
                            <div>from <Link to={`/user/${listing.Seller?.id}/shop`}>{listing.Seller?.username}</Link> {numReviews === 0 ? (<span></span>) : (<span>{stars(avgStars)}</span>)}</div>
                            <p className="price">{price(listing.price)}</p>
                            <p>{listing.description}</p>
                            <p>Pot Size: {listing.potSize}&ldquo;</p>
                            {listing.stockQty && listing.stockQty > 0 ? (
                                <form onSubmit={(e) => { e.preventDefault(); handleAddToCart(); }}>
                                    {listing.Seller?.id !== sessionUser?.id ? (
                                        <>
                                            <div className="quantityContainer">
                                                <span className="qtylabel">Quantity:</span>
                                                <div className="quantityInput">
                                                    <button
                                                        onClick={addQty}
                                                        disabled={(cartQty === listing.stockQty)}
                                                    >
                                                        <span className="qtyPlusMinus">
                                                            <i className="fa-solid fa-plus" />
                                                        </span>
                                                    </button>
                                                    <input
                                                        className="inputBox"
                                                        type="number"
                                                        step="1"
                                                        min="1"
                                                        max={listing.stockQty}
                                                        value={cartQty}
                                                        name="cartQty"
                                                        onChange={handleQty} />

                                                    <button
                                                        onClick={removeQty}
                                                        disabled={cartQty === 1}
                                                    >
                                                        <span className="qtyPlusMinus">
                                                            <i className="fa-solid fa-minus" />
                                                        </span>
                                                    </button>

                                                </div>
                                                <div className='stockLevelMsg' style={{ marginLeft: "5px" }}>
                                                    {listing.stockQty === 1 && (<div>Only 1 in stock!</div>)}

                                                    {listing.stockQty === cartQty && listing.stockQty !== 1 && (<div>Only {listing.stockQty} in stock!</div>)}
                                                </div>
                                            </div>


                                            <OpenModalMenuItem
                                                itemText={<>
                                                    <button
                                                        type="submit"
                                                        disabled={error}
                                                        style={{ width: "158px", marginTop: "10px" }}
                                                    >Add to Cart</button>
                                                </>}
                                                modalComponent={<ShoppingCartModal cartId={cartId} navigate={navigate} updatedQty={updatedQty} />}
                                            />
                                        </>) : (
                                        <>
                                            <Link to={`/listings/${listing.id}/edit`}><button style={{ width: "fit-content" }}>Edit Listing</button></Link>

                                        </>
                                    )}
                                </form>
                            ) : (<>
                                <div className="soldOutText">NOT AVAILABLE</div>
                                {listing.Seller?.id === sessionUser?.id && <Link to={`/listings/${listing.id}/edit`}><button style={{ width: "fit-content", marginTop: "20px" }}>Edit Listing</button></Link>}
                            </>
                            )
                            }

                        </div>
                    </div>
                    <div className={`otherSection ${listing?.Guides?.length === 1 ? 'singleGuide' : ''}`}>
                        <LinkedGuides guides={listing.Guides} />
                        <MeetTheSeller sellerInfo={listing.Seller} />
                        <ListingReviews listing={listing} avgStars={avgStars} numReviews={numReviews} />
                    </div>
                </>
            ) : (
                <Error404 type="Listing" />
            )}

        </>
    )
}

export default ListingPage
