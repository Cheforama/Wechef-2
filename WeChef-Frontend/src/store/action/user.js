import axios from 'axios';
import { toast } from 'react-toastify';
import setAuthToken from '../../components/services/setAuthToken';
import { GET_USER_PROFILE, SET_PENDING } from '../types';

export const saveProfile = (data) => dispatch => {
    dispatch({
        type: SET_PENDING,
        payload: true
    })
    axios.post(process.env.REACT_APP_ENDPOINT + "/signup", data)
        .then(res => {
            dispatch({
                type: GET_USER_PROFILE,
                payload: res.data
            })
            toast.success("Success!")
            dispatch({
                type: SET_PENDING,
                payload: false
            })
        })
        .catch(err => {
            console.log(err.response.data)
            dispatch({
                type: SET_PENDING,
                payload: false
            })
        })
}

export const getProfile = (walletAddress) => dispatch => {
    axios.get(process.env.REACT_APP_ENDPOINT + "/profile", { params: { address: walletAddress } })
        .then(res => {
            dispatch({
                type: GET_USER_PROFILE,
                payload: res.data
            })
        })
        .catch(err => console.log(err.response.data))
}

export const connectUser = (address) => dispatch => {
    axios.post(process.env.REACT_APP_ENDPOINT + "/connect", { address: address })
        .then(res => {
            localStorage.setItem('jwtToken', res.data.accessToken)
            setAuthToken(res.data.accessToken)
            dispatch(getProfile(address))
        })
        .catch(err => console.log(err.response.data))
}