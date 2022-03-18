import axios from 'axios'
import { toast } from 'react-toastify'
import { GET_COLLECTION, GET_COLLECTION_LIST, SET_PENDING, SET_SUCCESS } from '../types'

export const uploadCollection = (data) => dispatch => {
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
                })
            }, 1000)
        })
        .catch(err => {
            console.log(err.response.data)
            dispatch({
                type: SET_PENDING,
                payload: false
            })
        })
}

export const getCollectionList = () => dispatch => {
    axios.get(process.env.REACT_APP_ENDPOINT + "/collection")
        .then(res => {
            console.log(res.data)
            dispatch({
                type: GET_COLLECTION_LIST,
                payload: res.data
            })
        }).catch(err => console.log(err.response.data))
}

export const getMyCollections = () => dispatch => {
    axios.get(process.env.REACT_APP_ENDPOINT + "/collections")
        .then(res => {
            dispatch({
                type: GET_COLLECTION_LIST,
                payload: res.data
            })
        })
        .catch(err => console.log(err.response.data))
}

export const getCollectionDetail = (id) => dispatch => {
    axios.get(process.env.REACT_APP_ENDPOINT + `/collection/${id}`)
        .then(res => {
            dispatch({
                type: GET_COLLECTION,
                payload: res.data
            })
        })
        .catch(err => console.log(err.response.data))
}