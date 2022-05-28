import {
    GET_COLLECTION,
    GET_COLLECTION_LIST, GET_FLOOR_PRICE, GET_OWNERS, SET_PENDING, SET_SUCCESS
} from '../types';

const initialState = {
    collection: {},
    collections: [],
    pending: false,
    success: false,
    floor_price: 0,
    owners: 0
};

function collectionReducer(state = initialState, action) {
    switch (action.type) {
        case GET_COLLECTION_LIST:
            return {
                ...state,
                collections: action.payload
            }
        case SET_PENDING:
            return {
                ...state,
                pending: action.payload
            }
        case SET_SUCCESS:
            return {
                ...state,
                success: action.payload
            }
        case GET_COLLECTION:
            return {
                ...state,
                collection: action.payload
            }
        case GET_OWNERS:
            return {
                ...state,
                owners: action.payload
            }
        case GET_FLOOR_PRICE:
            return {
                ...state,
                floor_price: action.payload
            }
        default:
            return state;
    }
}

export default collectionReducer;