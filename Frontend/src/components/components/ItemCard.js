const ItemCard = ({ data }) => {
    return (
        <div className="item-card">
            <img src={`${process.env.REACT_APP_SERVER_URL}/upload/item/${data.preview_img}`} alt="" width="100%" height='250' />
            <div className='p-2' style={{ borderTop: '1px solid #ddd' }}>
                <p className="d-flex justify-content-between align-items-center mb-1">
                    <span>{data.collection.name}</span>
                </p>
                <p className="d-flex justify-content-between align-items-center mb-1">
                    <span>{data.name}</span>
                </p>
            </div>
        </div>
    )
}

export default ItemCard;