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
    console.log("CARTID ONTOP", cart.cartId);
    // let [cartId, setCartId] = useState(JSON.parse(localStorage.getItem('cartId')) || null);
    let [cartId, setCartId] = useState(() => {
        const storedCartId = localStorage.getItem('cartId');
        return storedCartId ? parseInt(storedCartId, 10) : null;
    });
    let [items, setItems] = useState(JSON.parse(localStorage.getItem('items')) || []);

    useEffect(() => {
        // localStorage.setItem('cartId', JSON.stringify(cartId));
        localStorage.setItem('cartId', cartId);
        console.log(`saved items to cart ${cartId}`);
    }, [cartId])

    useEffect(() => {
        localStorage.setItem('items', JSON.stringify(items));
        console.log(`saved ${items.length} items to localstorage`);
    }, [items, items.lengfth])

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
        let newCartId = cartId;

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

        await dispatch(fetchCart(newCartId));
        await dispatch(fetchOneListing(listingId));

        const newCartItem = {
            cartId: Number(newCartId),
            listingId: Number(listingId),
            cartQty: Number(cartQty)
        };

        console.log("Dispatching CREATE_CART_ITEM action with newCartItem:", newCartItem);

        await dispatch(addItemToCart(newCartId, newCartItem));

        const existingCartItem = cart.cartItems.find(item => item.listingId === newCartItem.listingId);

        if (existingCartItem) {
            const updatedCartItem = { ...newCartItem, cartQty };
            await dispatch(updateCartItemInCart(newCartId, updatedCartItem));
        }

        await dispatch(fetchCartItems(newCartId));

        let updatedItems = [...items];
        let existingItemIndex = updatedItems.findIndex(item => item.includes(`listingId: ${listingId}`));

        if (existingItemIndex !== -1) {
            updatedItems[existingItemIndex] = `listingId: ${listingId}; cartQty: ${cartQty}`;
        } else {
            updatedItems.push(`listingId: ${listingId}; cartQty: ${cartQty}`);
        }

        setItems(updatedItems);
        localStorage.setItem('items', JSON.stringify(updatedItems));

        return newCartId;

        // let cartIdUpdated = false;
        // let newCartId = null;

        // if (cartId === null) {
        //     const res = await dispatch(addCart());

        //     if (res) {
        //         const newCartId = res.id;
        //         localStorage.setItem('cartId', newCartId);
        //         setCartId(newCartId);
        //         cartIdUpdated = true;
        //         console.log("New cart created with ID:", newCartId);
        //     } else {
        //         console.error('Error creating cart:', res);
        //         return;
        //     }
        // } else {
        //     const currentCartId = localStorage.getItem('cartId');
        //     if (currentCartId !== cartId.toString()) {
        //         console.log("Cart ID updated:", currentCartId);
        //         setCartId(parseInt(currentCartId, 10));
        //     } else {
        //         console.log("Cart ID already up-to-date:", currentCartId);
        //     }
        // }

        // if (cartIdUpdated) {
        //     await dispatch(fetchCart(newCartId));
        // } else {
        //     await dispatch(fetchCart(cartId));
        // }

        // // Set cart ID in local storage before fetching the listing
        // // localStorage.setItem('cartId', cartId);

        // await dispatch(fetchOneListing(listingId));

        // // if (cart.cartId) {
        // //     dispatch(fetchCart(cart.cartId));
        // // }

        // // Fetch cart if cartId exists


        // const newCartItem = {
        //     cartId: Number(newCartId || cartId), // Ensure cartId is valid here
        //     listingId: Number(listingId),
        //     cartQty: Number(cartQty)
        // }

        // console.log("Dispatching CREATE_CART_ITEM action with newCartItem:", newCartItem);

        // // Ensure cartId is valid when making the POST request
        // await dispatch(addItemToCart(cartId, newCartItem))


        // const existingCartItem = cart.cartItems.find(item => item.listingId === newCartItem.listingId);

        // if (existingCartItem) {
        //     const updatedCartItem = { ...newCartItem, cartQty };
        //     await dispatch(updateCartItemInCart(cartId, updatedCartItem))
        // }

        // await dispatch(fetchCartItems(cartId))

        // let updatedItems = JSON.parse(localStorage.getItem('items')) || [];
        // let existingItemIndex = updatedItems.findIndex(item => item.includes(`listingId: ${listingId}`));

        // if (existingItemIndex !== -1) {
        //     updatedItems[existingItemIndex] = `listingId: ${listingId}; cartQty: ${cartQty}`;
        // } else {
        //     updatedItems.push(`listingId: ${listingId}; cartQty: ${cartQty}`);
        // }

        // localStorage.setItem('items', JSON.stringify(updatedItems));

        // return cartIdUpdated;
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
