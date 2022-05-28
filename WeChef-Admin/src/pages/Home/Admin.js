import { Box, Button, Checkbox, Container, FormControlLabel, FormGroup, Paper, Table, TableBody, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.common.black,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const Admin = () => {

    const [users, setUsers] = useState([]);

    const { isAuthenticated } = useSelector(state => state.user);

    useEffect(() => {
        document.getElementById('header').style.display = "block";
        if (isAuthenticated === true) {
            getData();
        }
    }, [isAuthenticated]);

    const getData = async () => {
        try {
            const res = await axiosInstance.get('/');
            console.log(res.data)
            setUsers(res.data);
        } catch (err) {
            console.log(err.response.data);
        }
    }

    const handleAllow = async (id, val) => {
        try {
            const requestData = {
                id: id,
                allow: val
            }
            const res = await axiosInstance.post('/allow', requestData)
            if (res.data.success) {
                setUsers(users.map(user => user.id === id ? { ...user, status: val } : user));
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            console.log(err.response.data);
        }
    }

    return (
        <Box>
            <Container sx={{ mt: 8 }}>
                <Typography textAlign="center" component="h4" variant="h4" paddingBottom={4}>Privilege Setting</Typography>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="left">Email</StyledTableCell>
                                <StyledTableCell align="right">Register Date</StyledTableCell>
                                <StyledTableCell align="right">Status</StyledTableCell>
                                <StyledTableCell align="right">Action</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.length > 0 ? users.map((row, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell scope="row" align="left">
                                        {row.email}
                                    </StyledTableCell>
                                    <StyledTableCell scope="row" align="right">
                                        {moment(row.createdAt).format('MM.DD.YYYY HH:mm')}
                                    </StyledTableCell>
                                    <StyledTableCell scope="row" align="right">
                                        {row.status ? <CheckIcon color='success' /> : <ClearIcon color='error' />}
                                    </StyledTableCell>
                                    <StyledTableCell scope="row" align="right">
                                        <Button
                                            variant="text"
                                            color='success'
                                            title="Allow"
                                            disabled={row.status === 1}
                                            onClick={() => handleAllow(row.id, 1)}
                                        >
                                            <ThumbUpIcon />
                                        </Button>
                                        <Button
                                            variant="text"
                                            color="error"
                                            title="Block"
                                            disabled={row.status === 0}
                                            onClick={() => handleAllow(row.id, 0)}
                                        >
                                            <ThumbDownIcon />
                                        </Button>
                                    </StyledTableCell>
                                </StyledTableRow>
                            )) : (
                                <StyledTableRow>
                                    <StyledTableCell colSpan={7} sx={{ textAlign: 'center' }} scope="row">
                                        No Data
                                    </StyledTableCell>
                                </StyledTableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

            </Container>
        </Box>
    )
}

export default Admin;