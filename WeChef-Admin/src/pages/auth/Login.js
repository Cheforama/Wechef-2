import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from "@mui/material";
import { toast } from 'react-toastify';
import axios from 'axios';
import { GET_AUTHENTICATED, GET_USER } from '../../store/types'

const Login = () => {

    const router = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (token) {
            localStorage.removeItem('jwtToken');
            dispatch({
                type: GET_AUTHENTICATED,
                payload: false
            });
            dispatch({
                type: GET_USER,
                payload: {}
            });
        }
        document.getElementById('header').style.display = "none";
    }, []);

    const handleLogin = async () => {
        const requestData = {
            email: email,
            password: password,
        }
        axios.post(process.env.REACT_APP_ADMIN_API_URL + '/auth/login', requestData)
            .then(res => {
                localStorage.setItem('jwtToken', res.data.token);
                // toast.success('Login success');
                window.location.href = '/';
            }).catch(err => setErrors(err.response.data.errors));
    }

    return (
        <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
            <Box minWidth={400} maxWidth='400px' border="1px solid #ddd" boxShadow="0 0 2px 2px #eee" p={3} borderRadius="10px">
                <img src="images/logo.png" width="250px" alt="" style={{ display: 'block', margin: 'auto' }} />
                <Typography my={2} textAlign="center" component="h6" variant="h6" color="#747474">Welcome to WeChef Admin</Typography>
                <TextField
                    error={errors.length > 0 && errors.filter((err) => err.param === 'email').length > 0}
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    sx={{ my: 1 }}
                    helperText={errors.length > 0 && errors.filter((err) => err.param === 'email').length > 0 ? errors.filter((err) => err.param === 'email')[0]['msg'] : ''}
                />
                <TextField
                    error={errors.length > 0 && errors.filter((err) => err.param === 'password').length > 0}
                    type="password"
                    label="Password"
                    variant="outlined"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    sx={{ my: 1 }}
                    helperText={errors.length > 0 && errors.filter((err) => err.param === 'password').length > 0 ? errors.filter((err) => err.param === 'password')[0]['msg'] : ''}
                />
                <Box display="flex" alignItems="center" justifyContent="space-between" my={2}>
                    <Button variant="text" sx={{ textTransform: 'none' }} onClick={() => router('/signup')}>Not registered?</Button>
                    <Button variant="contained" onClick={handleLogin}>Sign In</Button>
                </Box>
            </Box>
        </Box >
    )
}

export default Login;