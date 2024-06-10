import { csrfFetch } from "./csrf";

const LOAD_PROFILE = 'user/LOAD_PROFILE';
const UPDATE_PROFILE = 'user/UPDATE_PROFILE';
// const LOAD_SHOP = 'user/LOAD_SHOP';

export const loadProfile = (userId, user) => ({
    type: LOAD_PROFILE,
    userId,
    user
});

// export const loadProfile = (userId, profile, shop) => ({
//     type: 'user/LOAD_PROFILE',
//     userId,
//     profile,
//     shop
// });

export const updateProfile = (user) => ({
    type: UPDATE_PROFILE,
    user
})

// export const loadShop = (userId, listings) => ({
//     type: LOAD_SHOP,
//     userId,
//     listings
// })

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

// export const fetchProfile = (userId) => async (dispatch) => {
//     try {
//         const [profileRes, shopRes] = await Promise.all([
//             fetch(`/api/user/${userId}`),
//             fetch(`/api/user/${userId}/shop`)
//         ]);

//         if (profileRes.ok && shopRes.ok) {
//             const [profile, shop] = await Promise.all([
//                 profileRes.json(),
//                 shopRes.json()
//             ]);
//             dispatch(loadProfile(userId, profile, shop));
//             return { profile: profile, shop: shop };
//         } else {
//             throw new Error('Failed to fetch user data');
//         }
//     } catch (error) {
//         console.error('Error fetching user data:', error);
//     }
// };

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

// export const fetchShop = (userId) => async (dispatch) => {
//     const res = await fetch(`/api/user/${userId}/shop`)

//     if (res.ok) {
//         const listings = await res.json();
//         dispatch(loadShop(userId, listings));
//         return listings;
//     } else {
//         const errors = await res.json();
//         return errors;
//     }
// }

const userReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_PROFILE: {
            console.log("ACTION333", action);
            const { userId, user } = action;
            const updatedUser = {
                ...user,
            };
            return { ...state, [userId]: updatedUser };
        }
        // case LOAD_PROFILE: {
        //     const { userId, profile, shop } = action;
        //     return {
        //         ...state,
        //         [userId]: {
        //             ...state[userId],
        //             profile: profile,
        //             shop: shop
        //         }
        //     };
        // }
        case UPDATE_PROFILE: {
            const { userId, user } = action;
            const updatedUser = {
                ...user,
                shop: user.shop || []
            };
            return { ...state, [userId]: updatedUser };
        }
        // case LOAD_SHOP: {
        //     return {
        //         ...state,
        //         [action.userId]: { ...state[action.userId], shop: action.listings }
        //     };
        // }
        default: {
            return state;
        }
    }
}

export default userReducer;
