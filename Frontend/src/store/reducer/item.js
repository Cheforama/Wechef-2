import { GET_ITEMS } from '../types';

const initialState = {
    items: [],
    item: {}
};

function itemReducer(state = initialState, action) {
    switch (action.type) {
        case GET_ITEMS:
            return {
                ...state,
                items: action.payload
            }

        default:
            return state;
    }
}

export default itemReducer;