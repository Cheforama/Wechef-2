import { GET_ITEMS, GET_ITEM_DETAIL, GET_REPORT_HISTORY, GET_TOP_SELLERS, GET_TOTAL_ITEMS } from '../types';

const initialState = {
    items: [],
    item: {},
    top_sellers: [],
    totalItems: 0,
    reportHistory: []
};

function itemReducer(state = initialState, action) {
    switch (action.type) {
        case GET_ITEMS:
            return {
                ...state,
                items: action.payload
            }
        case GET_ITEM_DETAIL:
            return {
                ...state,
                item: action.payload
            }
        case GET_TOP_SELLERS:
            return {
                ...state,
                top_sellers: action.payload
            }
        case GET_TOTAL_ITEMS:
            return {
                ...state,
                totalItems: action.payload
            }
        case GET_REPORT_HISTORY:
            return {
                ...state,
                reportHistory: action.payload
            }
        default:
            return state;
    }
}

export default itemReducer;