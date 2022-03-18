import { combineReducers } from 'redux';
import collectionReducer from './collection';
import errorReducer from './error';
import itemReducer from './item';
import walletReducer from './wallet';

export default combineReducers({
    errors: errorReducer,
    wallet: walletReducer,
    collection: collectionReducer,
    item: itemReducer
});
