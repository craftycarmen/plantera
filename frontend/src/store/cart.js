// import { csrfFetch } from "./csrf";

const CREATE_CART = 'cart/CREATE_CART';

export const createCart = (cart) => ({
    type: CREATE_CART,
    cart
});

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
        case CREATE_CART: {
            return { ...state, [action.cart.id]: action.cart }
        }

        default:
            return { ...state }
    }
}

export default cartReducer
