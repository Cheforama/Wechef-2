import * as React from 'react';
import { Box, TextField, Modal } from '@mui/material';

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

const ReasonModal = (props) => {

    return (
        <Modal
            keepMounted
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
        >
            <Box sx={style}>
                <TextField
                    variant='outlined'
                    label='Reason *'
                    rows={3}
                    value={props.reason}
                    fullWidth
                    multiline
                    disabled
                />
            </Box>
        </Modal >
    )
}

export default ReasonModal;