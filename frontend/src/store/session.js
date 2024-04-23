import { csrfFetch } from './csrf';
import { fetchCart } from './cart';

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

const setUser = (user) => {
    return {
        type: SET_USER,
        payload: user
    };
};

const removeUser = () => {
    return {
        type: REMOVE_USER
    };
};

// export const login = (user) => async (dispatch) => {
//     const { credential, password, cartId } = user;
//     console.log("CREDENTIAL", credential, password, cartId);
//     const res = await csrfFetch("/api/session", {
//         method: "POST",
//         body: JSON.stringify({
//             credential,
//             password,
//             cartId
//         })
//     });

//     const data = await res.json();
//     if (res.ok) {
//         dispatch(setUser(data.user));
//         if (data.cart) {
//             dispatch(fetchCart(cartId))
//         }
//     }
//     return data;
// };

export const login = (user) => async (dispatch) => {
    const { credential, password, orderId } = user;
    console.log("CREDENTIAL", credential, password, orderId);
    const res = await csrfFetch("/api/session", {
        method: "POST",
        body: JSON.stringify({
            credential,
            password,
            orderId
        })
    });

    const data = await res.json();
    if (res.ok) {
        dispatch(setUser(data.user));
        if (!orderId && data.cartId) {
            dispatch(fetchCart(data.cartId));
        }
    }
    return data;
};


export const restoreUser = () => async (dispatch) => {
    const res = await csrfFetch("/api/session");
    const data = await res.json();
    dispatch(setUser(data.user));
    return res;
};

export const signup = (user) => async (dispatch) => {
    const { username, firstName, lastName, email, password,
        bio,
        favoritePlant,
        accountType,
        shopDescription,
        paymentMethod,
        paymentDetails, image } = user;
    console.log('1 IMAGE', image);

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("email", email);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("bio", bio);
    formData.append("favoritePlant", favoritePlant);
    formData.append("accountType", accountType);
    formData.append("shopDescription", shopDescription);
    formData.append("paymentMethod", paymentMethod);
    formData.append("paymentDetails", paymentDetails);
    console.log(" 2 IMAGE", image);
    if (image) {
        formData.append("image", image)
    }
    console.log("FORM DATA", formData);

    const res = await csrfFetch("/api/users", {
        method: "POST",
        body: formData
        // body: JSON.stringify({
        //     email,
        //     username,
        //     firstName,
        //     lastName,
        //     password,
        //     bio,
        //     favoritePlant,
        //     accountType,
        //     shopDescription,
        //     paymentMethod,
        //     paymentDetails
        // })
    })

    const data = await res.json();
    dispatch(setUser(data.user));
    return res;
}

export const logout = () => async (dispatch) => {
    const res = await csrfFetch('/api/session', {
        method: "DELETE"
    });
    dispatch(removeUser());
    return res;
}

const initialState = { user: null, cartId: null };

const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return { ...state, user: action.payload };
        case REMOVE_USER:
            return { ...state, user: null, cartId: null };
        default:
            return state;
    }
}

export default sessionReducer;
