import { csrfFetch } from "./csrf";

const LOAD_PROFILE = 'user/LOAD_PROFILE';
const UPDATE_PROFILE = 'user/UPDATE_PROFILE';
const LOAD_SHOP = 'user/LOAD_SHOP';

export const loadProfile = (userId, user) => ({
    type: LOAD_PROFILE,
    userId,
    user
});

export const updateProfile = (user) => ({
    type: UPDATE_PROFILE,
    user
})

export const loadShop = (userId, listings) => ({
    type: LOAD_SHOP,
    userId,
    listings
})

export const fetchProfile = (userId) => async (dispatch) => {
    const res = await fetch(`/api/user/${userId}`)

    if (res.ok) {
        const user = await res.json();
        dispatch(loadProfile(userId, user));
        return user;
    } else {
        const errors = await res.json();
        return errors;
    }
}

export const editProfile = (userId, user) => async (dispatch) => {
    const res = await csrfFetch(`/api/user/${userId}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user })
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(updateProfile(data));
        return data
    } else {
        const errors = await res.json();
        return errors;
    }
}

export const fetchShop = (userId) => async (dispatch) => {
    const res = await fetch(`/api/user/${userId}/shop`)

    if (res.ok) {
        const listings = await res.json();
        dispatch(loadShop(userId, listings));
        return listings;
    } else {
        const errors = await res.json();
        return errors;
    }
}

const userReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_PROFILE: {
            return { ...state, [action.userId]: action.user }
        }
        case UPDATE_PROFILE: {
            return { ...state, [action.userId]: action.user }
        }
        case LOAD_SHOP: {
            return {
                ...state,
                [action.userId]: { ...state[action.userId], shop: action.listings }
            };
        }
        default: {
            return state;
        }
    }
}

export default userReducer;
