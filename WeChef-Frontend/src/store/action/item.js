import axios from "axios";
import { toast } from "react-toastify";
import {
    GET_ITEMS,
    SET_PENDING,
    GET_ITEM_DETAIL,
    GET_LISTS,
    GET_HISTORIES,
    GET_TOP_SELLERS,
    GET_TOTAL_ITEMS,
    GET_REPORT_HISTORY
} from "../types";

export const saveItem = (data, address, router) => dispatch => {
    axios.post(process.env.REACT_APP_ENDPOINT + "/item/create", data)
        .then(res => {
            dispatch({
                type: SET_PENDING,
                payload: false
            })
            toast.success("Mint success!");
            setTimeout(() => {
                router(`/items/${address}`);
            }, 1000)
        })
        .catch(err => console.log(err.response.data));
}

export const getItems = (collection_id) => dispatch => {
    dispatch({
        type: SET_PENDING,
        payload: true
    })
    axios.get(process.env.REACT_APP_ENDPOINT + "/item", { params: { collection: collection_id } })
        .then(res => {
            console.log(res.data)
            dispatch({
                type: GET_ITEMS,
                payload: res.data[0]
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

export const getItemDetail = (id) => dispatch => {
    dispatch({
        type: SET_PENDING,
        payload: true
    })
    axios.get(process.env.REACT_APP_ENDPOINT + `/item/${id}`)
        .then(res => {
            // console.log(res.data)
            dispatch({
                type: GET_ITEM_DETAIL,
                payload: res.data.item
            })
            dispatch({
                type: GET_LISTS,
                payload: res.data.lists
            })
            dispatch({
                type: GET_HISTORIES,
                payload: res.data.histories
            })
            dispatch({
                type: GET_REPORT_HISTORY,
                payload: res.data.reportHistory
            })
        })
        .catch(err => console.log(err.response.data))
}

export const getDashboardData = () => dispatch => {
    dispatch({
        type: SET_PENDING,
        payload: true
    })
    axios.post(process.env.REACT_APP_ENDPOINT + "/item/popular")
        .then(res => {
            dispatch({
                type: GET_ITEMS,
                payload: res.data.popular_items[0]
            })
            dispatch({
                type: GET_TOP_SELLERS,
                payload: res.data.top_sellers[0]
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

export const updateItemOwner = (data) => dispatch => {
    axios.post(process.env.REACT_APP_ENDPOINT + "/item/changeOwner", data)
        .then(res => {
            console.log(res.data)
        })
        .catch(err => console.log(err.response.data))
}

export const getAllItems = (page, rowsPerPage) => dispatch => {
    dispatch({
        type: SET_PENDING,
        payload: true
    })
    axios.post(process.env.REACT_APP_ENDPOINT + "/item/all", { page: page, rowsPerPage: rowsPerPage })
        .then(res => {
            dispatch({
                type: GET_ITEMS,
                payload: res.data.result[0]
            })
            dispatch({
                type: GET_TOTAL_ITEMS,
                payload: res.data.itemCount
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

export const getMyItems = (page, rowsPerPage, account) => dispatch => {
    dispatch({
        type: SET_PENDING,
        payload: true
    })
    axios.post(process.env.REACT_APP_ENDPOINT + "/item/my_items", { page: page, rowsPerPage: rowsPerPage, account: account })
        .then(res => {
            // console.log(res.data.result[0])
            dispatch({
                type: GET_ITEMS,
                payload: res.data.result[0]
            })
            dispatch({
                type: GET_TOTAL_ITEMS,
                payload: Number(res.data.itemCount[0][0].cnt)
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

export const updateListHistory = (tokenId) => dispatch => {
    axios.post(process.env.REACT_APP_ENDPOINT + "/list/update_lists", { tokenId: tokenId })
        .then(res => {
            console.log(res.data)
        })
        .catch(err => console.log(err.response.data))
}

export const reportItem = (data) => dispatch => {
    axios.post(process.env.REACT_APP_ENDPOINT + '/item/report', data)
        .then(res => {
            if (res.data.success) {
                toast.success('Please wait untile admin check this item');
            }
        }).catch(err => console.log(err.response.data))
}