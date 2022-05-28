import { SET_WALLET_ACCOUNT, SET_CONNECTED, GET_USER_PROFILE } from '../types';

const initialState = {
    account: null,
    connected: false,
    profile: {}
};

function walletReducer(state = initialState, action) {
    switch (action.type) {
        case SET_WALLET_ACCOUNT:
            return {
                ...state,
                account: action.payload
            }
        case SET_CONNECTED:
            return {
                ...state,
                connected: action.payload
            }
        case GET_USER_PROFILE:
            return {
                ...state,
                profile: action.payload
            }
        default:
            return state;
    }
}

export default walletReducer;