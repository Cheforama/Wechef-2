import { GET_AUTHENTICATED, GET_USER } from '../types';

const initialState = {
    isAuthenticated: false,
    user: {}
};

function errorReducer(state = initialState, action) {
    switch (action.type) {
        case GET_AUTHENTICATED:
            return {
                ...state,
                isAuthenticated: action.payload
            }

        case GET_USER:
            return {
                ...state,
                user: action.payload
            }

        default:
            return state;
    }
}

export default errorReducer;