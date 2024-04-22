import ShoppingCartModal from '../Cart/CartModal';
import OpenModalMenuItem from './OpenModalMenuItem';
import './Navigation.css';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchCartItems } from '../../store/cart';
import { useNavigate, useLocation } from 'react-router-dom';

function ShoppingCartButton({ cartId }) {
    console.log("CARTIDHERE", cartId);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const numCartItems = useSelector(state => state.cart.numCartItems);
    const [updatedQty, setUpdatedQty] = useState({});

    useEffect(() => {
        const runDispatches = async () => {
            dispatch(fetchCartItems())

            const storedCartItems = JSON.parse(localStorage.getItem('cartItems') || [])

            const qty = {};

            storedCartItems.forEach(item => {
                qty[item.id] = item.cartQty
            });

            setUpdatedQty(qty)
        }
        runDispatches();
    }, [dispatch, numCartItems])

    const handleOpenModal = async () => {
        if (location.pathname !== '/cart') {
            await dispatch(fetchCartItems(cartId));
            navigate('/cart');
        }
    };

    return (
        <div className='shoppingCartIconWrapper'>
            {location.pathname !== '/cart' && !location.pathname.startsWith('/checkout') ? (
                <OpenModalMenuItem
                    itemText={<>

                        <i style={{ color: "#28635A" }} className="fa-solid fa-cart-shopping" />

                        {numCartItems > 0 &&
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


                <div style={{ cursor: "pointer" }}>

                    <i style={{ color: "#28635A" }} className="fa-solid fa-cart-shopping" />

                    {numCartItems > 0 &&
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
