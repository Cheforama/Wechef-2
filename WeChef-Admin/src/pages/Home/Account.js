import { Box, Button, Container, Grid, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from '../../utils/axiosInstance';

const Account = () => {

    const router = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    const { isAuthenticated, user } = useSelector(state => state.user);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            router('/login');
        }
    }, [])

    useEffect(() => {
        document.getElementById('header').style.display = "block";
        if (isAuthenticated) {
            setEmail(user?.email);
        }
    }, [isAuthenticated, user]);

    const handleSave = async () => {
        try {
            if (!isAuthenticated) return;
            if (password !== password2) {
                toast.error("Password does not match");
                return;
            }
            if (email === user?.email && password === '') return;
            const requestData = {
                email: email,
                password: password
            }
            const res = await axiosInstance.put('/account', requestData);
            if (res.data.success) {
                toast.success('Your account changed successfully. Please login again');
                setTimeout(() => {
                    router('/login');
                }, 1000);
            }
        } catch (err) {

        }
    }

    return (
        <Box>
            <Container sx={{ my: 6 }}>
                <Grid container spacing={2}>
                    <Grid item md={3} xs={12}></Grid>
                    <Grid item md={6} xs={12}>
                        <Typography textAlign="center" component="h4" variant="h4">Account Setting</Typography>
                        <Box mt={4}>
                            <TextField
                                label="Email Address"
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={user.role === 'ADMIN'}
                                fullWidth
                                sx={{ my: 1 }}
                            />
                            <TextField
                                type="password"
                                label="New Password"
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                fullWidth
                                sx={{ my: 1 }}
                            />
                            <TextField
                                type="password"
                                label="Confirm Password"
                                variant="outlined"
                                value={password2}
                                onChange={(e) => setPassword2(e.target.value)}
                                fullWidth
                                sx={{ my: 1 }}
                                error={password !== '' && password2 !== '' && password !== password2}
                                helperText={password !== '' && password2 !== '' && password !== password2 ? 'Password does not match' : ''}
                            />
                            <Button
                                variant="contained"
                                onClick={handleSave}
                                fullWidth
                                sx={{ mt: 1 }}
                                disabled={email === user?.email && password === ''}
                            >Save Changes</Button>
                        </Box>
                    </Grid>
                    <Grid item md={3} xs={12}></Grid>
                </Grid>
            </Container>
        </Box>
    )
}

export default Account;