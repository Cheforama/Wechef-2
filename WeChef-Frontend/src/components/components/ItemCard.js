import { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { MdLink, MdModeEdit, MdSettings } from 'react-icons/md'

const ItemCard = ({ data }) => {

    const [metadata, setMetadata] = useState({});

    useEffect(() => {
        const getMetadata = async () => {
            try {
                const res = await fetch(`https://ipfs.io/ipfs/${data.asset}`, { method: 'GET' })
                const json = await res.json()
                setMetadata(json);
            } catch (err) {
                console.log(err)
            }
        }
        if (data.hasOwnProperty('asset')) {
            getMetadata()
        }
    }, [data])

    const handleCopyLink = () => {
        navigator.clipboard.writeText(data.externalLink)
    }

    return (
        <div className="item-card">
            {
                data.asset_filetype.indexOf('video') > -1 ? (
                    <img src={`${process.env.REACT_APP_SERVER_URL}/upload/item/${data.preview_img}`} alt="" width="100%" height='250' />
                ) : (
                    <img src={metadata?.image} alt="" width="100%" height='250' />
                )
            }
            <div className='p-2' style={{ borderTop: '1px solid #ddd' }}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <span>{data.collection_name}</span>
                    <Dropdown>
                        <Dropdown.Toggle variant="link" id="dropdown-basic" className='color-gray btn-icon' title="More Options">
                            <MdSettings size={20} />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={handleCopyLink}>
                                <MdLink />&nbsp;Copy Link
                            </Dropdown.Item>
                            <Dropdown.Item href="#/action-2">
                                <MdModeEdit />&nbsp;Edit
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <span>{data.name}</span>
                </div>
            </div>
        </div>
    )
}

export default ItemCard;