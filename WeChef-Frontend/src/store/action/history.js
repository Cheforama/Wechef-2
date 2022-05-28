import axios from "axios"
import { GET_HISTORIES, GET_TOTAL_COUNT, SET_PENDING } from "../types"

export const insertBuyHistory = (data) => dispatch => {
    axios.post(process.env.REACT_APP_ENDPOINT + "/history", data)
        .then(res => {
            console.log(res.data)
        })
        .catch(err => console.log(err.response.data))
}

export const insertListHistory = (data) => dispatch => {
    axios.post(process.env.REACT_APP_ENDPOINT + "/list", data)
        .then(res => {
            console.log(res.data)
        })
        .catch(err => console.log(err.response.data))
}

export const insertHistory = (data) => dispatch => {
    axios.post(process.env.REACT_APP_ENDPOINT + "/history/create", data)
        .then(res => {
            console.log(res.data)
        })
        .catch(err => console.log(err.response.data))
}

export const getAllActivities = (page, rowsPerPage) => dispatch => {
    dispatch({
        type: SET_PENDING,
        payload: true
    })
    axios.get(process.env.REACT_APP_ENDPOINT + "/history", { params: { page: page, rowsPerPage: rowsPerPage } })
        .then(res => {
            console.log(res.data)
            dispatch({
                type: GET_TOTAL_COUNT,
                payload: res.data.result2[0][0].cnt
            })
            dispatch({
                type: GET_HISTORIES,
                payload: res.data.result1[0]
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