import React, { useEffect } from "react";
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from '@reach/router';
import { createGlobalStyle } from 'styled-components';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Accordion } from "react-bootstrap";
import { MdBallot, MdLabel, MdList, MdLocalActivity, MdLocalOffer, MdNotes, MdThumbDown, MdThumbUp, MdFlag } from "react-icons/md";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import Button from '@mui/material/Button';
import Footer from '../../components/footer';
import { getItemDetail, updateItemOwner, updateListHistory } from "../../../store/action/item";
import { market_address } from "../../../contracts/contract";
import Panel from "../../components/Panel";
import { activityHeader, listingsHeader, reportHeader } from "../../../utils/tables";
import MakeOffer from "../../modals/MakeOffer";
import { getMarketContract, getTokenContract } from "../../services/contract";
import Web3 from "web3";
import { toast } from "react-toastify";
import { insertBuyHistory } from "../../../store/action/history";
import { GET_ITEM_DETAIL, SET_PENDING } from "../../../store/types";
import axios from 'axios'
import ReportModal from "../../modals/ReportModal";
import ReasonModal from "../../modals/ReasonModal";

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

const Colection = function () {

    const offersHeader = [
        {
            name: "Buyer",
            selector: row => "buyer",
            cell: d => <div className='d-flex align-items-center'>{d.buyer.slice(0, 6)}...{d.buyer.slice(d.buyer.length - 4, d.buyer.length)}</div>
        },
        // {
        //     name: "Expiration",
        //     selector: row => "expire",
        //     cell: d => <div className='d-flex align-items-center'>{moment(new Date(Number(d.expire)).toLocaleDateString("en-US")).format('MM-DD-YYYY')}</div>
        // },
        {
            name: "Price",
            selector: row => "price",
            cell: d => <div className='d-flex align-items-center'>{Web3.utils.fromWei(d.price.toString())} CHEF</div>
        },
        {
            name: "Action",
            cell: d => account === tokenOwner ? <>
                <Button color='success' title="Approve" sx={{ textTransform: 'none', fontSize: 20 }} onClick={() => handleApprove(d)}><MdThumbUp /></Button>
                <Button color='secondary' title="Cancel" sx={{ textTransform: 'none', fontSize: 20 }} onClick={() => handleCancelOffer(d.buyer)}><MdThumbDown /></Button>
            </> : <></>
        },
    ]

    const { active, account } = useWeb3React();
    const dispatch = useDispatch();
    const params = useParams();
    const router = useNavigate();

    const [metadata, setMetadata] = React.useState({});
    const [openOffer, setOpenOffer] = React.useState(false);
    const [openReport, setOpenReport] = React.useState(false);
    const [openReason, setOpenReason] = React.useState(false);
    const [marketInfo, setMarketInfo] = React.useState({});
    const [pendingState, setpendingState] = React.useState(false);
    const [tokenSymbol, setTokenSymbol] = React.useState('');
    const [tokenBalance, setTokenBalance] = React.useState(0);
    const [tokenAllowance, setTokenAllowance] = React.useState(0);
    const [tokenOwner, setTokenOwner] = React.useState('');
    const [offerList, setOfferList] = React.useState([]);
    const [report_id, setReportId] = React.useState('');

    const { pending } = useSelector(state => state.collection);
    const { item, reportHistory } = useSelector(state => state.item)
    const { histories, lists } = useSelector(state => state.history)

    useEffect(() => {
        if (pending) {
            document.getElementById('myHeader').style.display = 'none';
        } else {
            document.getElementById('myHeader').style.display = 'flex';
        }
    }, [pending])

    useEffect(() => {
        if (active) {
            axios.post(process.env.REACT_APP_ENDPOINT + `/check_item/${params.id}`)
                .then(res => {
                    if (!res.data) {     //blocked = false
                        dispatch({
                            type: GET_ITEM_DETAIL,
                            payload: {}
                        });
                        dispatch(getItemDetail(params.id));
                    } else {
                        toast.error("This item has been blocked by amdin");
                        setTimeout(() => {
                            router('/explore');
                        }, 1000);
                    }
                }).catch(err => {
                    console.log(err.response.data);
                })
        }
    }, [active, dispatch]);

    useEffect(() => {
        const getMetadata = async () => {
            try {
                const res = await fetch('https://ipfs.io/ipfs/' + item.asset, { method: 'GET' })
                const json = await res.json()
                setMetadata(json);
            } catch (err) {
                console.log(err)
            }
        }
        if (item.hasOwnProperty('asset')) {
            getMetadata()
        }
    }, [item])

    useEffect(() => {
        if (Object.keys(item).length > 0) {
            getMarketInfo(item.tokenId)
        }
    }, [item])

    const getMarketInfo = async (tokenId) => {
        try {
            const tokenContract = getTokenContract();
            const symbol = await tokenContract.methods.symbol().call();
            const balance = await tokenContract.methods.balanceOf(account).call();
            const allowance = await tokenContract.methods.allowance(account, market_address).call()
            setTokenSymbol(symbol);
            setTokenBalance(balance);
            setTokenAllowance(allowance)

            const contract = getMarketContract();
            const owner = await contract.methods.ownerOf(tokenId).call();
            const token_info = await contract.methods.fetchMarketItem(tokenId).call()
            setMarketInfo({
                tokenId: token_info.tokenId,
                seller: token_info.seller,
                price: token_info.price,
                owner: token_info.owner,
                from: token_info.from,
                to: token_info.to,
                reserveAddress: token_info.reserveAddress
            })

            setTokenOwner(owner === market_address ? token_info.seller : owner);
            const offer_list = await contract.methods.getOffersByTokenId(tokenId).call();
            let _offers = new Array();
            offer_list.map(offer => {
                _offers.push({
                    tokenId: offer.tokenId,
                    buyer: offer.buyer,
                    price: offer.price,
                    expire: offer.expire
                })
            })
            setOfferList(_offers);
            setTimeout(() => {
                dispatch({
                    type: SET_PENDING,
                    payload: false
                })
            }, 1000)
        } catch (err) {
            console.log(err)
        }
    }

    const handleBuy = async () => {
        try {
            if (item.blocked) {
                toast.error("This item has been blocked by admin.");
                return;
            }
            if (Number(Web3.utils.fromWei(tokenBalance.toString())) < Number(Web3.utils.fromWei(marketInfo.price.toString()))) {
                toast.error("Insufficient funds.")
                return;
            }
            setpendingState(true)
            const tokenContract = getTokenContract();
            await tokenContract.methods.approve(market_address, marketInfo.price)
                .send({ from: account });

            const contract = getMarketContract();
            await contract.methods.createMarketSale(marketInfo.tokenId, marketInfo.price)
                .send({ from: account })
            setpendingState(false)

            getMarketInfo(item.tokenId);

            const data = {
                owner: account,
                id: item.id
            }
            dispatch(updateItemOwner(data))

            const history = {
                seller: tokenOwner,
                buyer: account,
                price: Web3.utils.fromWei(marketInfo.price.toString()),
                tokenId: marketInfo.tokenId
            }
            dispatch(insertBuyHistory(history))

            dispatch(updateListHistory(item.tokenId));

            setTimeout(() => {
                dispatch(getItemDetail(params.id));
            }, 500)

            toast.success("Buy success!");
        } catch (err) {
            console.log(err)
            setpendingState(false)
        }
    }

    const handleRemove = async () => {
        try {
            if (item.blocked) {
                toast.error("This item has been blocked by admin.");
                return;
            }
            const marketContract = getMarketContract();
            await marketContract.methods.removeFromMarketplace(item.tokenId).send({ from: account });

            getMarketInfo(item.tokenId);

            dispatch(updateListHistory(item.tokenId));
        } catch (err) {
            console.log(err);
        }
    }

    const handleCancelMyOffer = async () => {
        try {
            if (item.blocked) {
                toast.error("This item has been blocked by admin.");
                return;
            }
            const marketContract = getMarketContract();
            await marketContract.methods.cancelMyOffer(marketInfo.tokenId).send({ from: account })

            getMarketInfo(marketInfo.tokenId);
        } catch (err) {
            console.log(err)
        }
    }

    const handleCancelOffer = async (buyer) => {
        try {
            if (item.blocked) {
                toast.error("This item has been blocked by admin.");
                return;
            }
            const marketContract = getMarketContract();
            await marketContract.methods.cancelOffer(marketInfo.tokenId, buyer).send({ from: account })

            getMarketInfo(marketInfo.tokenId);
        } catch (err) {
            console.log(err)
        }
    }

    const handleApprove = async (row) => {
        try {
            if (item.blocked) {
                toast.error("This item has been blocked by admin.");
                return;
            }
            const marketContract = getMarketContract();
            await marketContract.methods.approveOffer(item.tokenId, row.buyer).send({ from: account })

            getMarketInfo(item.tokenId);
            // console.log(">>>>>>>>>>>>", item)
            const history = {
                seller: account,
                buyer: row.buyer,
                price: Web3.utils.fromWei(String(row.price)),
                tokenId: item.tokenId
            }
            dispatch(insertBuyHistory(history))

            const data = {
                owner: row.buyer,
                id: item.id
            }
            dispatch(updateItemOwner(data))

            dispatch(updateListHistory(item.tokenId));

            setTimeout(() => {
                dispatch(getItemDetail(params.id));
            }, 500)

        } catch (err) {
            console.log(err)
        }
    }

    return pending ? (
        <Box className='d-flex align-items-center justify-content-center' sx={{ width: '100vw', height: '100vh' }}>
            <CircularProgress />
        </Box>
    ) : (
        <div>
            <GlobalStyles />

            <section className='jumbotron breadcumb no-bg' style={{ backgroundImage: `url(${'/img/background/wave.ccca1787.svg'})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', height: '85px' }}>
            </section>

            <section className='container pt-0'>
                <div className='row mt-md-5 pt-md-4'>
                    {
                        item.hasOwnProperty('user') && account === tokenOwner ? (
                            <div className="col-12 d-flex justify-content-end mb-2">
                                {
                                    Number(marketInfo?.tokenId) === Number(item?.tokenId) ? (
                                        <Button
                                            variant="contained"
                                            style={{ minWidth: 100 }}
                                            onClick={handleRemove}
                                            color="error"
                                            disabled={item.blocked}
                                        >Remove from marketplace</Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            style={{ minWidth: 100 }}
                                            onClick={() => router('/item/' + item.id + '/sell')}
                                            disabled={item.blocked}
                                        >List to marketplace</Button>
                                    )
                                }
                            </div>
                        ) : (
                            <Box display="flex" justifyContent="end" mb={2}>
                                <Button
                                    color="error"
                                    variant="contained"
                                    style={{ minWidth: 100 }}
                                    onClick={() => setOpenReport(true)}
                                    disabled={item.blocked}
                                ><MdFlag />&nbsp;Report this item</Button>
                            </Box>
                        )
                    }
                    <div className="col-md-5 text-center">
                        <div className="p-2 border1 border-gray border-radius-10">
                            <div className="d-flex align-items-center justify-content-between py-2">
                                <span>
                                    <img src="/img/icons/coin.png" alt="" width={24} />
                                </span>
                                {/* <span>
                                    <MdFavorite />&nbsp;0
                                </span> */}
                            </div>
                            <div>
                                {
                                    Object.keys(item).length > 0 && item?.asset_filetype.indexOf('video') > -1 ? (
                                        <video width="80%" controls src={item.ipfs_cid}>
                                        </video>
                                    ) : (
                                        <img src={item.ipfs_cid} alt="" width="80%" className="d-block m-auto" />
                                    )
                                }
                            </div>
                        </div>
                        <Accordion defaultActiveKey="0" className="my-3">
                            <Accordion.Item eventKey="0" >
                                <Accordion.Header><MdNotes />&nbsp;Description</Accordion.Header>
                                <Accordion.Body style={{ textAlign: 'left' }}>
                                    <div>Created By {
                                        item.hasOwnProperty('user') ? item.user.wallet === account ? 'You' :
                                            item.user.username !== 'unnamed' ? item.user.username :
                                                `${item.user.wallet.slice(0, 6)}...${item.user.wallet.slice(item.user.wallet.length - 4, item.user.wallet.length)}` :
                                            ''
                                    }
                                    </div>
                                    <div>{item.description}</div>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header><MdLabel />&nbsp;Properties</Accordion.Header>
                                <Accordion.Body>
                                    <div className="row">
                                        {
                                            item.hasOwnProperty('properties') && item.properties.length > 0 ? item.properties.map((data, index) => (
                                                <div className="col-md-3 p-2" key={index}>
                                                    <div className="attribute-box py-3">
                                                        <p className="color-light-blue mb-2">{data.trait_type}</p>
                                                        <p className="color-black mb-0">{data.value}</p>
                                                    </div>
                                                </div>
                                            )) : <div>No properties</div>
                                        }
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="2">
                                <Accordion.Header><MdBallot />&nbsp;Details</Accordion.Header>
                                <Accordion.Body>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <span>Contract Address</span>
                                        <span>
                                            <a href={`https://testnet.bscscan.com/address/${market_address}`} target="_blank">
                                                {market_address.slice(0, 6)}...{market_address.slice(market_address.length - 4, market_address.length)}
                                            </a>
                                        </span>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <span>Token ID</span>
                                        <span>{item?.tokenId}</span>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <span>Token Standard</span>
                                        <span>ERC 721</span>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <span>Blockchain</span>
                                        <span>Binance Smart Chain</span>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <span>Metadata</span>
                                        <span>Decentralized</span>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                    <div className="col-md-7">
                        <h3>{item.hasOwnProperty('collection') && item?.collection.name}</h3>
                        <h2>{item.hasOwnProperty('name') && item?.name}</h2>
                        <h4>Owned by {
                            tokenOwner === account ? 'You' : item?.user?.username !== 'unnamed' ? item?.user?.username :
                                `${tokenOwner.slice(0, 6)}...${tokenOwner.slice(tokenOwner.length - 4, tokenOwner.length)}`
                        }</h4>
                        {
                            marketInfo.hasOwnProperty('tokenId') && Number(marketInfo?.tokenId) !== 0 && (
                                <h4 className="d-flex justify-content-between align-items-center">
                                    <span>Price: {Web3.utils.fromWei(marketInfo.price.toString())}&nbsp;{tokenSymbol}</span>
                                    <span>Your Balance: {Web3.utils.fromWei(tokenBalance.toString())}&nbsp;{tokenSymbol}</span>
                                </h4>
                            )
                        }
                        {
                            Number(marketInfo?.tokenId) !== 0 && account !== tokenOwner && (
                                <div className="mt-4 p-3" style={{ border: '1px solid rgba(0,0,0,.125)', borderRadius: 10 }}>
                                    {
                                        offerList.filter(offer => offer.buyer === account).length > 0 ? (
                                            <Button disabled={item.blocked} variant="outlined" color="error" sx={{ minWidth: 200 }} onClick={handleCancelMyOffer}>
                                                <MdLocalOffer />&nbsp; Cancel offer
                                            </Button>
                                        ) : (
                                            <Button disabled={item.blocked} variant="outlined" sx={{ minWidth: 200 }} onClick={() => setOpenOffer(true)}>
                                                <MdLocalOffer />&nbsp; Make offer
                                            </Button>
                                        )
                                    }
                                    <Button className="mx-2" variant="contained" sx={{ minWidth: 200 }} onClick={handleBuy} disabled={pendingState || item.blocked}>
                                        <MdLocalOffer />&nbsp; Buy Now
                                    </Button>
                                </div>
                            )
                        }
                        <div className="mt-4">
                            <Panel
                                icon={<MdLocalOffer />}
                                title="Listings"
                                header={listingsHeader}
                                data={lists}
                                default={true}
                            />
                        </div>
                        <div className="mt-4">
                            <Panel
                                icon={<MdList />}
                                title="Offers"
                                header={offersHeader}
                                data={offerList}
                                default={true}
                            />
                        </div>
                    </div>
                    <div className="col-12 mt-3">
                        <Panel
                            icon={<MdLocalActivity />}
                            title="Item Activity"
                            header={activityHeader}
                            data={histories}
                            default={true}
                        />
                    </div>
                    <div className="col-12 mt-3">
                        <Panel
                            icon={<MdFlag />}
                            title="Report History"
                            header={reportHeader(setReportId, setOpenReason)}
                            data={reportHistory}
                            default={true}
                        />
                    </div>
                    {/* <div className="col-12 mt-2">
                        <div className="panel">
                            <div
                                className="p-3 cursor-pointer panel-title d-flex align-items-center justify-content-between"
                                style={show ? { borderBottom: '1px solid rgba(0,0,0,.125)' } : { borderBottom: 'none' }}
                                onClick={() => setShow(!show)}
                            >
                                <span className="d-flex align-items-center"><MdTableView />&nbsp;More From This Collection</span>
                                <span>
                                    {
                                        !show ? <MdKeyboardArrowDown /> : <MdKeyboardArrowUp />
                                    }
                                </span>
                            </div>
                        </div>
                    </div> */}
                </div>
            </section>

            <Footer />
            {
                openOffer && <MakeOffer
                    open={openOffer}
                    handleClose={() => setOpenOffer(false)}
                    handleSuccess={() => setOpenOffer(false) & getMarketInfo(item?.tokenId)}
                    tokenId={item?.tokenId}
                    account={account}
                    balance={tokenBalance}
                    allowance={tokenAllowance}
                />
            }
            {
                openReport && <ReportModal
                    open={openReport}
                    id={item.id}
                    account={account}
                    handleClose={() => setOpenReport(false)}
                />
            }
            {
                openReason && <ReasonModal
                    open={openReason}
                    reason={reportHistory.filter(report => report.id === report_id).length > 0 ? reportHistory.filter(report => report.id === report_id)[0].reason : ''}
                    handleClose={() => setOpenReason(false)}
                />
            }
        </div>
    );
}
export default Colection;