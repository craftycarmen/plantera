import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useCartModal } from "../../../context/CartModal/Modal";

function ShoppingCartModal({ listing, cartQty }) {
    const closeModal = useCartModal();
    const dispatch = useDispatch();

    return (listing &&
        <>
            <h1>Shopping Cart</h1>
            <div>
                <div>{listing.plantName}</div>
                <div>Pot Size: {listing.potSize}"</div>
                <div>Qty: {cartQty}</div>
                <div>${listing.price}</div>
            </div>
        </>
    )

}

export default ShoppingCartModal;
