const LOAD_OWNED_SHOPORDERS = 'sell/LOAD_OWNED_SHOPORDERS';

export const loadOwnedShopOrders = (orderItems) => ({
    type: LOAD_OWNED_SHOPORDERS,
    orderItems
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

        default:
            return { ...state }
    }
}

export default sellReducer;
