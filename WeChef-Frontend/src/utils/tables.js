import { Button } from '@mui/material';
import { Link } from '@reach/router';
import moment from 'moment';
import { MdThumbDown, MdThumbUp, MdReadMore, MdEdit, MdCheck, MdClear, MdVisibility } from 'react-icons/md';
import Web3 from 'web3';
import { market_address } from '../contracts/contract';

export const listingsHeader = [
    {
        name: "Date",
        selector: row => "date",
        cell: d => <div className='d-flex align-items-center'>{moment(d.createdAt).format('MM.DD.YYYY HH:mm')}</div>
    },
    {
        name: "Price",
        selector: row => "price",
        cell: d => <div className='d-flex align-items-center'>{d.price} CHEF</div>
    },
    // {
    //     name: "From",
    //     selector: row => "from",
    //     cell: d => <div className='d-flex align-items-center'>{moment(d.from).format('MM.DD.YYYY HH:mm')}</div>
    // },
    // {
    //     name: "To",
    //     selector: row => "to",
    //     cell: d => <div className='d-flex align-items-center'>{moment(d.to).format('MM.DD.YYYY HH:mm')}</div>
    // },
    {
        name: "Reserved Address",
        selector: row => "reservedAddress",
        cell: d => <div className='d-flex align-items-center'>{d.reservedAddress.slice(0, 6)}...{d.reservedAddress.slice(d.reservedAddress.length - 4, d.reservedAddress.length)}</div>
    },
]

export const activityHeader = [
    {
        name: "Event",
        selector: row => "event",
        cell: d => <div className='d-flex align-items-center'>{d.event}</div>
    },
    {
        name: "Price",
        selector: row => "price",
        cell: d => <div className='d-flex align-items-center'>{d.price === 0 ? '' : d.price + ' CHEF'}</div>
    },
    {
        name: "From",
        selector: row => "from",
        cell: d => <div className='d-flex align-items-center'>{d.from.slice(0, 6)}...{d.from.slice(d.from.length - 4, d.from.length)}</div>
    },
    {
        name: "To",
        selector: row => "to",
        cell: d => <div className='d-flex align-items-center'>
            {d.event === 'List' ? `${market_address.slice(0, 6)}...${market_address.slice(market_address.length - 4, market_address.length)}` : `${d.to.slice(0, 6)}...${d.to.slice(d.to.length - 4, d.to.length)}`}
        </div>
    },
    {
        name: "Date",
        selector: row => "date",
        cell: d => <div className='d-flex align-items-center'>{moment(d.createdAt).format('MM.DD.YYYY HH:mm')}</div>
    },
]

export const offersHeader = [
    {
        name: "Buyer",
        selector: row => "buyer",
        cell: d => <div className='d-flex align-items-center'>{d.buyer.slice(0, 6)}...{d.buyer.slice(d.buyer.length - 4, d.buyer.length)}</div>
    },
    {
        name: "Expiration",
        selector: row => "expire",
        cell: d => <div className='d-flex align-items-center'>{moment(new Date(Number(d.expire)).toLocaleDateString("en-US")).format('MM.DD.YYYY')}</div>
        // cell: d => <div className='d-flex align-items-center'>{moment(new Date(d.expire)).format('MM.DD.YYYY HH:ii')}</div>
    },
    {
        name: "Price",
        selector: row => "price",
        cell: d => <div className='d-flex align-items-center'>{Web3.utils.fromWei(d.price.toString())} CHEF</div>
    },
    {
        name: "Action",
        cell: d => <>
            <Button color='success' sx={{ textTransform: 'none' }}><MdThumbUp /></Button>
            <Button color='secondary' sx={{ textTransform: 'none' }}><MdThumbDown /></Button>
        </>
    },
]

export const allActivityHeader = [
    {
        name: "Event",
        selector: row => "event",
        cell: d => <div className='d-flex align-items-center'>{d.event}</div>
    },
    {
        name: "Expiration",
        selector: row => "expire",
        cell: d => <div className='d-flex align-items-center'>{moment(new Date(Number(d.expire)).toLocaleDateString("en-US")).format('MM.DD.YYYY HH:mm')}</div>
        // cell: d => <div className='d-flex align-items-center'>{moment(new Date(d.expire)).format('MM.DD.YYYY HH:ii')}</div>
    },
    {
        name: "Price",
        selector: row => "price",
        cell: d => <div className='d-flex align-items-center'>{Web3.utils.fromWei(d.price.toString())} CHEF</div>
    },
    {
        name: "Action",
        cell: d => <>
            <Button color='success' sx={{ textTransform: 'none' }}><MdThumbUp /></Button>
            <Button color='secondary' sx={{ textTransform: 'none' }}><MdThumbDown /></Button>
        </>
    },
]

export const collectionsHeader = (router) => [
    {
        name: "ID",
        selector: row => "id",
        cell: d => <div className='d-flex align-items-center'>{d.id}</div>
    },
    {
        name: "Name",
        selector: row => "name",
        cell: d => <div className='d-flex align-items-center'>{d.name}</div>
    },
    {
        name: "Item Limit",
        selector: row => "total_items",
        cell: d => <div className='d-flex align-items-center'>{d.total_items}</div>
    },
    {
        name: "Owner Limit",
        selector: row => "total_owners",
        cell: d => <div className='d-flex align-items-center'>{d.total_owners}</div>
    },
    {
        name: "Floor Price",
        selector: row => "floor_price",
        cell: d => <div className='d-flex align-items-center'>{d.floor_price}</div>
    },
    {
        name: "Logo Image",
        selector: row => "logo_img",
        cell: d => <div className='d-flex align-items-center py-1'><img className='border-circle' src={`${process.env.REACT_APP_SERVER_URL}/upload/collection/${d.logo_img}`} height={50} alt="" /></div>
    },
    {
        name: "Banner Image",
        selector: row => "banner_img",
        cell: d => <div className='d-flex align-items-center py-1'><img src={`${process.env.REACT_APP_SERVER_URL}/upload/collection/${d.banner_img}`} height={50} alt="" /></div>
    },
    {
        name: "Actions",
        cell: d => <>
            <Button color='success' sx={{ textTransform: 'none', fontSize: '24px' }} onClick={() => router('/collection/' + d.id)}><MdReadMore /></Button>
            <Button color='secondary' sx={{ textTransform: 'none' }} onClick={() => router('/create-collection/' + d.id)}><MdEdit /></Button>
        </>
    },
]

export const itemsHeader = (router) => [
    {
        name: "Item",
        selector: row => "tokenId",
        cell: d => <div className='d-flex align-items-center py-1'>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={`${process.env.REACT_APP_SERVER_URL}/upload/item/${d?.preview_img}`} height={50} alt="" />&nbsp;&nbsp;
                <div>
                    <span style={{ color: 'gray' }}>{d?.collection_name}</span>
                    <br />
                    <span>{d?.name}&nbsp;#{d.tokenId}</span>
                </div>
            </div>
        </div>
    },
    {
        name: "Listed Info",
        selector: row => "listed_date",
        cell: d => <div className='d-flex align-items-center'>
            {d.listed_price !== 0 && (
                <div>
                    <div>
                        <img src="/img/icons/coin.png" alt="" width="20px" />&nbsp;<span>{d.listed_price}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'gray' }}>
                        {moment(d.listed_date).format('MM.DD.YYYY HH:mm')}
                    </div>
                </div>
            )}
        </div>
    },
    {
        name: "Last Sold Info",
        selector: row => "latest_sold_date",
        cell: d => <div className='d-flex align-items-center'>
            {d.latest_sold_price !== 0 && (
                <div>
                    <div className='d-flex align-items-center'>
                        <img src="/img/icons/coin.png" alt="" width="20px" />&nbsp;<span>{d.latest_sold_price}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'gray' }}>
                        {moment(d.latest_sold_date).format('MM.DD.YYYY HH:mm')}
                    </div>
                </div>
            )}
        </div>
    },
    {
        name: "Status",
        selector: row => "blocked",
        cell: d => <div className='d-flex align-items-center'>
            {d.blocked ? <MdClear title='blocked' style={{ color: '#d32f2f', fontSize: '26px' }} /> : <MdCheck title='allowed' style={{ color: '#2e7d32', fontSize: '26px' }} />}
        </div>
    },
    {
        name: "Created Date",
        selector: row => "total_items",
        cell: d => <div className='d-flex align-items-center'>{moment(d.createdAt).format('MM.DD.YYYY HH:mm')}</div>
    },
    {
        name: "Actions",
        cell: d => <>
            <Button color='success' sx={{ textTransform: 'none', fontSize: '24px' }} onClick={() => router('/item/' + d.id)} disabled={d.blocked}><MdReadMore /></Button>
        </>
    },
];

export const reportHeader = (setReportId, setOpenReason) => [
    {
        name: "Report User",
        selector: row => "report_user",
        cell: d => <div className='d-flex align-items-center'>
            <Link to={`/items/${d.user.wallet}`}>{d.user.username}</Link>
        </div>
    },
    {
        name: "Reason",
        selector: row => "reason",
        cell: d => <div className='d-flex align-items-center justify-content-between'>
            <span>{d.reason.length > 20 ? `${d.reason.slice(0, 20)}...` : d.reason.slice(0, 20)}</span>
            <Button variant="text" onClick={() => setReportId(d.id) & setOpenReason(true)}>
                <MdVisibility />
            </Button>
        </div>
    },
    {
        name: "Reason",
        selector: row => "reason",
        cell: d => <div className='d-flex align-items-center'>{moment(d.createdAt).format('MM.DD.YYYY HH:mm')}</div>
    },
]