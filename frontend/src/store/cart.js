import { csrfFetch } from "./csrf";

const LOAD_CART = 'cart/LOAD_CART';
const CREATE_CART = 'cart/CREATE_CART';
const LOAD_CART_ITEMS = 'cart/LOAD_CART_ITEMS';
const UPDATE_CART = 'cart/UPDATE_CART';
const DELETE_CART = 'cart/DELETE_CART';
const CREATE_CART_ITEM = 'cart/CREATE_CART_ITEM';
const UPDATE_CART_ITEM = 'cart/UPDATE_CART_ITEM';
const DELETE_CART_ITEM = 'cart/DELETE_CART_ITEM';
const CLEAR_CART = 'cart/CLEAR_CART';
const RESET_CART_ID = 'cart/RESET_CART_ID';

export const loadCart = (cartId, cartItems, cartTotal, numCartItems) => ({
    type: LOAD_CART,
    cartId,
    cartItems,
    cartTotal,
    numCartItems
});

export const createCart = (cartId) => ({
    type: CREATE_CART,
    cartId
});

export const updateCart = (cartId, cart, cartTotal) => ({
    type: UPDATE_CART,
    cartId,
    cart,
    cartTotal
});

export const deleteCart = (cartId) => ({
    type: DELETE_CART,
    cartId
});

export const loadCartItems = (cartItems) => ({
    type: LOAD_CART_ITEMS,
    cartItems
})

export const createCartItem = (cartItem, cartId) => ({
    type: CREATE_CART_ITEM,
    cartItem,
    cartId
});

export const updateCartItem = (cartItem) => ({
    type: UPDATE_CART_ITEM,
    cartItem
});

export const deleteCartItem = (cartId, cartItemId) => ({
    type: DELETE_CART_ITEM,
    cartId,
    cartItemId
});

export const clearCart = () => ({
    type: CLEAR_CART
});

export const resetCartId = () => ({
    type: RESET_CART_ID
});


export const fetchCart = () => async (dispatch) => {
    let cartId = Number(localStorage.getItem('cartId'));
    console.log('CartId fetched from localStorage:', cartId);

    if (cartId > 0) {
        const res = await fetch(`/api/cart/${cartId}`);
        if (res.ok) {
            const cart = await res.json();
            if (cart.ShoppingCart !== null) {
                const cartTotal = cart.ShoppingCart.cartTotal;
                const numCartItems = cart.ShoppingCart.numCartItems
                dispatch(loadCart(cartId, cart.ShoppingCart.CartItems, cartTotal, numCartItems));
                return cart
            } else {
                console.error('Cart not found for cart ID:', cartId);
                // Reset cart ID, clear cart items, and delete cart items from local storage
                localStorage.removeItem('cartId');
                localStorage.removeItem('cartItems');
                dispatch(resetCartId());
                dispatch(clearCart());
                return null;
            }

        } else {
            console.error('Invalid cart ID #1:', cartId);
            localStorage.removeItem('cartId');
            localStorage.removeItem('cartItems');
            dispatch(resetCartId());
            dispatch(clearCart());
            return null;

            // const newCart = await dispatch(addCart())

            // if (newCart) {
            //     cartId = newCart.id;
            //     localStorage.setItem('cartId', cartId);
            //     console.log('New cart created with ID:', cartId);
            // } else {
            //     console.error('Error creating a new cart.');
            // }
        }
    } else {
        console.error('Invalid cart ID #2: ', cartId);
        localStorage.removeItem('cartId');
        localStorage.removeItem('cartItems');
        dispatch(resetCartId());
        dispatch(clearCart());
        return null;

    }
}

export const addCart = (cart) => async (dispatch) => {
    const res = await csrfFetch('/api/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cart)
    });

    if (res.ok) {
        const newCart = await res.json();
        dispatch(createCart(newCart.id))
        return newCart
    } else {
        const errors = await res.json();
        return errors;
    }
}

export const editCart = (cartId, cart, cartTotal) => async (dispatch) => {
    const res = await csrfFetch(`/api/cart/${cartId}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cart })
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(updateCart(cartId, data, cartTotal));
        return data
    } else {
        const errors = await res.json();
        return errors;
    }
}

export const clearTheCart = () => async (dispatch) => {
    let cartId = Number(localStorage.getItem('cartId'));
    if (cartId > 0) {
        await fetch(`/api/cart/${cartId}`, {
            method: 'DELETE'
        })

        localStorage.removeItem('cartId')
        dispatch(resetCartId())
    }
}

export const removeCart = (cartId) => async (dispatch) => {
    const res = await csrfFetch(`/api/cart/${cartId}`, {
        method: 'DELETE'
    });

    if (res.ok) {
        dispatch(deleteCart(cartId))
    }
}

export const fetchCartItems = () => async (dispatch) => {
    const cartId = Number(localStorage.getItem('cartId'));

    if (!cartId) {
        return;
    }

    const res = await fetch(`/api/cart/${cartId}`);

    if (res.ok) {
        const cartItems = await res.json();
        console.log("CARTITEMSINSTORE", cartItems.ShoppingCart)
        if (cartItems.ShoppingCart && cartItems.ShoppingCart.CartItems.length > 0) {
            dispatch(loadCartItems(cartItems.ShoppingCart.CartItems));
            return cartItems
        }
    } else {
        const errors = await res.json();
        return errors;
    }
}

export const addItemToCart = (cartId, cartItem) => async (dispatch, getState) => {
    try {
        const state = getState();

        const existingCartItem = state.cart.cartItems.find(item => item.listingId === cartItem.listingId);

        if (existingCartItem) {
            cartItem.id = existingCartItem.id;
            cartItem.cartQty += existingCartItem.cartQty;
            dispatch(updateCartItemInCart(cartId, cartItem));
            return cartItem;
        } else {
            let newCartId = cartId;

            if (!cartId) {
                const res = await csrfFetch('/api/cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ cartItem })
                });

                if (res.ok) {
                    const newCart = await res.json();
                    newCartId = newCart.id;
                    dispatch(createCart(newCartId));
                } else {
                    const errors = await res.json();
                    return errors;
                }
            }

            const res = await csrfFetch(`/api/cart/${newCartId}/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cartItem)
            });

            if (res.ok) {
                const newCartItem = await res.json();
                dispatch(createCartItem(newCartItem, newCartId));
                const updatedCartItems = [...state.cart.cartItems, newCartItem];
                dispatch(loadCartItems(updatedCartItems));
                localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
                return newCartItem;
            } else {
                const errors = await res.json();
                return errors;
            }
        }
    } catch (error) {
        console.error('Error adding item to cart:', error);
        throw error;
    }
};

// export const updateCartItemInCart = (cartId, cartItem) => async (dispatch) => {
//     const res = await csrfFetch(`/api/cart/${cartId}/item/${cartItem.id}`, {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(cartItem)
//     })

//     if (res.ok) {
//         const updatedCartItem = await res.json();
//         console.log("Updated cart item:", updatedCartItem);
//         dispatch(updateCartItem(updatedCartItem));
//         const cartItems = await dispatch(fetchCartItems(cartId));
//         localStorage.setItem('cartItems', JSON.stringify(cartItems.ShoppingCart.CartItems));
//         return updatedCartItem;
//     } else {
//         const errors = await res.json();
//         return errors;
//     }
// }

export const updateCartItemInCart = (cartId, cartItem) => async (dispatch) => {
    try {
        const res = await csrfFetch(`/api/cart/${cartId}/item/${cartItem.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cartItem)
        });

        if (res.ok) {
            const updatedCartItem = await res.json();
            dispatch(updateCartItem(updatedCartItem)); // Dispatch action to update Redux state
            return updatedCartItem;
        } else {
            const errors = await res.json();
            return errors;
        }
    } catch (error) {
        console.error('Error updating cart item:', error);
        throw error;
    }
};


export const removeCartItem = (cartId, cartItemId) => async (dispatch) => {
    if (cartId === null) {
        cartId = localStorage.getItem('cartId')
    }

    const res = await csrfFetch(`/api/cart/${cartId}/item/${cartItemId}`, {
        method: 'DELETE'
    });

    if (res.ok) {
        dispatch(deleteCartItem(cartItemId));
        dispatch(fetchCart(cartId));
    }
};

const initialState = {
    cart: null,
    cartItems: [],
    cartId: null,
    cartTotal: 0,
    numCartItems: 0
}

const cartReducer = (state = initialState, action) => {

    switch (action.type) {
        case LOAD_CART: {
            console.log("CARTTOTAL", action);
            return {
                ...state,
                cartId: action.cartId,
                cartItems: action.cartItems,
                cartTotal: action.cartTotal,
                numCartItems: action.numCartItems
            }
        }
        case CREATE_CART: {
            localStorage.setItem('cartId', action.cartId);

            return { ...state, cartId: action.cartId }
        }
        case LOAD_CART_ITEMS: {
            return { ...state, cartItems: action.cartItems }
        }
        case CREATE_CART_ITEM: {
            return {
                ...state,
                cartItems: [...state.cartItems, action.cartItem]
            }
        }

        case UPDATE_CART: {
            return {
                ...state,
                [action.cartId]: action.cart,
                cartTotal: action.cartTotal
            }
        }

        case DELETE_CART: {
            const newState = { ...state };
            delete newState[action.cartId];
            return newState
        }

        case UPDATE_CART_ITEM: {
            const updatedCartItems = state.cartItems.map(item =>
                item.id === action.cartItem.id ? { ...item, cartQty: action.cartItem.cartQty } : item
            );
            return {
                ...state,
                cartItems: updatedCartItems
            };
        }
        case DELETE_CART_ITEM: {
            const updatedCartItems = state.cartItems.filter(item => item.id !== action.cartItemId);
            return {
                ...state,
                cartItems: updatedCartItems
            };
        }

        case CLEAR_CART: {
            return initialState;
        }

        case RESET_CART_ID: {
            return {
                ...state,
                cartId: null,
                cartItems: [],
                cartTotal: 0,
                numCartItems: 0
            }
        }

        default:
            return { ...state }
    }
}

export default cartReducer
