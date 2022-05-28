import { Box, Container, Typography, Button } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {

    const router = useNavigate();

    const { isAuthenticated, user } = useSelector(state => state.user);

    return (
        <Box id="header" border="1px solid #ddd">
            <Container>
                <Box display="flex" alignItems="center" justifyContent="space-between" py={1}>
                    <img src="images/logo.png" alt="" width="250px" />
                    {
                        isAuthenticated ? (
                            <Box display="flex" alignItems="center">
                                {
                                    user.role === 'SUPER_ADMIN' && (
                                        <Typography sx={{ mx: 2, cursor: 'pointer' }} onClick={() => router('/admin')}>Privilege</Typography>
                                    )
                                }
                                <Typography sx={{ mx: 2, cursor: 'pointer' }} onClick={() => router('/users')}>Users</Typography>
                                <Typography sx={{ mx: 2, cursor: 'pointer' }} onClick={() => router('/report')}>Report</Typography>
                                <Typography sx={{ mx: 2, cursor: 'pointer' }} onClick={() => router('/account')}>Account</Typography>
                                <Button variant="text" sx={{ mx: 2, textTransform: 'none' }} onClick={() => router('/login')}>
                                    <LogoutIcon />&nbsp;Logout
                                </Button>
                            </Box>
                        ) : (
                            <Box display="flex" alignItems="center">
                                <Button
                                    variant="text"
                                    sx={{ mx: 2, cursor: 'pointer', textTransform: 'none' }}
                                    onClick={() => router('/login')}
                                ><LoginIcon />&nbsp;Login</Button>
                            </Box>
                        )
                    }
                </Box>
            </Container>
        </Box>
    )
}

export default Header;