import { csrfFetch } from "./csrf";

const LOAD_CART = 'cart/LOAD_CART';
const CREATE_CART = 'cart/CREATE_CART';
const LOAD_CART_ITEMS = 'cart/LOAD_CART_ITEMS';
const CREATE_CART_ITEM = 'cart/CREATE_CART_ITEM';
const UPDATE_CART_ITEM = 'cart/UPDATE_CART_ITEM';

export const loadCart = (cartId, cartItems) => ({
    type: LOAD_CART,
    cartId,
    cartItems
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
})


export const fetchCart = () => async (dispatch) => {
    const cartId = localStorage.getItem('cartId');

    if (!cartId) {
        dispatch(createCart(null));
        return;
    }
    const res = await fetch(`/api/cart/${cartId}`);

    if (res.ok) {
        const cart = await res.json();
        console.log("CART IN FETCHCART", cart);
        dispatch(loadCart(cartId, cart.ShoppingCart.CartItems));
        return cart
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
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!", res)
        const newCart = await res.json();
        console.log('NEWCART', newCart)
        dispatch(createCart(newCart.id))
        return newCart
    } else {
        const errors = await res.json();
        return errors;
    }
}

export const fetchCartItems = (cartId) => async (dispatch) => {
    const res = await fetch(`/api/cart/${cartId}`);

    if (res.ok) {
        const cartItems = await res.json();
        console.log("FETCHCART", cartItems);
        dispatch(loadCartItems(cartItems.ShoppingCart.CartItems));
        return cartItems
    } else {
        const errors = await res.json();
        return errors;
    }
}

// Action creator for adding a new item to the cart
export const addItemToCart = (cartId, cartItem) => async (dispatch, getState) => {
    try {
        const state = getState();

        // Check if the item already exists in the cart
        const existingCartItem = state.cart.cartItems.find(item => item.listingId === cartItem.listingId);

        if (existingCartItem) {
            // If the item already exists, update its quantity
            cartItem.id = existingCartItem.id;
            cartItem.cartQty += existingCartItem.cartQty;
            dispatch(updateCartItemInCart(cartId, cartItem)); // Update the item in the cart
            return cartItem;
        } else {
            // If the item does not exist, add it to the cart
            let newCartId = cartId;

            if (!cartId) {
                // If there's no cart ID, create a new cart
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

            // Add the item to the cart
            const res = await csrfFetch(`/api/cart/${newCartId}/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cartItem)
            });

            if (res.ok) {
                const newCartItem = await res.json();
                dispatch(createCartItem(newCartItem, newCartId)); // Add the item to the Redux store
                const updatedCartItems = [...state.cart.cartItems, newCartItem]; // Add the new item to the cartItems array
                dispatch(loadCartItems(updatedCartItems)); // Update the cartItems in the Redux store
                localStorage.setItem('cartItems', JSON.stringify(updatedCartItems)); // Update local storage with the latest cart items data
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


// export const addItemToCart = (cartId, cartItem) => async (dispatch, getState) => {
//     const state = getState();
//     console.log("Cart Item:", cartItem);
//     let updatedCartItem = null;
//     const existingCartItem = state.cart.cartItems.find(item => item.listingId === cartItem.listingId);

//     console.log("EXISTING cart item in reducer", state.cart.cartItems);
//     console.log("CARTITEMID?", cartItem);

//     if (existingCartItem) {
//         cartItem.id = existingCartItem.id;
//         updatedCartItem = { ...existingCartItem, cartQty: existingCartItem.cartQty + cartItem.cartQty };
//         dispatch(updateCartItemInCart(cartId, updatedCartItem));
//         return updatedCartItem;
//     } else {
//         let newCartId = cartId;

//         if (!cartId) {
//             const res = await csrfFetch('/api/cart', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ cartItem })
//             });

//             if (res.ok) {
//                 const newCart = await res.json();
//                 newCartId = newCart.id;
//                 dispatch(createCart(newCartId));
//             } else {
//                 const errors = await res.json();
//                 return errors;
//             }
//         }

//         const res = await csrfFetch(`/api/cart/${newCartId}/items`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(cartItem)
//         });

//         if (res.ok) {
//             const newCartItem = await res.json();
//             dispatch(createCartItem(newCartItem, newCartId));
//             return newCartItem;
//         } else {
//             const errors = await res.json();
//             return errors;
//         }
//     }
// }

export const updateCartItemInCart = (cartId, cartItem) => async (dispatch) => {
    console.log("UpdateCartItemInCart Action Dispatched with cartId:", cartId);
    console.log("UpdateCartItemInCart Action Dispatched with cartItem:", cartItem);
    const res = await csrfFetch(`/api/cart/${cartId}/item/${cartItem.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cartItem)
    })

    if (res.ok) {
        const updatedCartItem = await res.json();
        dispatch(updateCartItem(updatedCartItem));
        const cartItems = await dispatch(fetchCartItems(cartId));
        localStorage.setItem('cartItems', JSON.stringify(cartItems.ShoppingCart.CartItems));
        return updatedCartItem;
    } else {
        const errors = await res.json();
        return errors;
    }
}
// try {
//     const res = await csrfFetch(`/api/cart/${cartId}/items`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(cartItem)
//     });

//     if (res.ok) {
//         const newCartItem = await res.json();
//         dispatch(createCartItem(newCartItem, cartId));
//         return newCartItem
//     } else {
//         const errors = await res.json();
//         throw new Error(errors.message);
//     }
// } catch (error) {
//     console.error('Error adding item to cart:', error);
//     throw error;
// }
// }

const initialState = {
    cart: null,
    cartItems: []
}

const cartReducer = (state = initialState, action) => {
    console.log('CARTACTION', action);
    switch (action.type) {
        case LOAD_CART: {
            console.log("CART ACTION", action)
            return { ...state, cartId: action.cartId, cartItems: action.cartItems }
        }
        case CREATE_CART: {
            localStorage.setItem('cartId', action.cartId);

            return { ...state, cartId: action.cartId }
        }
        case LOAD_CART_ITEMS: {
            return { ...state, cartItems: action.cartItems }
        }
        case CREATE_CART_ITEM: {
            // const updatedCartItems = [...state.cartItems, action.cartItem];

            return {
                ...state,
                // cartId: action.cartId,
                cartItems: [...state.cartItems, action.cartItem]
                // cartItems: updatedCartItems
            }
        }

        case UPDATE_CART_ITEM: {
            console.log("UPDATE_CART_ITEM Action Received:", action);
            console.log("UPDATE_CART_ITEM Action Received cartItem:", action.cartItem);
            const { cartItem } = action;
            if (!cartItem) {
                return state;
            }

            // Find the index of the cart item in the cartItems array
            const updatedCartItemIndex = state.cartItems.findIndex(item => item.id === cartItem.id);

            // If the cart item is found, update it; otherwise, return the current state
            console.log('UPDATEDCARTREDUCER', updatedCartItemIndex);
            if (updatedCartItemIndex !== -1) {
                const updatedCartItems = [...state.cartItems];
                updatedCartItems[updatedCartItemIndex] = cartItem;
                return {
                    ...state,
                    cartItems: updatedCartItems
                };
            } else {
                return state;
            }

            // const { cartItem } = action;
            // if (!cartItem) {
            //     return state;
            // }


            // const updatedCartItems = state.cartItems.map(item => {
            //     if (item.id === cartItem.id) {
            //         return cartItem;
            //     }
            //     return item;
            // })

            // console.log('UPDATEDCARTREDUCER', updatedCartItems);

            // return {
            //     ...state,
            //     cartItems: updatedCartItems
            // }
        }
        default:
            return { ...state }
    }
}

export default cartReducer
