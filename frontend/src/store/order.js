import { removeCart } from "./cart";
import { csrfFetch } from "./csrf";

const getCsrfToken = () => {
    const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1]; // Assuming the CSRF token is stored in the cookie as csrfToken

    return csrfToken;
};


const CREATE_ORDER = 'orders/CREATE_ORDER';
const SET_PAYMENT_INTENT = 'orders/SET_PAYMENT_INTENT';
const LOAD_ORDER_ITEMS = 'orders/LOAD_ORDER_ITEMS';
const LOAD_OWNED_BUYERORDERS = 'orders/LOAD_OWNED_BUYERORDERS';

export const createOrder = (order) => ({
    type: CREATE_ORDER,
    order
});

export const setPaymentIntent = (clientSecret) => ({
    type: SET_PAYMENT_INTENT,
    clientSecret
})

export const loadOrderItems = (orderId, orderItems) => ({
    type: LOAD_ORDER_ITEMS,
    orderId,
    orderItems
})

export const loadOwnedBuyerOrders = (orders) => ({
    type: LOAD_OWNED_BUYERORDERS,
    orders
})

export const addOrder = (order) => async (dispatch) => {
    const csrfToken = getCsrfToken();
    if (!csrfToken) {
        // Handle case where CSRF token is not found
        console.error('CSRF token not found!');
        return;
    }

    const res = await csrfFetch('/api/checkout', {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken, },
        body: JSON.stringify(order),
        credentials: 'include',
    });

    if (res.ok) {
        const { order, paymentIntent, deletedCartId } = await res.json();
        dispatch(createOrder(order));
        dispatch(setPaymentIntent(paymentIntent.client_secret));
        dispatch(removeCart(deletedCartId));

        return { order, clientSecret: paymentIntent.client_secret }
    } else {
        const errors = await res.json();
        return errors
    }
}

export const fetchOrderItems = (orderId) => async (dispatch) => {
    const res = await fetch(`/api/order/${orderId}`)

    if (res.ok) {
        const items = await res.json();
        dispatch(loadOrderItems(orderId, items))
        return items;
    } else {
        const errors = await res.json();
        return errors;
    }
}

export const fetchOwnedBuyerOrders = () => async (dispatch) => {
    const res = await fetch('/api/order/orders');

    if (res.ok) {
        const orders = await res.json();

        dispatch(loadOwnedBuyerOrders(orders));
        return orders;
    } else {
        const errors = await res.json();
        return errors;
    }
}

const ordersReducer = (state = {}, action) => {
    switch (action.type) {
        case CREATE_ORDER: {
            return {
                ...state,
                [action.order.id]: action.order
            }
        }

        case SET_PAYMENT_INTENT: {
            return {
                ...state,
                clientSecret: action.clientSecret
            }
        }

        case LOAD_ORDER_ITEMS: {
            return {
                ...state,
                [action.orderId]: {
                    ...state[action.orderId],
                    orderItems: action.orderItems
                }
            }
        }

        case LOAD_OWNED_BUYERORDERS: {
            const ordersState = {};

            action.orders.Orders.forEach(order => {
                ordersState[order.id] = order
            });
            return ordersState;
        }
        default:
            return { ...state }
    }
}

export default ordersReducer;
