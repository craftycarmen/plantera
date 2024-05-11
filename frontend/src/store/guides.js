import { csrfFetch } from "./csrf";

const LOAD_ALL_GUIDES = 'guides/LOAD_ALL_GUIDES';
const LOAD_ONE_GUIDE = 'guides/LOAD_ONE_GUIDE';
const LOAD_OWNED_GUIDES = 'guides/LOAD_OWNED_GUIDES';

export const loadAllGuides = (guides) => ({
    type: LOAD_ALL_GUIDES,
    guides
});

export const fetchAllGuides = () => async (dispatch) => {
    const res = await fetch('/api/guides');

    if (res.ok) {
        const guides = await res.json();
        dispatch(loadAllGuides(guides))
        return guides;
    } else {
        const errors = await res.json();
        return errors;
    }
}

const guidesReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_ALL_GUIDES: {
            const guidesState = { ...state };
            action.guides.Guides.forEach(guide => {
                guidesState[guide.id] = guide;
            });

            return guidesState
        }
        default:
            return { ...state }
    }
}

export default guidesReducer
