import { combineReducers } from 'redux';
import collectionReducer from './collection';
import errorReducer from './error';
import historyReducer from './history';
import itemReducer from './item';
import walletReducer from './wallet';

export default combineReducers({
    errors: errorReducer,
    wallet: walletReducer,
    collection: collectionReducer,
    item: itemReducer,
    history: historyReducer
});
