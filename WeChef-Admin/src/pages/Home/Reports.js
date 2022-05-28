import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import {
    Box,
    Button,
    ButtonGroup,
    Checkbox,
    Container,
    FormControlLabel,
    FormGroup,
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import BlockIcon from '@mui/icons-material/Block';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import FlagIcon from '@mui/icons-material/Flag';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';
import ReportModal from '../../components/modal/ReportModal';

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

const Reports = () => {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [items, setItems] = useState([]);
    const [reportHistories, setReportHistories] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [filterKey, setFilterKey] = useState('');
    const [checked, setChecked] = useState(false);
    const [openReports, setOpenReports] = useState(false);

    const { isAuthenticated } = useSelector(state => state.user);

    useEffect(() => {
        document.getElementById('header').style.display = "block";
        if (isAuthenticated) {
            getData();
        }
    }, [isAuthenticated, filterKey, checked, page, rowsPerPage]);

    const getData = async () => {
        try {
            const res = await axiosInstance.get('/items', {
                params: {
                    page: page,
                    rowsPerPage: rowsPerPage,
                    tokenId: filterKey,
                    checked: checked
                }
            });
            setItems(res.data.result1[0]);
            setTotalCount(Number(res.data.result2[0][0].cnt));
        } catch (err) {
            toast.error('Server error');
        }
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleAllow = async (id, val) => {
        try {
            const requestData = {
                id: id,
                blocked: val
            }
            const res = await axiosInstance.post('/items/block', requestData)
            if (res.data.success) {
                setItems(items.map(item => item.id === id ? { ...item, blocked: val } : item));
            }
        } catch (err) {
            console.log(err.response.data);
        }
    }

    const handleViewReports = async (id) => {
        try {
            const res = await axiosInstance.get('/items/reports/' + id);
            // console.log(res.data);
            setReportHistories(res.data);
            setOpenReports(true);
        } catch (err) {
            console.log(err.response.data);
        }
    }

    return (
        <Box>
            <Container>
                <Box my={4} display="flex" justifyContent="space-between" alignItems="center">
                    <TextField
                        type="number"
                        variant='outlined'
                        label="Search tokenID"
                        onChange={(e) => setFilterKey(e.target.value)}
                        value={filterKey}
                        size="small"
                    />
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox value={checked} onChange={(e) => setChecked(e.target.checked)} />}
                            label="Don't show blocked items"
                        />
                    </FormGroup>
                </Box>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Item</StyledTableCell>
                                <StyledTableCell align="right">Owner</StyledTableCell>
                                <StyledTableCell align="right">External Link</StyledTableCell>
                                <StyledTableCell align="right">Created Date</StyledTableCell>
                                <StyledTableCell align="right">Status</StyledTableCell>
                                <StyledTableCell align="right">Action</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.length > 0 ? items.map((row, index) => (
                                <StyledTableRow key={index} sx={{ backgroundColor: Number(row.report_count) > 0 ? '#e7c4bc80' : 'transparent' }}>
                                    <StyledTableCell scope="row">
                                        <Box display="flex" alignItems="center" py={1}>
                                            <img src={`${process.env.REACT_APP_SERVER_URL}/upload/item/${row.preview_img}`} height={50} alt="" />&nbsp;&nbsp;
                                            <Box>
                                                <Box sx={{ color: 'gray' }}>{row.collection_name}</Box>
                                                <Box display="flex" alignItems="center">{row.name}&nbsp;#{row.tokenId}</Box>
                                            </Box>
                                        </Box>
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        {row.owner_name}
                                    </StyledTableCell>
                                    <StyledTableCell scope="row" align="right">
                                        {row.externalLink}
                                    </StyledTableCell>
                                    <StyledTableCell scope="row" align="right">
                                        {moment(row.createdAt).format('MM.DD.YYYY HH:mm')}
                                    </StyledTableCell>
                                    <StyledTableCell scope="row" align="right">
                                        {!row.blocked ? <CheckIcon color='success' /> : <ClearIcon color='error' />}
                                    </StyledTableCell>
                                    <StyledTableCell scope="row" align="right">
                                        <ButtonGroup size="small" aria-label="small button group">
                                            <Button
                                                variant="text"
                                                color='success'
                                                title="Allow"
                                                disabled={row.blocked === false}
                                                onClick={() => handleAllow(row.id, false)}
                                            >
                                                <ThumbUpIcon />
                                            </Button>
                                            <Button
                                                variant="text"
                                                color="error"
                                                title="Block"
                                                disabled={row.blocked === true}
                                                onClick={() => handleAllow(row.id, true)}
                                            >
                                                <BlockIcon />
                                            </Button>
                                            <Button
                                                variant="text"
                                                color="error"
                                                title="View reports"
                                                onClick={() => handleViewReports(row.id)}
                                            ><FlagIcon /></Button>
                                        </ButtonGroup>
                                    </StyledTableCell>
                                </StyledTableRow>
                            )) : (
                                <StyledTableRow>
                                    <StyledTableCell colSpan={6} sx={{ textAlign: 'center' }} scope="row">
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
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Container>
            {
                openReports && <ReportModal
                    reports={reportHistories}
                    open={openReports}
                    handleClose={() => setOpenReports(false)}
                />
            }
        </Box>
    )
}

export default Reports;