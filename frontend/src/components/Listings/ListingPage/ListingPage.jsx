import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchOneListing } from "../../../store/listings";
import { useEffect, useState } from "react";
import './ListingPage.css';
import LinkedGuides from "./LinkedGuides";
import MeetTheSeller from "./MeetTheSeller";
import { addCart } from "../../../store/cart";

function ListingPage() {
    const { listingId } = useParams();
    const dispatch = useDispatch();

    const listing = useSelector(state => (state.listings[listingId]))

    const sessionUser = useSelector(state => state.session.user);

    let stockQty = listing?.stockQty || 1;
    let [cartQty, setCartQty] = useState(1)

    let addQty = () => {
        if (cartQty >= 1 && cartQty < stockQty) {
            setCartQty(prevCartQty => prevCartQty + 1)
        }
    }

    let removeQty = () => {
        if (cartQty > 1) {
            setCartQty(prevCartQty => prevCartQty - 1)
        }
    }

    useEffect(() => {
        const runDispatches = async () => {
            dispatch(fetchOneListing(listingId)
            );

        };
        runDispatches();
    }, [dispatch, listingId])

    const handleQty = (e) => {
        const newQty = parseInt(e.target.value);
        if (!isNaN(newQty) && newQty >= 1 && newQty <= stockQty) {
            setCartQty(newQty);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const cart = {
            buyerId: sessionUser.id
        }

        return dispatch(addCart({}))
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
                        <form onSubmit={handleSubmit}>

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
                            <div><button className="quantityButton" type="submit">Add to Cart</button></div>
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
