import * as React from 'react';
import { Box, TextField, Typography, Modal, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { reportItem } from '../../store/action/item';
import { toast } from 'react-toastify';
import { useWeb3React } from '@web3-react/core';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: window.innerWidth > 768 ? '30%' : '80%',
    bgcolor: 'background.paper',
    border: '1px solid rgba(0,0,0,.125)',
    borderRadius: '5px',
    p: 3
};

const ReportModal = (props) => {

    const dispatch = useDispatch();
    const { active } = useWeb3React();

    const [reason, setReason] = React.useState('');

    const handleReport = () => {
        if (!active) {
            toast.warning('Please connect wallet');
            return;
        }
        if (reason === '') return;
        const requestData = {
            itemId: props.id,
            reporter: props.account,
            reason: reason
        }
        dispatch(reportItem(requestData))
        props.handleClose();
    }

    return (
        <Modal
            keepMounted
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
        >
            <Box sx={style}>
                <Typography variant="h6" textAlign="center" component="h2" borderBottom="1px solid rgba(0,0,0,.125)" my={2} p={1}>
                    Report this item
                </Typography>
                <TextField
                    variant='outlined'
                    label='Reason *'
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    fullWidth
                    multiline
                    error={reason === ''}
                />
                <Button sx={{ mt: 2 }} variant='contained' onClick={handleReport} fullWidth>Report Now</Button>
            </Box>
        </Modal >
    )
}

export default ReportModal;