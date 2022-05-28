import { useNavigate } from "@reach/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
`;

const PopularItemCard = ({ item }) => {

    const router = useNavigate();

    const [height, setHeight] = useState(0);
    const [metadata, setMetadata] = useState({});

    useEffect(() => {
        const getMetadata = async () => {
            try {
                const res = await fetch(`https://ipfs.io/ipfs/${item.asset}`, { method: 'GET' })
                const json = await res.json()
                setMetadata(json);
            } catch (err) {
                console.log(err)
            }
        }
        if (item.hasOwnProperty('asset') && item?.asset_filetype.indexOf('image') > -1) {
            getMetadata()
        }
    }, [item])

    const onImgLoad = ({ target: img }) => {
        let currentHeight = height;
        if (currentHeight < img.offsetHeight) {
            setHeight(img.offsetHeight)
        }
    }

    return (
        <div className="nft__item m-0">
            <div className="d-flex align-items-center">
                <div className="author_list_pp">
                    {
                        item.hasOwnProperty('profile_img') ? item.profile_img !== "" ? (
                            <img
                                src={`${process.env.REACT_APP_SERVER_URL}/file/profile/${item.profile_img}`}
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
                <div className="mx-3">
                    <span>{item.owner_name}</span>
                    {/* <br />
                    <span>{item.wallet.slice(0, 6)}...{item.wallet.slice(item.wallet.length - 6, item.wallet.length)}</span> */}
                </div>
            </div>
            <div className="nft__item_wrap" style={{ height: `${height}px` }}>
                <Outer className="w-100" style={{ border: '1px solid rgba(0,0,0,.125)', borderRadius: 8, overflow: 'hidden' }}>
                    {
                        item?.asset_filetype.indexOf('image') > -1 ? (
                            <img onLoad={onImgLoad} src={metadata?.image} className="lazy nft__item_preview" alt="" width="100%" />
                        ) : (
                            <img onLoad={onImgLoad} src={`${process.env.REACT_APP_SERVER_URL}/upload/item/${item.preview_img}`} className="lazy nft__item_preview" alt="" />
                        )
                    }
                </Outer>
            </div>
            <div className="nft__item_info">
                <h4 className="d-flex align-items-center justify-content-between">
                    <span>{item.name} #{item.tokenId}</span>
                    {
                        item.latest_sold_price !== 0 && (
                            <span className="d-flex align-items-center color-gray" style={{ fontSize: '12px' }}>
                                Last:&nbsp;
                                <img src="/img/icons/coin.png" alt="" width="20px" />&nbsp;
                                <span>{item.latest_sold_price}</span>
                            </span>
                        )
                    }
                </h4>
                <div className="d-flex align-items-center justify-content-between">
                    <div className="nft__item_action">
                        <span onClick={() => router(`/item/${item.id}`)}>View more</span>
                    </div>
                    {
                        item.listed_price !== 0 && (
                            <div className="d-flex align-items-center" style={{ fontSize: '12px' }}>
                                Price:&nbsp;
                                <img src="/img/icons/coin.png" alt="" width="20px" />&nbsp;
                                <span>{item.listed_price}</span>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default PopularItemCard