// import { csrfFetch } from "./csrf";

const LOAD_CART = 'cart/LOAD_CART';
const CREATE_CART = 'cart/CREATE_CART';

export const loadCart = (cart) => ({
    type: LOAD_CART,
    cart
})
export const createCart = (cart) => ({
    type: CREATE_CART,
    cart
});

export const fetchCart = (cartId) => async (dispatch) => {
    const res = await fetch(`/api/cart/${cartId}`);

    if (res.ok) {
        const cart = await res.json();
        dispatch(loadCart(cart));
        return cart
    } else {
        const errors = await res.json();
        return errors;
    }
}

export const addCart = (cart) => async (dispatch) => {
    const res = await ('/api/cart', {
        method: 'POST',
        body: JSON.stringify(cart)
    });

    if (res.ok) {
        const cart = await res.json();
        dispatch(createCart(cart))
        return cart
    } else {
        const errors = await res.json();
        return errors;
    }
}

const cartReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_CART: {
            return { ...state, [action.cart.id]: action.cart }
        }
        case CREATE_CART: {
            return { ...state, [action.cart.id]: action.cart }
        }

        default:
            return { ...state }
    }
}

export default cartReducer
