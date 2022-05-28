import axios from 'axios'
import { toast } from 'react-toastify'
import { GET_COLLECTION, GET_COLLECTION_LIST, GET_FLOOR_PRICE, GET_OWNERS, SET_PENDING, SET_SUCCESS } from '../types'

export const uploadCollection = (data, router) => dispatch => {
    dispatch({
        type: SET_PENDING,
        payload: true
    })
    axios.post(process.env.REACT_APP_ENDPOINT + "/collection/create", data)
        .then(res => {
            toast.success("Collection created successfully");
            dispatch({
                type: SET_PENDING,
                payload: false
            })
            dispatch({
                type: SET_SUCCESS,
                payload: true
            })
            setTimeout(() => {
                dispatch({
                    type: SET_SUCCESS,
                    payload: false
                });
                router("/collections");
            }, 1000)
        })
        .catch(err => {
            console.log(err.response.data)
            if (err.response.status === 400) {
                toast.error(err.response.data.message);
            }
            dispatch({
                type: SET_PENDING,
                payload: false
            })
        })
}

export const getCollectionList = () => dispatch => {
    dispatch({
        type: SET_PENDING,
        payload: true
    })
    axios.get(process.env.REACT_APP_ENDPOINT + "/collection")
        .then(res => {
            dispatch({
                type: GET_COLLECTION_LIST,
                payload: res.data
            })
            setTimeout(() => {
                dispatch({
                    type: SET_PENDING,
                    payload: false
                })
            }, 1000)
        })
        .catch(err => {
            console.log(err.response.data)
            setTimeout(() => {
                dispatch({
                    type: SET_PENDING,
                    payload: false
                })
            }, 1000)
        })
}

export const getMyCollections = () => dispatch => {
    dispatch({
        type: SET_PENDING,
        payload: true
    })
    axios.get(process.env.REACT_APP_ENDPOINT + "/collections")
        .then(res => {
            dispatch({
                type: GET_COLLECTION_LIST,
                payload: res.data
            })
            setTimeout(() => {
                dispatch({
                    type: SET_PENDING,
                    payload: false
                })
            }, 1000)
        })
        .catch(err => {
            console.log(err.response.data)
            setTimeout(() => {
                dispatch({
                    type: SET_PENDING,
                    payload: false
                })
            }, 1000)
        })
}

export const getCollectionDetail = (id) => dispatch => {
    axios.get(process.env.REACT_APP_ENDPOINT + `/collection/${id}`)
        .then(res => {
            dispatch({
                type: GET_COLLECTION,
                payload: res.data.collection
            })
            const owners = Object.keys(res.data.result1).length > 0 ? res.data.result1[0][0].cnt : 0;
            const floor_price = Object.keys(res.data.result2[0]).length > 0 ? res.data.result2[0][0].floor_price : res.data.collection.floor_price
            dispatch({
                type: GET_OWNERS,
                payload: owners
            })
            dispatch({
                type: GET_FLOOR_PRICE,
                payload: floor_price
            })
        })
        .catch(err => console.log(err.response.data))
}