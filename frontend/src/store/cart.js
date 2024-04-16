import { csrfFetch } from "./csrf";

const LOAD_CART = 'cart/LOAD_CART';
const CREATE_CART = 'cart/CREATE_CART';
const LOAD_CART_ITEMS = 'cart/LOAD_CART_ITEMS';
const CREATE_CART_ITEM = 'cart/CREATE_CART_ITEM';

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
})


export const fetchCart = () => async (dispatch) => {
    const cartId = localStorage.getItem('cartId');

    if (!cartId) return;

    const res = await fetch(`/api/cart/${cartId}`);

    if (res.ok) {
        const cart = await res.json();
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
        const newCart = await res.json();
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

export const addItemToCart = (cartId, cartItem) => async (dispatch) => {
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
        return newCartItem;
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
        case CREATE_CART_ITEM:
            // const updatedCartItems = [...state.cartItems, action.cartItem];

            return {
                ...state,
                // cartId: action.cartId,
                cartItems: [...state.cartItems, action.cartItem]
                // cartItems: updatedCartItems
            }
        default:
            return { ...state }
    }
}

export default cartReducer
