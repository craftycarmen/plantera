import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchOneListing } from "../../../store/listings";
import { useEffect, useState } from "react";
import './ListingPage.css';
import LinkedGuides from "./LinkedGuides";
import MeetTheSeller from "./MeetTheSeller";
import { addCart, addItemToCart, fetchCart, fetchCartItems, updateCartItemInCart } from "../../../store/cart";

function ListingPage() {
    const { listingId } = useParams();
    const dispatch = useDispatch();

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
        if (storedCartItems) dispatch(fetchCartItems(storedCartItems)); // Dispatch action to update Redux store with loaded cart items
    }, [dispatch]);

    const [newCartItemId, setNewCartItemId] = useState(null);


    // useEffect(() => {
    //     if (cart.cartId) {
    //         dispatch(fetchCartItems(cart.cartId))
    //             .then(() => {
    //                 // After fetching cart items, set the newCartItemId if it's not already set
    //                 if (!newCartItemId) {
    //                     JSON.parse(localStorage.getItem('cartItems')) || [];
    //                     // const lastItem = storedItems[storedItems.length - 1];
    //                     // if (lastItem) {
    //                     //     setNewCartItemId(lastItem.id);
    //                     // }
    //                 }
    //             });
    //     }
    // }, [dispatch, cart.cartId, newCartItemId]);

    // useEffect(() => {
    //     if (cart.cartId) {
    //         dispatch(fetchCartItems(cart.cartId))
    //             .then((fetchedItems) => {
    //                 console.log("Fetched cart items from DB:", fetchedItems); // Log fetched items
    //                 localStorage.setItem('cartItems', JSON.stringify(fetchedItems.ShoppingCart.CartItems));
    //                 console.log("Updated local storage with fetched items:", fetchedItems.ShoppingCart.CartItems); // Log updated local storage
    //             });
    //     }
    // }, [dispatch, cart.cartId]);

    useEffect(() => {
        const fetchDataAndLocalStorageUpdate = async () => {
            if (cart.cartId) {
                try {
                    const fetchedItems = await dispatch(fetchCartItems(cart.cartId));
                    console.log("Fetched cart items from DB:", fetchedItems);

                    const updatedCartItems = fetchedItems.ShoppingCart.CartItems;

                    // Update local storage with fetched items
                    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
                    console.log("Updated local storage with fetched items:", updatedCartItems);

                    // Dispatch action to update cart items in Redux store
                    dispatch({ type: 'cart/setCartItems', payload: updatedCartItems });
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
    };


    const handleAddToCart = async () => {
        let newCartId = cartId;
        let cartItemExists = false;

        if (cartId === null) {
            const res = await dispatch(addCart());

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

        let newCartItemId = null;

        // const existingCartItem = cartItems.find(item => item.id === Number(newCartItemId));

        console.log("CARTITEMS", cartItems)

        const existingCartItem = cartItems.find(item => item.listingId === Number(listingId))

        console.log("EXISTING CART ITEM:", existingCartItem);
        if (existingCartItem) {
            console.log("second", newCartItemId);
            cartItemExists = true;
            newCartItemId = existingCartItem.id;
        }

        // const totalQty = existingCartItem ? existingCartItem.cartQty + cartQty : cartQty;

        const totalQty = cartQty;

        const remainingStock = stockQty - (existingCartItem ? existingCartItem.cartQty : 0)

        const cartItemsLocalStorage = JSON.parse(localStorage.getItem('cartItems')) || [];


        if (totalQty > stockQty) {
            setError("Quantity exceeded")
        } else if (totalQty > remainingStock) {
            setError(`Only ${remainingStock} left in stock`)
        } else {
            setError("")

            if (cartItemExists) {
                const updatedCartItem = { ...existingCartItem, cartQty: totalQty };

                const updatedCartItemsLocalStorage = cartItemsLocalStorage.map(item =>
                    item.id === existingCartItem.id ? { ...item, cartQty: totalQty } : item
                );

                localStorage.setItem('cartItems', JSON.stringify(updatedCartItemsLocalStorage));

                await dispatch(updateCartItemInCart(cartId, updatedCartItem));

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

                // let existingItemIndex = updatedItems.findIndex(item => item.id === newCartItemId)

                let existingItemIndex = updatedItems.findIndex(item => item.listingId === Number(listingId))

                if (existingItemIndex !== -1) {
                    updatedItemsLocalStorage[existingItemIndex].cartQty = totalQty;
                } else {
                    updatedItemsLocalStorage.push({
                        id: newCartItemId,
                        listingId: Number(listingId),
                        cartQty: Number(totalQty)
                    });
                }

                // const updatedItemsLocalStorage = cartItemsLocalStorage.map(item =>
                //     item.listingId === Number(listingId)
                //         ? { ...item, cartQty: totalQty }
                //         : item
                // );
                localStorage.setItem('cartItems', JSON.stringify(updatedItemsLocalStorage));

                // localStorage.setItem('cartItems', JSON.stringify(updatedItems));
                // setItems(updatedItems)
            }
            return true;
        }
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
                            <button
                                type="submit"
                                disabled={error}
                            >Add to Cart</button>
                            <div>
                                {/* <OpenModalButton
                                    buttonText="Add to Cart"
                                    modalComponent={<ShoppingCartModal listing={listing} cartQty={cartQty} />}
                                /> */}
                            </div>
                        </form>
                    ) : (<div>SOLD OUT</div>)
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
