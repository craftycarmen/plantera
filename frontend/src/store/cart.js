import { csrfFetch } from "./csrf";

const LOAD_CART = 'cart/LOAD_CART';
const CREATE_CART = 'cart/CREATE_CART';
const LOAD_CART_ITEMS = 'cart/LOAD_CART_ITEMS';
const CREATE_CART_ITEM = 'cart/CREATE_CART_ITEM';
const UPDATE_CART_ITEM = 'cart/UPDATE_CART_ITEM';
const DELETE_CART_ITEM = 'cart/DELETE_CART_ITEM';

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
})


export const fetchCart = () => async (dispatch) => {
    const cartId = Number(localStorage.getItem('cartId'));
    console.log("CARTID", cartId);
    if (!cartId) {
        dispatch(createCart(null));
        return;
    }
    const res = await fetch(`/api/cart/${cartId}`);
    console.log("RES", res);
    if (res.ok) {
        const cart = await res.json();
        console.log("CARTRES", cart);
        if (cart.ShoppingCart !== null) {
            const cartTotal = cart.ShoppingCart.cartTotal;
            const numCartItems = cart.ShoppingCart.numCartItems
            dispatch(loadCart(cartId, cart.ShoppingCart.CartItems, cartTotal, numCartItems));
            // dispatch(loadCart(cart));
            return cart
        }
    } else {
        const errors = await res.json();
        return errors;
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

export const fetchCartItems = () => async (dispatch) => {
    const cartId = Number(localStorage.getItem('cartId'));

    if (!cartId) {
        return;
    }

    const res = await fetch(`/api/cart/${cartId}`);

    if (res.ok) {
        const cartItems = await res.json();
        console.log("CARTITEMS", cartItems.ShoppingCart)
        if (cartItems.ShoppingCart !== null) {
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
}

const initialState = {
    cart: null,
    cartItems: [],
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

        // case UPDATE_CART_ITEM: {
        //     const { cartItem } = action;
        //     if (!cartItem) {
        //         return state;
        //     }

        //     const updatedCartItemIndex = state.cartItems.findIndex(item => item.id === cartItem.id);

        //     if (updatedCartItemIndex !== -1) {
        //         const updatedCartItems = [...state.cartItems];
        //         updatedCartItems[updatedCartItemIndex] = cartItem;
        //         return {
        //             ...state,
        //             cartItems: updatedCartItems
        //         };
        //     } else {
        //         return state;
        //     }
        // }

        // case UPDATE_CART_ITEM: {
        //     const { cartItem } = action;
        //     if (!cartItem) {
        //         return state;
        //     }

        //     return {
        //         ...state,
        //         cartItems: state.cartItems.map(item =>
        //             item.id === cartItem.id ? { ...item, cartQty: cartItem.cartQty } : item
        //         )
        //     };
        // }

        case UPDATE_CART_ITEM: {
            const { cartItem } = action;
            if (!cartItem) {
                return state;
            }

            // Calculate the new numCartItems based on the updated cart items
            const numCartItems = state.cartItems.reduce((total, item) => total + item.cartQty, 0);

            return {
                ...state,
                cartItems: state.cartItems.map(item =>
                    item.id === cartItem.id ? { ...item, cartQty: cartItem.cartQty } : item
                ),
                numCartItems: numCartItems // Update numCartItems with the new value
            };
        }


        case DELETE_CART_ITEM: {
            const newState = { ...state };
            delete newState[action.cartItemId];
            return newState;

            // return {
            //     ...state,
            //     cartItems: state.cartItems.filter(item => item.id !== action.cartItemId)
            // }
        }
        default:
            return { ...state }
    }
}

export default cartReducer
