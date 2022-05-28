import { Box, Button, Checkbox, Container, FormControlLabel, FormGroup, Paper, Table, TableBody, TableContainer, TableHead, TablePagination, TableRow, TextField } from '@mui/material';
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

const Users = () => {

    const [pagenum, setPagenum] = useState(0);
    const [pagesize, setPagesize] = useState(10);
    const [users, setUsers] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [filterKey, setFilterKey] = useState('');
    const [checked, setChecked] = useState(false);

    const { isAuthenticated } = useSelector(state => state.user);

    useEffect(() => {
        document.getElementById('header').style.display = "block";
        if (isAuthenticated === true) {
            getData();
        }
    }, [isAuthenticated, pagesize, pagenum, filterKey, checked]);

    const getData = async () => {
        try {
            const res = await axiosInstance.get('/users', {
                params: {
                    pagesize: pagesize,
                    pagenum: pagenum,
                    filterKey: filterKey,
                    checked: checked
                }
            });

            setUsers(res.data.result1[0]);
            setTotalCount(Number(res.data.result2[0][0].cnt));
        } catch (err) {
            console.log(err.response.data);
        }
    }

    const handleChangeRowsPerPage = (event) => {
        setPagesize(parseInt(event.target.value, 10));
        setPagenum(0);
    };

    const handleAllow = async (id, val) => {
        try {
            const requestData = {
                id: id,
                allow: val
            }
            const res = await axiosInstance.post('/users/allow', requestData)
            if (res.data.success) {
                setUsers(users.map(user => user.id === id ? { ...user, allowed: val } : user));
            }
        } catch (err) {
            console.log(err.response.data);
        }
    }

    const handleChangePage = (event, newPage) => {
        setPagenum(newPage);
    };

    return (
        <Box>
            <Container>
                <Box my={4} display="flex" justifyContent="space-between" alignItems="center">
                    <TextField
                        variant='outlined'
                        label="Search key"
                        onChange={(e) => setFilterKey(e.target.value)}
                        value={filterKey}
                        size="small"
                    />
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox value={checked} onChange={(e) => setChecked(e.target.checked)} />}
                            label="Don't show blocked users"
                        />
                    </FormGroup>
                </Box>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Avatar</StyledTableCell>
                                <StyledTableCell align="right">User</StyledTableCell>
                                <StyledTableCell align="right">Email</StyledTableCell>
                                <StyledTableCell align="right">Wallet</StyledTableCell>
                                <StyledTableCell align="right">Register Date</StyledTableCell>
                                <StyledTableCell align="right">Status</StyledTableCell>
                                <StyledTableCell align="right">Action</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.length > 0 ? users.map((row, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell scope="row">
                                        {
                                            row.hasOwnProperty('profile_img') ? row.profile_img !== "" ? (
                                                <img
                                                    src={`${process.env.REACT_APP_SERVER_URL}/file/profile/${row.profile_img}`}
                                                    onError={({ currentTarget }) => {
                                                        currentTarget.onerror = null; // prevents looping
                                                        currentTarget.src = "/images/no-avatar.png";
                                                    }}
                                                    className="border-circle"
                                                    width={30}
                                                    alt=""
                                                />
                                            ) : (
                                                <img src="/images/no-avatar.png" className="border-circle" width={30} alt="" />
                                            ) : <></>
                                        }
                                    </StyledTableCell>
                                    <StyledTableCell scope="row" align="right">
                                        {row.username}
                                    </StyledTableCell>
                                    <StyledTableCell scope="row" align="right">
                                        {row.email}
                                    </StyledTableCell>
                                    <StyledTableCell scope="row" align="right">
                                        {row.wallet.slice(0, 6)}...{row.wallet.slice(row.wallet.length - 6, row.wallet.length)}
                                    </StyledTableCell>
                                    <StyledTableCell scope="row" align="right">
                                        {moment(row.createdAt).format('MM.DD.YYYY HH:mm')}
                                    </StyledTableCell>
                                    <StyledTableCell scope="row" align="right">
                                        {row.allowed ? <CheckIcon color='success' /> : <ClearIcon color='error' />}
                                    </StyledTableCell>
                                    <StyledTableCell scope="row" align="right">
                                        <Button
                                            variant="text"
                                            color='success'
                                            title="Allow"
                                            disabled={row.allowed === true}
                                            onClick={() => handleAllow(row.id, true)}
                                        >
                                            <ThumbUpIcon />
                                        </Button>
                                        <Button
                                            variant="text"
                                            color="error"
                                            title="Block"
                                            disabled={row.allowed === false}
                                            onClick={() => handleAllow(row.id, false)}
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

                <TablePagination
                    component="div"
                    count={totalCount}
                    page={pagenum}
                    onPageChange={handleChangePage}
                    rowsPerPage={pagesize}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

            </Container>
        </Box>
    )
}

export default Users;