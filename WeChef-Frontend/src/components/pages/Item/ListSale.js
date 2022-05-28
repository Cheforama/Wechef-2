import { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import axios from 'axios';
import { MdHelpOutline, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { createGlobalStyle } from 'styled-components';
import TextField from '@mui/material/TextField';
// import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import Stack from '@mui/material/Stack';
// import DesktopDateTimePicker from '@mui/lab/DesktopDateTimePicker';
import Button from '@mui/material/Button';
import Switch from "react-switch";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { useNavigate, useParams } from "@reach/router";
// import moment from 'moment'
import { toast } from "react-toastify";
import { getMarketContract, getTokenContract } from "../../services/contract";
import { getItemDetail } from "../../../store/action/item";
import Web3 from "web3";
import { insertListHistory } from "../../../store/action/history";

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white {
    background: #fff;
    border-bottom: solid 1px #dddddd;
  }
  @media only screen and (max-width: 1199px) {
    .navbar{
      background: #403f83;
    }
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #111;
    }
    .item-dropdown .dropdown a{
      color: #111 !important;
    }
  }
`;


const ListSale = () => {

    const dispatch = useDispatch()
    const { active, account } = useWeb3React();
    const params = useParams();
    const router = useNavigate();

    const [price, setPrice] = useState('')
    const [fromDate, setFromDate] = useState(new Date())
    const [toDate, setToDate] = useState(new Date())
    const [more_option, setMoreOption] = useState(false);
    const [unlock, setUnlock] = useState(false);
    const [reserveAddress, setReserveAddress] = useState('')
    const [pending, setPending] = useState(false)
    const [tokenSymbol, setTokenSymbol] = useState('')

    const { item } = useSelector(state => state.item);

    useEffect(() => {
        if (active) {
            dispatch(getItemDetail(params.id))
        }
    }, [active, dispatch])

    useEffect(() => {
        const getTokenInfo = async () => {
            try {
                const tokenContract = getTokenContract();
                const symbol = await tokenContract.methods.symbol().call();
                setTokenSymbol(symbol);
            } catch (err) {
                console.log(err)
            }
        }
        getTokenInfo();
    }, [])

    const handleList = async () => {
        try {
            if (price === '' || Number(price) === 0) {
                toast.error('Amount field is required');
                return;
            }
            if (price < item.collection.floor_price) {
                toast.error(`You should set price bigger than floor price(${item.collection.floor_price})`);
                return;
            }
            // if (fromDate === '' || moment(fromDate).diff(new Date(), 'minutes') < 0) {
            //     toast.error('From Date is invaild');
            //     return;
            // }
            // if (toDate === '' || moment(toDate).diff(new Date(), 'minutes') < 0) {
            //     toast.error('To Date is invaild');
            //     return;
            // }
            // if (moment(fromDate).diff(toDate, 'seconds') > 0) {
            //     toast.error('To Date should be big than From Date');
            //     return;
            // }
            const res = await axios.post(process.env.REACT_APP_ENDPOINT + '/collection/checkstate', { account: account });
            if (!res.data) {
                toast.error("You are not allowd to list marketplace by admin");
                return;
            }
            setPending(true);
            const _from = fromDate.getTime();
            const _to = toDate.getTime();
            const _reserveAddress = reserveAddress === "" ? '0x0000000000000000000000000000000000000000' : reserveAddress;

            const marketContract = getMarketContract();
            await marketContract.methods.createMarketItem(item.tokenId, Web3.utils.toWei(Number(price).toString()), _from, _to, _reserveAddress.toString())
                .send({ from: account });

            setPending(false);

            toast.success("List success!")

            const history = {
                tokenId: item.tokenId,
                user: account,
                price: price,
                reservedAddress: _reserveAddress,
                from: fromDate,
                to: toDate
            }
            dispatch(insertListHistory(history))

            setTimeout(() => {
                router('/item/' + params.id)
            }, 1000);
        } catch (err) {
            console.log(err);
            setPending(false);
        }
    }

    return (
        <div>
            <GlobalStyles />

            <section className='jumbotron breadcumb no-bg' style={{ backgroundImage: `url(${'/img/background/wave.ccca1787.svg'})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', height: '85px' }}>
            </section>

            <div className="container pt-4">
                <div className="row">
                    <div className="col-md-7 col-12">
                        <p className="d-flex justify-content-between align-items-center">
                            <span className="font-bold color-black" style={{ fontSize: 24 }}>List item for sale</span>
                            <Button variant="outlined" sx={{ textTransform: 'unset' }} onClick={() => router(`/item/${params.id}`)}>Back</Button>
                        </p>
                        <p className="d-flex justify-content-between align-items-center">
                            <span style={{ fontSize: 20 }}>Price</span>
                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">List price and liging schedule can't be edited once the item is listed. You will need to cancel your listing and relist the item with the updated price and dates</Tooltip>}>
                                <span className="d-inline-block">
                                    <Button className="p-0" variant="text" style={{ pointerEvents: 'none', color: 'gray' }}>
                                        <MdHelpOutline size={24} />
                                    </Button>
                                </span>
                            </OverlayTrigger>
                        </p>
                        <div className="row mx-0">
                            <div className="col-md-3 col-6 d-flex align-items-center" style={{ border: 'rgba(0,0,0,.125)', borderRadius: 5, backgroundColor: '#ddd' }}>
                                <img src="/img/icons/coin.png" alt="" width={20} />&nbsp;&nbsp;{tokenSymbol}
                            </div>
                            <div className="col-md-9 col-6" style={{ paddingRight: 0 }}>
                                <TextField label="Amount" variant="outlined" onChange={(e) => setPrice(e.target.value)} fullWidth />
                            </div>
                        </div>
                        {/* <p className="mt-3" style={{ fontSize: 20 }}>Duration</p>
                        <div className="row mx-0">
                            <div className="col-6" style={{ paddingLeft: 0 }}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Stack spacing={3} display="flex">
                                        <DesktopDateTimePicker
                                            value={fromDate}
                                            onChange={(newValue) => {
                                                setFromDate(newValue);
                                            }}
                                            renderInput={(params) => <TextField {...params} />}
                                            label="From"
                                        />
                                    </Stack>
                                </LocalizationProvider>
                            </div>
                            <div className="col-6" style={{ paddingRight: 0 }}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Stack spacing={3} display="flex">
                                        <DesktopDateTimePicker
                                            value={toDate}
                                            onChange={(newValue) => {
                                                setToDate(newValue);
                                            }}
                                            renderInput={(params) => <TextField {...params} />}
                                            label="To"
                                        />
                                    </Stack>
                                </LocalizationProvider>
                            </div>
                        </div> */}
                        <div className="py-3 mt-3">
                            <Button variant="outlined" sx={{ textTransform: 'unset' }} onClick={() => setMoreOption(!more_option)}>
                                {more_option ? 'Fewer Options' : 'More Options'}&nbsp;&nbsp;
                                {more_option ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                            </Button>
                        </div>
                        {
                            more_option && (
                                <div className="my-2">
                                    <p className="d-flex justify-content-between align-items-center mb-0" style={{ fontSize: 20 }}>
                                        <span>Reserve for specific buyer</span>
                                        <Switch onChange={() => setUnlock(!unlock)} checked={unlock} />
                                    </p>
                                    <p>This item can be purchased as soon as it's listed.</p>

                                    <TextField
                                        label="Reserve Address"
                                        variant="outlined"
                                        onChange={(e) => setReserveAddress(e.target.value)}
                                        fullWidth
                                        disabled={!unlock}
                                    />
                                </div>
                            )
                        }
                        <Button
                            variant="contained"
                            sx={{ textTransform: 'unset' }}
                            onClick={handleList}
                            disabled={pending}
                        >List to marketplace</Button>
                    </div>
                    <div className="col-md-5 col-12 px-4">
                        {/* <p style={{ fontSize: 24 }}>Preview</p> */}
                        {/* <ItemCard data={item} /> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListSale;