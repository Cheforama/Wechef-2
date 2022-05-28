import * as React from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import moment from 'moment';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: window.innerWidth > 768 ? '40%' : '80%',
    bgcolor: 'background.paper',
    border: '1px solid rgba(0,0,0,.125)',
    borderRadius: '5px',
    p: 3
};

const ReportModal = (props) => {

    return (
        <Modal
            keepMounted
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
        >
            <Box sx={style}>
                <Typography component="h6" variant="h6" my={2}>Report List</Typography>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Reporter</TableCell>
                                <TableCell align="right">Reason</TableCell>
                                <TableCell align="right">Report Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.reports.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.user.username}
                                    </TableCell>
                                    <TableCell align="right">{row.reason}</TableCell>
                                    <TableCell align="right">{moment(row.updatedAt).format('MM.DD.YYYY HH:mm')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box display="flex" justifyContent="end" mt={2}>
                    <Button variant="contained" color="error" onClick={props.handleClose}>Close</Button>
                </Box>
            </Box>
        </Modal >
    )
}

export default ReportModal;