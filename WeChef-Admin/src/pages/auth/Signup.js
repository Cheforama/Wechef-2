import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Box, Button, FormHelperText, TextField, Typography } from "@mui/material";
import axios from 'axios';
import { toast } from "react-toastify";

const Signup = () => {

    const router = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState([]);

    const handleSignUp = async () => {
        if (password !== confirmPassword) return;
        const requestData = {
            email: email,
            password: password,
            confirmPassword: confirmPassword
        }
        axios.post(process.env.REACT_APP_ADMIN_API_URL + '/auth/signup', requestData)
            .then(res => {
                toast.success('Please wait until your account approve');
                router('/login');
            }).catch(err => setErrors(err.response.data.errors));
    }

    return (
        <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
            <Box minWidth={400} maxWidth='400px' border="1px solid #ddd" boxShadow="0 0 2px 2px #eee" p={3} borderRadius="10px">
                <img src="images/logo.png" width="250px" alt="" style={{ display: 'block', margin: 'auto' }} />
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
                <TextField
                    error={confirmPassword !== password}
                    type="password"
                    label="Confirm Password"
                    variant="outlined"
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    fullWidth
                    sx={{ my: 1 }}
                    helperText={confirmPassword !== password ? 'Password does not match' : ''}
                />
                <Button variant="contained" sx={{ my: 2 }} onClick={handleSignUp} fullWidth>Sign Up</Button>
                <Typography textAlign="center">
                    Already have an account?&nbsp;&nbsp;
                    <span style={{ textTransform: 'none', cursor: 'pointer', color: '#1976d2' }} onClick={() => router('/login')}>Sign in</span>&nbsp;here
                </Typography>
            </Box>
        </Box >
    )
}

export default Signup;