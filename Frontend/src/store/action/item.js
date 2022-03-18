import axios from "axios";
import { toast } from "react-toastify";
import { GET_ITEMS, SET_PENDING } from "../types";

export const saveItem = (data) => dispatch => {
    axios.post(process.env.REACT_APP_ENDPOINT + "/item/create", data)
        .then(res => {
            dispatch({
                type: SET_PENDING,
                payload: false
            })
            toast.success("Mint success!");
        })
        .catch(err => console.log(err.response.data));
}

export const getItems = (collection_id) => dispatch => {
    axios.get(process.env.REACT_APP_ENDPOINT + "/item", { params: { collection: collection_id } })
        .then(res => {
            console.log(res.data)
            dispatch({
                type: GET_ITEMS,
                payload: res.data
            })
        })
        .catch(err => console.log(err.response.data))
}