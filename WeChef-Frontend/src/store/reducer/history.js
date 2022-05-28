import { GET_HISTORIES, ADD_HISTORY, GET_LISTS, ADD_LIST, GET_TOTAL_COUNT } from '../types';

const initialState = {
    histories: [],
    lists: [],
    totalCount: 0
};

function historyReducer(state = initialState, action) {
    switch (action.type) {
        case GET_HISTORIES:
            return {
                ...state,
                histories: action.payload
            }
        case ADD_HISTORY:
            return {
                ...state,
                histories: state.histories.shift(action.payload)
            }
        case GET_LISTS:
            return {
                ...state,
                lists: action.payload
            }
        case ADD_LIST:
            return {
                ...state,
                lists: state.lists.shift(action.payload)
            }
        case GET_TOTAL_COUNT:
            return {
                ...state,
                totalCount: action.payload
            }
        default:
            return state;
    }
}

export default historyReducer;