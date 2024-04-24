import { removeCart } from "./cart";
import { csrfFetch } from "./csrf";

const CREATE_ORDER = 'orders/CREATE_ORDER';
const LOAD_ORDER_ITEMS = 'orders/LOAD_ORDER_ITEMS';

export const createOrder = (order) => ({
    type: CREATE_ORDER,
    order
});

export const loadOrderItems = (orderId, orderItems) => ({
    type: LOAD_ORDER_ITEMS,
    orderId,
    orderItems
})

export const addOrder = (order) => async (dispatch) => {
    const res = await csrfFetch('/api/checkout', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
    });

    if (res.ok) {
        const order = await res.json();
        console.log("ORDERRRRR", order)
        dispatch(createOrder(order));
        dispatch(removeCart(order.deletedCartId))
        return order
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

const ordersReducer = (state = {}, action) => {
    switch (action.type) {
        case CREATE_ORDER: {
            // const orderState = {}
            // orderState[action.order.id] = action.order
            // return orderState
            return {
                ...state,
                [action.order.id]: action.order
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
        default:
            return { ...state }
    }
}

export default ordersReducer;
