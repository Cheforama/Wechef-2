import { useNavigate, useParams } from "@reach/router";
import { useEffect, useState } from "react";
import { Button, ButtonGroup, Form, FormControl, InputGroup } from "react-bootstrap";
import { MdAdd, MdApps, MdEdit, MdSearch } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { createGlobalStyle } from 'styled-components';
import { getCollectionDetail } from "../../../store/action/collection";
import { getItems } from "../../../store/action/item";
import ItemCard from "../../components/ItemCard";

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.sticky.white {
    background: #403f83;
    border-bottom: solid 1px #403f83;
  }
  header#myHeader.navbar .search #quick_search{
    color: #fff;
    background: rgba(255, 255, 255, .1);
  }
  header#myHeader.navbar.white .btn, .navbar.white a, .navbar.sticky.white a{
    color: #fff;
  }
  header#myHeader .dropdown-toggle::after{
    color: rgba(255, 255, 255, .5);
  }
  header#myHeader .logo .d-block{
    display: none !important;
  }
  header#myHeader .logo .d-none{
    display: block !important;
  }
  @media only screen and (max-width: 1199px) {
    .navbar{
      background: #403f83;
    }
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #fff;
    }
    .item-dropdown .dropdown a{
      color: #fff !important;
    }
  }
`;

const ItemList = () => {

    const params = useParams();
    const dispatch = useDispatch();
    const router = useNavigate();

    const { profile } = useSelector(state => state.wallet);
    const { collection } = useSelector(state => state.collection);
    const { items } = useSelector(state => state.item);

    const [searchKey, setSearchKey] = useState('')

    useEffect(() => {
        if (params.hasOwnProperty('id') && Object.keys(profile).length > 0) {
            dispatch(getCollectionDetail(params.id));
            dispatch(getItems(params.id));
        }
    }, [dispatch, profile])

    return (
        <div className="position-relative">
            <GlobalStyles />

            <section className='jumbotron breadcumb no-bg' style={{ backgroundImage: `url(${'/img/background/wave.ccca1787.svg'})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', height: '85px' }}>
            </section>

            <div className="page-content my-4">
                <div className="d-flex justify-content-end px-4">
                    <ButtonGroup aria-label="Basic example">
                        <Button variant="secondary" title="Edit Item" onClick={() => router(`/create-collection/${collection?.id}`)}> <MdEdit /> </Button>
                        <Button variant="secondary" title="Creator Earnings"> <MdApps /> </Button>
                        <Button variant="secondary" title="Add Item"> <MdAdd /> </Button>
                    </ButtonGroup>
                </div>
                {
                    Object.keys(collection).length > 0 && (
                        <div className="my-3">
                            <img style={{ borderTop: '1px solid #ddd', borderBottom: '1px solid #ddd' }} src={`${process.env.REACT_APP_SERVER_URL}/upload/collection/${collection.banner_img}`} width="100%" height="250px" alt="" />
                            <div className='position-relative'>
                                <img src={`${process.env.REACT_APP_SERVER_URL}/upload/collection/${collection.logo_img}`} width="100px" height="100px" alt='' className='border-circle d-block' style={{ zIndex: 2, margin: '-50px auto', border: '1px solid #ddd', backgroundColor: '#ebebeb' }} />
                            </div>
                            <h2 className=" text-center" style={{ marginTop: 70 }}>
                                {collection.name}
                            </h2>
                            <div className="d-flex justify-content-center">
                                <div className="collection-detail">
                                    <div className="p-2 float-left" style={{ width: 120 }}>
                                        <p className="text-center mb-1">{items.length}</p>
                                        <p className="text-center mb-1">items</p>
                                    </div>
                                    <div className="p-2 float-left" style={{ width: 120, borderLeft: '1px solid #ddd', borderRight: '1px solid #ddd' }}>
                                        <p className="text-center mb-1">0</p>
                                        <p className="text-center mb-1">owners</p>
                                    </div>
                                    <div className="p-2 float-left" style={{ width: 120 }}>
                                        <p className="text-center mb-1">0</p>
                                        <p className="text-center mb-1">floor price</p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-center mt-4">Welcome to the home of {collection.name}. Discover the best items in this collection.</p>
                        </div>
                    )
                }
                <div className="container mt-4 py-4">
                    <div className="row">
                        <div className="col-md-4 col-12">
                            <InputGroup>
                                <InputGroup.Text id="basic-addon1"><MdSearch /></InputGroup.Text>
                                <FormControl
                                    placeholder="Search..."
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    className="mb-0"
                                    onChange={(e) => setSearchKey(e.target.value)}
                                    value={searchKey}
                                />
                            </InputGroup>
                        </div>
                        <div className="col-md-3 col-12">
                            <Form.Select style={{ height: '100%' }}>
                                <option>Recently Listed</option>
                                <option>Recently Created</option>
                                <option>Recently Sold</option>
                                <option>Recently Received</option>
                                <option>Endgin soon</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>Highest Last Sale</option>
                                <option>Most Viewed</option>
                                <option>Most Favorited</option>
                                <option>Oldest</option>
                            </Form.Select>
                        </div>
                        <div className="col-md-3 col-12">
                            <Form.Select style={{ height: '100%' }}>
                                <option>All Items</option>
                                <option>Single Items</option>
                                <option>Bundles</option>
                            </Form.Select>
                        </div>
                    </div>
                    <div className="row mt-4 py-4">
                        {
                            items.length > 0 && items
                                .filter(data => String(data.name).toLowerCase().indexOf(searchKey.toLowerCase()) > -1)
                                .map((item, index) => (
                                    <div className="col-lg-3 col-md-4 col-6" key={index}>
                                        <div className="m-2 cursor-pointer">
                                            <ItemCard data={item} />
                                        </div>
                                    </div>
                                ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ItemList;