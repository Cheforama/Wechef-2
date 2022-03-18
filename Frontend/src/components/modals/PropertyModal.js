import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";

const PropertyModal = (props) => {

    const [count, setCount] = useState(1);
    const [property, setProperty] = useState([{ trait_type: '', value: '' }])

    useEffect(() => {
        if (props.data.length > 0) {
            setProperty(props.data);
            setCount(props.data.length);
        } else {
            setProperty([{ trait_type: '', value: '' }]);
        }
    }, [])

    const handleChangeKey = (e, i) => {
        setProperty(prev => prev.map((item, index) => index !== i ? item : { ...property[index], trait_type: e.target.value }))
    }

    const handleChangeName = (e, i) => {
        setProperty(prev => prev.map((item, index) => index !== i ? item : { ...property[index], value: e.target.value }))
    }

    const handleRemoveRow = (i) => {
        if (count > 1) {
            setProperty(prev => prev.filter((item, index) => index !== i))
            setCount((prev) => prev - 1)
        }
    }

    const handleAdd = () => {
        setCount((prev) => prev + 1);
        setProperty(prev => prev.concat({ trait_type: '', value: '' }))
    }

    const handleSave = () => {
        console.log(property)
        if (property.length === 1 && property[0].trait_type === '' && property[0].value === '') {
            props.saveProperties([]);
        } else {
            props.saveProperties(property);
        }
        props.handleClose();
    }

    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header>
                <Modal.Title>Add Properties</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                <p className="text-center">Properties show up underneath your item, are clickable, and can be filtered in your collection's sidebar.</p>
                <div className="row">
                    <div className="col-6 font-bold">Type</div>
                    <div className="col-6 font-bold">Name</div>
                </div>
                {
                    [...Array(count).keys()].map((item, index) => (
                        <div className="row mx-0 my-1" key={index}>
                            <div className="col-6 px-0">
                                <input type="text" value={property[index].trait_type} className="form-control mb-0" onChange={(e) => handleChangeKey(e, index)} style={{ borderRadius: '0.25rem 0 0 0.25rem' }} />
                            </div>
                            <div className="col-5 px-0">
                                <input type="text" value={property[index].value} className="form-control mb-0" onChange={(e) => handleChangeName(e, index)} style={{ borderRadius: '0' }} />
                            </div>
                            <div className="col-1 px-0">
                                <Button variant="outline-secondary" onClick={() => handleRemoveRow(index)} style={{ height: '100%', borderRadius: '0 0.25rem 0.25rem 0', border: '1px solid #cccccc' }}>
                                    <i className="fa fa-trash"></i>
                                </Button>
                            </div>
                        </div>
                    ))
                }
                <Button variant="secondary" onClick={handleAdd}>Add more</Button>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default PropertyModal;