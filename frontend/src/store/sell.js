import { csrfFetch } from "./csrf";

const LOAD_OWNED_SHOPORDERS = 'sell/LOAD_OWNED_SHOPORDERS';
const UPDATE_ORDERSTATUS = 'sell/UPDATE_ORDERSTATUS';

export const loadOwnedShopOrders = (orderItems) => ({
    type: LOAD_OWNED_SHOPORDERS,
    orderItems
})

export const updateOrder = (order) => ({
    type: UPDATE_ORDERSTATUS,
    order
})

export const fetchOwnedShopOrders = () => async (dispatch) => {
    const res = await fetch('/api/sell');

    if (res.ok) {
        const orderItems = await res.json();
        dispatch(loadOwnedShopOrders(orderItems));
        return orderItems
    } else {
        const errors = await res.json();
        return errors;
    }
}

export const editOrder = (orderId, order) => async (dispatch) => {
    const res = await csrfFetch(`/api/sell/orders/${orderId}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON({ ...order })
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(updateOrder(data));
        return data;
    } else {
        const errors = await res.json();
        return errors;
    }
}

const sellReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_OWNED_SHOPORDERS: {
            const orderItemsState = {};
            console.log("SHOPPP", action);
            action.orderItems.ShopOrders.forEach(item => {
                orderItemsState[item.id] = item;
            });
            return orderItemsState
        }

        case UPDATE_ORDERSTATUS: {
            return { ...state, [action.order.id]: action.order }
        }

        default:
            return { ...state }
    }
}

export default sellReducer;
