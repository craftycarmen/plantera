import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchOneListing } from "../../../store/listings";
import { useEffect, useState } from "react";
import './ListingPage.css';
import LinkedGuides from "./LinkedGuides";
import MeetTheSeller from "./MeetTheSeller";
import { addCart, addItemToCart, fetchCart, fetchCartItems, updateCartItemInCart } from "../../../store/cart";
import ShoppingCartModal from "../../Cart/CartModal";
import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";

function ListingPage() {
    const { listingId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const listing = useSelector(state => (state.listings[listingId]))

    // const sessionUser = useSelector(state => state.session.user);

    const cart = useSelector(state => state.cart)
    const cartItems = useSelector(state => state.cart.cartItems)

    let [cartId, setCartId] = useState(() => {
        const storedCartId = localStorage.getItem('cartId');
        return storedCartId ? parseInt(storedCartId) : null;
    });

    useEffect(() => {
        const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        if (storedCartItems) dispatch(fetchCartItems(storedCartItems));
    }, [dispatch]);

    let [newCartItemId, setNewCartItemId] = useState(null);

    console.log("CARTID ON LOAD", cartId);

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(fetchOneListing(listingId));
            if (cart.cartId) {
                dispatch(fetchCartItems(cart.cartId));
            }
        };
        fetchData();
    }, [dispatch, listingId, cart.cartId]);

    useEffect(() => {
        const fetchDataAndLocalStorageUpdate = async () => {
            if (cart.cartId) {
                try {
                    const fetchedItems = await dispatch(fetchCartItems(cart.cartId));

                    if (fetchedItems !== undefined) {
                        const updatedCartItems = fetchedItems.ShoppingCart.CartItems;

                        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

                        dispatch({ type: 'cart/setCartItems', payload: updatedCartItems });
                    }
                } catch (error) {
                    console.error("Error fetching cart items:", error);
                }
            }
        };

        fetchDataAndLocalStorageUpdate();
    }, [dispatch, cart.cartId]);


    let existingItemId = null;

    useEffect(() => {
        if (cart.cartItems) {
            const existingCartItem = cart.cartItems.find(item => item.id === existingItemId)
            if (existingCartItem) {
                setCartQty(existingCartItem.cartQty);
            }
        }
    }, [cart.cartItems, listingId, existingItemId])

    let stockQty = listing?.stockQty || 1;
    let [cartQty, setCartQty] = useState(1);
    const [error, setError] = useState("")

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

    useEffect(() => {
        const runDispatches = async () => {
            await dispatch(fetchOneListing(listingId));
            if (cart.cartId)
                dispatch(fetchCart(cart.cartId))
        };
        runDispatches();
    }, [dispatch, listingId, cart.cartId])


    const handleQty = (e) => {
        e.preventDefault();

        const newQty = parseInt(e.target.value);
        setCartQty(newQty);
        console.log("STOCKQTY", stockQty);
        // if (newQty >= stockQty) {
        //     setQtyExceeded(true);
        // } else {
        //     setQtyExceeded(false)
        // }
    };


    const handleAddToCart = async () => {
        let newCartId = cartId;
        let cartItemExists = false;
        console.log("CARTSTUFF", newCartId);
        if (cartId === null) {
            const res = await dispatch(addCart());
            console.log("CARTRESINHERE", res);
            if (res) {
                newCartId = res.id;
                localStorage.setItem('cartId', newCartId);
                setCartId(newCartId);
                console.log("New cart created with ID:", newCartId);
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

        if (totalQty >= stockQty) {
            setError("You've added the maximum quantity to your cart!")
        }

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
        return true;
    }


    return (listing &&
        <>
            <h3><Link to="/">Home</Link>&nbsp;&nbsp;<i className="fa-solid fa-angle-right" style={{ fontSize: "small" }} />&nbsp;&nbsp;<Link to="/listings">Shop</Link>&nbsp;&nbsp;<i className="fa-solid fa-angle-right" style={{ fontSize: "small" }} />&nbsp;&nbsp;{listing.plantName}</h3>
            <div className="listingPageContainer">
                <img className="listingPageImage" src={listing.ListingImages?.[0]?.url} />
                <div>
                    <h1>{listing.plantName}</h1>
                    <div>from {listing.Seller?.username}</div>
                    <p className="price">${listing.price}</p>
                    <p>{listing.description}</p>
                    <p>Pot Size: {listing.potSize}&ldquo;</p>
                    {listing.stockQty && listing.stockQty > 0 ? (
                        <form onSubmit={(e) => { e.preventDefault(); handleAddToCart(); }}>

                            <div className="quantityContainer">
                                <span className="qtylabel">Quantity:</span>
                                <div className="quantityInput">
                                    <button onClick={addQty}><i className="fa-solid fa-plus" style={{ fontSize: "x-small", color: "#E38251" }} /></button>
                                    <input
                                        className="inputBox"
                                        type="number" step="1"
                                        min="1"
                                        max={listing.stockQty}
                                        value={cartQty}
                                        name="cartQty"
                                        onChange={handleQty} />

                                    <button onClick={removeQty}><i className="fa-solid fa-minus" style={{ fontSize: "x-small", color: "#E38251" }} /></button>

                                </div>
                            </div>
                            <div className='error'>{error &&
                                <><i className="fa-solid fa-circle-exclamation" /> {error}</>}</div>

                            <OpenModalMenuItem
                                itemText={<>
                                    <button
                                        type="submit"
                                        disabled={error}
                                    >Add to Cart</button>
                                </>}
                                modalComponent={<ShoppingCartModal cartId={cartId} navigate={navigate} />}
                            />

                        </form>
                    ) : (<div className="soldOutText">SOLD OUT</div>)
                    }

                </div>
            </div>
            <div>
                <LinkedGuides guides={listing.Guides} />
            </div>
            <div>
                <MeetTheSeller sellerInfo={listing.Seller} />
            </div>
        </>
    )
}

export default ListingPage
