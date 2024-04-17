import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchOneListing } from "../../../store/listings";
import { useEffect, useState } from "react";
import './ListingPage.css';
import LinkedGuides from "./LinkedGuides";
import MeetTheSeller from "./MeetTheSeller";
import { addCart, addItemToCart, fetchCart, fetchCartItems } from "../../../store/cart";

function ListingPage() {
    const { listingId } = useParams();
    const dispatch = useDispatch();

    const listing = useSelector(state => (state.listings[listingId]))

    // const sessionUser = useSelector(state => state.session.user);

    const cart = useSelector(state => state.cart)
    console.log("CART", cart.cartId);
    let [cartId, setCartId] = useState(JSON.parse(localStorage.getItem('cartId')) || null);
    // let [items, setItems] = useState(JSON.parse(localStorage.getItem('items')) || []);

    useEffect(() => {
        localStorage.setItem('cartId', JSON.stringify(cartId));
        console.log(`saved items to cart ${cartId}`);
    }, [cartId])

    // useEffect(() => {
    //     localStorage.setItem('items', JSON.stringify(items));
    //     console.log(`saved ${items.length} items to localstorage`);
    // }, [items, items.length])

    let stockQty = listing?.stockQty || 1;
    let [cartQty, setCartQty] = useState(1)

    console.log("CARTID OUTSIDE", cartId)

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

    // useEffect(() => {
    //     if (cart.id)
    //         dispatch(fetchCart(cart.id))
    // })


    const handleQty = (e) => {
        const newQty = parseInt(e.target.value);
        // if (!isNaN(newQty) && newQty >= 1 && newQty <= stockQty) {
        //     setCartQty(newQty);
        // }
        setCartQty(newQty > 1 ? newQty : 1)
    };


    const handleAddToCart = async () => {

        let cartIdUpdated = false;
        let newCartId = null;

        if (cartId === null) {
            const res = await dispatch(addCart());

            if (res) {
                const newCartId = res.id;
                localStorage.setItem('cartId', newCartId);
                setCartId(newCartId);
                cartIdUpdated = true;
                console.log("New cart created with ID:", newCartId);
            } else {
                console.error('Error creating cart:', res);
                return;
            }
        } else {
            const currentCartId = localStorage.getItem('cartId');
            if (currentCartId !== cartId) {
                cartIdUpdated = true;
                console.log("Cart ID updated:", cartId);
                setCartId(currentCartId);
            }
        }

        if (cartIdUpdated) {
            await dispatch(fetchCart(newCartId || cartId));
        }

        // Set cart ID in local storage before fetching the listing
        // localStorage.setItem('cartId', cartId);

        await dispatch(fetchOneListing(listingId));

        // if (cart.cartId) {
        //     dispatch(fetchCart(cart.cartId));
        // }

        // Fetch cart if cartId exists


        const newCartItem = {
            cartId: Number(newCartId || cartId), // Ensure cartId is valid here
            listingId: Number(listingId),
            cartQty: Number(cartQty)
        }

        console.log("Dispatching CREATE_CART_ITEM action with newCartItem:", newCartItem);

        // Ensure cartId is valid when making the POST request
        await dispatch(addItemToCart(cartId, newCartItem))
        console.log("CREATE_CART_ITEM action dispatched.");
        await dispatch(fetchCartItems(cartId))

        let updatedItems = JSON.parse(localStorage.getItem('items')) || [];
        let existingItemIndex = updatedItems.findIndex(item => item.includes(`listingId: ${listingId}`));

        if (existingItemIndex !== -1) {
            updatedItems[existingItemIndex] = `listingId: ${listingId}; cartQty: ${cartQty}`;
        } else {
            updatedItems.push(`listingId: ${listingId}; cartQty: ${cartQty}`);
        }

        localStorage.setItem('items', JSON.stringify(updatedItems));
        // updateLocalStorage();

        // // const updatedItems = [...items, `Listing ID: ${listingId}; Cart Qty: ${cartQty}`]
        // // setItems(updatedItems);
        // // localStorage.setItem('items', JSON.stringify(updatedItems))
        // console.log("cartIdUpdated:", cartIdUpdated); // Add this console log
        return cartIdUpdated;
    }

    // const updateLocalStorage = () => {
    //     if (cartId != null) {
    //         let existingItemIndex = items.findIndex(item => item.includes(`listingId: ${listingId}`))

    //         console.log("EXISTINGITEMINDEX", existingItemIndex);
    //         if (existingItemIndex !== -1) {
    //             let updatedItems = [...items]
    //             updatedItems[existingItemIndex] = `listingId: ${listingId}; cartQty: ${cartQty}`;
    //             setItems(updatedItems)
    //             localStorage.setItem('items', JSON.stringify(updatedItems));
    //         } else {

    //             const updatedItems = [...items, `listingId: ${listingId}; cartQty: ${cartQty}`]
    //             setItems(updatedItems);
    //             localStorage.setItem('items', JSON.stringify(updatedItems))
    //         }
    //     }
    // }

    // if (cartIdStorage.length === 1) {
    //     setCardIdStorage(cartIdStorage)
    // }

    // setItems([...items, `Listing ID: ${listingId}`])

    // if (!cart.cartId) {
    //     const res = await dispatch(addCart({ buyerId: sessionUser.id }))

    //     if (res && res.id && res.buyerId) {
    //         console.log("RES!", res)
    //         const cartId = res.id

    //         let newCartItem = {
    //             cartId: cartId,
    //             listingId: Number(listingId),
    //             cartQty: cartQty
    //         }


    //         console.log("Dispatching CREATE_CART_ITEM action with newCartItem:", newCartItem);
    //         await dispatch(addItemToCart(cartId, newCartItem))
    //         console.log("CREATE_CART_ITEM action dispatched.");
    //         await dispatch(fetchCartItems(cartId))
    //     } else {
    //         // Handle error case
    //         console.error('Error creating cart:', res);
    //     }

    // } else {
    //     let newCartItem = {
    //         cartId: cart.cartId,
    //         listingId: Number(listingId),
    //         cartQty: cartQty
    //     }

    //     console.log("New Cart Item for Existing Cart:", newCartItem); //
    //     console.log("Dispatching CREATE_CART_ITEM action with newCartItem IN EXISTING CARTS:", newCartItem);
    //     await dispatch(addItemToCart(cart.cartId, newCartItem))
    //     console.log("CREATE_CART_ITEM action IN EXISTING CARTS dispatched.");
    //     await dispatch(fetchCartItems(cart.cartId))
    // }



    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const cartIdUpdated = await handleAddToCart();
    //     // console.log("cartIdUpdated:", cartIdUpdated); // Add this console log
    //     // if (cartIdUpdated) {
    //     // updateLocalStorage();
    //     // }
    //     if (cartIdUpdated) {
    //         let updatedItems = JSON.parse(localStorage.getItem('items')) || [];
    //         let existingItemIndex = updatedItems.findIndex(item => item.includes(`listingId: ${listingId}`));
    //         if (existingItemIndex !== -1) {
    //             updatedItems[existingItemIndex] = `listingId: ${listingId}; cartQty: ${cartQty}`;
    //         } else {
    //             updatedItems.push(`listingId: ${listingId}; cartQty: ${cartQty}`);
    //         }
    //         localStorage.setItem('items', JSON.stringify(updatedItems));
    //     }
    // }


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
                            <button type="submit">Add to Cart</button>
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
