import ShoppingCartModal from '../Cart/CartModal';
import OpenModalMenuItem from './OpenModalMenuItem';
import './Navigation.css';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchCart, fetchCartItems, resetCartId, clearCart } from '../../store/cart';
import { useNavigate, useLocation } from 'react-router-dom';
import { hideErrorInProd } from '../../../utils';

function ShoppingCartButton({ cartId }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const numCartItems = useSelector(state => state.cart.numCartItems);
    const [updatedQty, setUpdatedQty] = useState({});

    // useEffect(() => {
    //     const runDispatches = async () => {
    //         dispatch(fetchCartItems())

    //         const storedCartItems = localStorage.getItem('cartItems')
    //         if (storedCartItems) {
    //             const parsedStoredCartItems = JSON.parse(storedCartItems)

    //             const qty = {};

    //             parsedStoredCartItems.forEach(item => {
    //                 qty[item.id] = item.cartQty
    //             });

    //             setUpdatedQty(qty)
    //         }
    //     }
    //     runDispatches();
    // }, [dispatch, numCartItems])

    useEffect(() => {
        const runDispatches = async () => {
            if (cartId) {
                try {
                    const fetchedCart = await dispatch(fetchCart(cartId));

                    if (fetchedCart !== null) {
                        const fetchedItems = await dispatch(fetchCartItems(cartId));

                        if (fetchedItems !== undefined && fetchedItems.ShoppingCart) {
                            localStorage.setItem('cartItems', JSON.stringify(fetchedItems.ShoppingCart.CartItems));

                            const qty = {};
                            fetchedItems.ShoppingCart.CartItems.forEach(item => {
                                qty[item.id] = item.cartQty;
                            });
                            setUpdatedQty(qty);
                        } else {
                            console.log("Fetched items are undefined or ShoppingCart is not available");
                        }
                    } else {
                        console.log("Cart does not exist, resetting cart state and local storage");
                        localStorage.removeItem('cartId');
                        localStorage.removeItem('cartItems');
                        dispatch(resetCartId());
                        dispatch(clearCart());
                    }
                } catch (error) {
                    console.error("Error fetching cart and cart items:", error);
                }
            } else {
                console.log("Cart ID is not found in local storage");
                localStorage.removeItem('cartId');
                localStorage.removeItem('cartItems');
                dispatch(resetCartId());
                dispatch(clearCart());
            }
        };

        runDispatches();
    }, [dispatch, cartId]);


    const handleOpenModal = async () => {
        try {
            if (location.pathname !== '/cart') {
                await dispatch(fetchCartItems(cartId));
                navigate('/cart');
            }
        } catch (error) {
            hideErrorInProd(error);
        }
    }

    return (
        <div className='shoppingCartIconWrapper'>
            {location.pathname !== '/cart' && !location.pathname.startsWith('/checkout') ? (
                <OpenModalMenuItem
                    itemText={<>

                        <i style={{ color: "#28635A" }} className="fa-solid fa-cart-shopping" />

                        {cartId && numCartItems > 0 &&
                            (

                                <span className="cartCircle">
                                    <i style={{ fontSize: "large", marginTop: "-20px" }} className="fa-solid fa-circle" />

                                    <span className='cartNum'>
                                        {numCartItems}
                                    </span>

                                </span>
                            )}



                    </>}
                    onClick={handleOpenModal}
                    modalComponent={<ShoppingCartModal cartId={cartId} navigate={navigate} updatedQty={updatedQty} />}
                />
            ) : (


                <div style={{ cursor: "default" }}>

                    <i style={{ color: "#28635A", cursor: "default" }} className="fa-solid fa-cart-shopping" />

                    {cartId && numCartItems > 0 &&
                        (

                            <span className="cartCircle">
                                <i style={{ fontSize: "large", marginTop: "-20px" }} className="fa-solid fa-circle" />

                                <span className='cartNum'>
                                    {numCartItems}
                                </span>

                            </span>
                        )}

                </div>



            )
            }

        </div>
    )
}

export default ShoppingCartButton
