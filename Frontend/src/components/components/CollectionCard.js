import { useNavigate } from "@reach/router";
import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { MdEdit, MdList, MdMoreVert } from 'react-icons/md';

const CollectionCard = ({ data, editable = false }) => {

    const router = useNavigate();
    const [hover, setHover] = useState(false);

    return (
        <div className='collection-card position-relative' onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <Dropdown className={`position-absolute ${editable && hover ? 'd-block' : 'd-none'}`} style={{ top: 20, right: 20 }} onClick={(e) => e.stopPropagation()}>
                <Dropdown.Toggle id="dropdown-button-dark-example1" variant="secondary">
                    <MdMoreVert />
                </Dropdown.Toggle>

                <Dropdown.Menu variant="dark">
                    <Dropdown.Item onClick={() => router(`create-collection/${data.id}`)}>
                        <MdEdit /> &nbsp; Edit
                    </Dropdown.Item>
                    <Dropdown.Item><MdList /> &nbsp; Creator Earnings</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <img src={`${process.env.REACT_APP_SERVER_URL}/upload/collection/${data.banner_img}`} width="100%" alt='' className='collection-card-banner' />
            <div className='position-relative'>
                <img src={`${process.env.REACT_APP_SERVER_URL}/upload/collection/${data.logo_img}`} width={50} height={50} alt='' className='border-circle collection-card-logo' />
            </div>
            <p className='text-center mb-1' style={{ marginTop: 35 }}>{data.name}</p>
            <p className='text-center mb-1'>by <span className='color-green font-bold'>
                {data.user.username === 'unnamed' ? `${data.user.wallet.slice(0, 6)}...${data.user.wallet.slice(data.user.wallet.length - 4, data.user.wallet.length)}` : data.user.username}</span>
            </p>
            {/* <p className='text-center mb-1 px-3'><span className='font-bold'>Total Items:</span> {data.total_items}</p>
            <p className='text-center mb-1 px-3'><span className='font-bold'>Number of Owners:</span> {data.total_owners}</p>
            <p className='text-center mb-1 px-3'><span className='font-bold'>Floor Price:</span> {data.floor_price}</p> */}
            <p className='text-center px-3 collection-card-description'>
                {data.description}
            </p>
        </div>
    )
}

export default CollectionCard;