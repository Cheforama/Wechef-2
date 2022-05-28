import { useNavigate } from '@reach/router';
import React from 'react';
import { useSelector } from 'react-redux';

const Authorlist = () => {

    const router = useNavigate();
    const { top_sellers } = useSelector(state => state.item);

    return (
        <div className='row'>
            {
                top_sellers.length > 0 ? top_sellers.map((seller, index) => (
                    <div className='col-md-4 col-6' key={index}>
                        <div
                            className='d-flex align-items-center justify-content-between p-2 cursor-pointer seller-card'
                            style={{ border: '1px solid rgba(0,0,0,0.125)', borderRadius: 10 }}
                            onClick={() => router(`/items/${seller.wallet}`)}
                        >
                            <div className='d-flex align-items-center px-2' style={{ fontSize: 20 }}>{index + 1}</div>
                            <div className='position-relative'>
                                <div className="author_list_pp" onClick={() => window.open("", "_self")}>
                                    {
                                        seller.hasOwnProperty('profile_img') ? seller.profile_img !== "" ? (
                                            <img
                                                src={`${process.env.REACT_APP_SERVER_URL}/file/profile/${seller.profile_img}`}
                                                onError={({ currentTarget }) => {
                                                    currentTarget.onerror = null; // prevents looping
                                                    currentTarget.src = "/img/no-avatar.png";
                                                }}
                                                className="lazy"
                                                width={30}
                                                alt=""
                                            />
                                        ) : (
                                            <img src="/img/no-avatar.png" className="border-circle" width={30} alt="" />
                                        ) : <></>
                                    }
                                    <i className="fa fa-check"></i>
                                </div>
                            </div>
                            <div className='px-1'></div>
                            <div className="author_list_info w-100">
                                <p className='mb-1 d-flex align-items-center justify-content-between'>
                                    <span>{seller.username}</span>
                                    <span>{seller.wallet.slice(0, 6)}...{seller.wallet.slice(seller.wallet.length - 6, seller.wallet.length)}</span>
                                </p>
                                <p className="mb-1 bot d-flex align-items-center justify-content-between">
                                    <span>Floor price: <img src="/img/icons/coin.png" alt='' width={20} /> {seller.floor_price}</span>
                                    <span><img src="/img/icons/coin.png" alt='' width={20} /> {seller.total_money}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                )) : <div className='col-12 text-center'>No data</div>
            }
        </div>
    )
};
export default Authorlist;