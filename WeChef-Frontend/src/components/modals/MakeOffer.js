import * as React from 'react';
import { Box, TextField, Typography, Modal, FormControlLabel, Checkbox, Button } from '@mui/material';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Stack from '@mui/material/Stack';
import DesktopDateTimePicker from '@mui/lab/DesktopDateTimePicker';
import { toast } from 'react-toastify';
import moment from 'moment';
import { getMarketContract, getTokenContract } from '../services/contract';
import { market_address } from '../../contracts/contract';
import Web3 from 'web3';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: window.innerWidth > 768 ? '30%' : '80%',
    bgcolor: 'background.paper',
    border: '1px solid rgba(0,0,0,.125)',
    borderRadius: '5px'
};

const MakeOffer = (props) => {

    const [expiration, setExpiration] = React.useState(new Date());
    const [price, setPrice] = React.useState('');
    const [checked, setChecked] = React.useState(false);
    const [pending, setPending] = React.useState(false);

    const handleOffer = async () => {
        try {
            if (price === '' || Number(price) === 0) {
                toast.warning("Please input offer price");
                return;
            }
            if (Number(Web3.utils.fromWei(props.balance.toString())) < Number(price)) {
                toast.error("Insufficient funds");
                return;
            }
            // if (moment(expiration).diff(new Date(), "minutes") < 1) {
            //     toast.warning("Offer Expiration should be bigger than current time");
            //     return;
            // }
            setPending(true);
            const allowed = Number(Web3.utils.fromWei(props.allowance.toString())) + Number(price);
            console.log(">>>>>>>>>", allowed)
            const tokenContract = getTokenContract();
            await tokenContract.methods.approve(market_address, Web3.utils.toWei(allowed.toString())).send({ from: props.account });

            const _expiration = expiration.getTime();
            const contract = getMarketContract();
            await contract.methods.makeOffer(props.tokenId, Web3.utils.toWei(price.toString()), _expiration)
                .send({ from: props.account });
            setPending(false);
            toast.success("Make offer success!");
            props.handleSuccess();
        } catch (err) {
            console.log(err);
            setPending(false);
        }
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
                <Typography variant="h6" textAlign="center" component="h2" borderBottom="1px solid rgba(0,0,0,.125)" padding={2}>
                    Make offer
                </Typography>
                <Box px={4} py={2}>
                    <Typography variant='h6' component="p" display="flex" justifyContent="space-between" alignItems="center">
                        <span>Price</span>
                        <span style={{ fontSize: 16 }}>Balance: {Web3.utils.fromWei(props.balance.toString())} CHEF</span>
                    </Typography>
                    <TextField
                        label="Price"
                        variant="outlined"
                        onChange={(e) => setPrice(e.target.value)}
                        fullWidth
                    />
                    {/* <Typography variant="h6" component="p" mt={4} mb={1}>Offer Expiration</Typography>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Stack spacing={3} display="flex">
                            <DesktopDateTimePicker
                                value={expiration}
                                onChange={(newValue) => {
                                    setExpiration(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} />}
                                label="Expiration Date"
                            />
                        </Stack>
                    </LocalizationProvider> */}
                    <FormControlLabel
                        control={<Checkbox />}
                        label="By checking this box, I agree to WeChef's Term of Service"
                        onChange={(e) => setChecked(e.target.checked)}
                        sx={{ marginTop: 4 }}
                    />
                    <Button
                        variant="contained"
                        sx={{ my: 2 }}
                        onClick={handleOffer}
                        fullWidth
                        disabled={!checked || pending}
                    >Make Offer</Button>
                </Box>
            </Box>
        </Modal >
    )
}

export default MakeOffer;