import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from '@reach/router';
import { createGlobalStyle } from 'styled-components';
import { toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';
import axios from 'axios';
import Footer from '../../components/footer';
import { getCollectionDetail, uploadCollection } from '../../../store/action/collection';
import { GET_COLLECTION } from '../../../store/types';

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

// const extList = ['png', 'gif', 'webp', 'mp4', 'mp3'];

const CreateCollection = () => {

    const router = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const imageRef = useRef();
    const bannerRef = useRef();

    const { pending, success, collection } = useSelector(state => state.collection);
    const { connected, account, profile } = useSelector(state => state.wallet);

    const [collectionName, setCollectionName] = useState('')
    const [totalCount, setTotalCount] = useState('')
    const [totalOwner, setTotalOwner] = useState('')
    const [floorPrice, setFloorPrice] = useState('')
    const [description, setDescription] = useState('')
    const [id, setId] = useState(-1);
    const [logoImage, setLogoImage] = useState(null);
    const [bannerImage, setBannerImage] = useState(null);
    const [selected, setSelected] = useState(false)
    const [bannerSelected, setBannerSelected] = useState(false)

    useEffect(() => {
        if (success) {
            // initValues();
        }
    }, [success])

    useEffect(() => {
        if (params.hasOwnProperty('id') && params.id !== 'new' && Object.keys(profile).length > 0) {
            dispatch(getCollectionDetail(params.id))
        }
        if (params.id === 'new') {
            dispatch({
                type: GET_COLLECTION,
                payload: {}
            })
        }
    }, [dispatch, profile])

    useEffect(() => {
        if (Object.keys(collection).length > 0 && params.id !== 'new') {
            setId(collection.id);
            setCollectionName(collection.name);
            setTotalCount(collection.total_items);
            setTotalOwner(collection.total_owners);
            setFloorPrice(collection.floor_price);
            setDescription(collection.description);
        }
    }, [collection]);

    const initValues = () => {
        setCollectionName('');
        setTotalCount('');
        setTotalOwner("");
        setFloorPrice('');
        setDescription('');
        setId(-1);
        setBannerImage(null);
        setBannerSelected(false);
        setSelected(false);
    }

    const handleSubmit = async () => {
        if (!connected) {
            toast.warning("Please connect with metamask");
            return;
        }
        if (collectionName === "") {
            toast.warning("Please input collection name.")
            return;
        }
        if (totalCount === 0 || totalCount === "") {
            toast.warning("Please input total items");
            return;
        }
        if (totalOwner === 0 || totalOwner === "") {
            toast.warning("Please input number of owners");
            return;
        }
        if (floorPrice === 0 || floorPrice === '') {
            toast.warning("Please input floor price");
            return;
        }
        try {
            // const res = await axios.post(process.env.REACT_APP_ENDPOINT + '/collection/checkstate', { account: account });
            // if (res.data) {
            const formData = new FormData();
            formData.append("name", collectionName);
            formData.append("creator", profile.id);
            formData.append("total_items", totalCount);
            formData.append("total_owners", totalOwner);
            formData.append("floor_price", floorPrice);
            formData.append("description", description);
            formData.append("logo_image", logoImage);
            formData.append("banner_image", bannerImage);
            formData.append("collection_id", id);
            dispatch(uploadCollection(formData, router));
            // } else {
            //     toast.error("You are not allowed to create collections");
            //     return;
            // }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='position-relative'>

            {
                pending && (
                    <div className='pending-wrapper position-absolute'>
                        <div className='position-relative' style={{ height: '100%' }}>
                            <div className='mask'></div>
                            <div className='pending text-center d-flex flex-direction-column'>
                                <Spinner animation="border" variant="primary" className='my-2' />
                                Please wait...
                            </div>
                        </div>
                    </div>
                )
            }

            <GlobalStyles />

            <section className='jumbotron breadcumb no-bg' style={{ backgroundImage: `url(${'/img/background/wave.ccca1787.svg'})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
                <div className='mainbreadcumb'>
                    <div className='container'>
                        <div className='row'>
                            <div className="col-md-12 text-center">
                                <h1>Create Collection</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='container'>
                <div className="row">

                    <div className="col-md-8 offset-md-2">

                        <div className="spacer-10"></div>

                        <div className="row">
                            <div className='col-md-12 my-2'>
                                <div className="field-set">
                                    <label>Collection name: <span className='color-red'>*</span></label>
                                    <input type='text' value={collectionName} className="form-control" onChange={(e) => setCollectionName(e.target.value)} />
                                </div>
                                <div className="field-set">
                                    <label>Creator username: <span className='color-red'>*</span></label>
                                    <input type='text' value={Object(profile).hasOwnProperty('username') ? profile.username : ''} disabled className="form-control" />
                                </div>
                                <div className="field-set">
                                    <label>Total Items:</label>
                                    <input type='number' value={totalCount} className="form-control" onChange={(e) => setTotalCount(e.target.value)} />
                                </div>
                                <div className="field-set">
                                    <label>Number of owners</label>
                                    <input type='number' value={totalOwner} className="form-control" onChange={(e) => setTotalOwner(e.target.value)} />
                                </div>
                                <div className="field-set">
                                    <label>Floor Price (CHEF):</label>
                                    <input type='number' value={floorPrice} className="form-control" onChange={(e) => setFloorPrice(e.target.value)} />
                                </div>
                                <div className="field-set">
                                    <label>Description:</label>
                                    <textarea rows={3} onChange={(e) => setDescription(e.target.value)} value={description} className="form-control"></textarea>
                                </div>
                            </div>
                            <div className='col-12 my-2'>
                                <p className='mb-1 font-bold'>Logo Image <span className='color-red'>*</span></p>
                                <p style={{ fontSize: 12 }}>This image will also be used for navigation. 350 x 350 recommended.</p>
                                <div className='border-circle collection-logo d-flex align-items-center justify-content-center'>
                                    {
                                        selected ? (
                                            <div className='position-relative d-flex justify-content-center align-items-center' style={{ height: '100%' }}>
                                                <img src={URL.createObjectURL(logoImage)} alt="" width="100%" height="100%" className='border-circle profile-preview' />
                                                <i className='fa fa-trash position-absolute' onClick={(e) => setLogoImage(null) & setSelected(false)} style={{ color: 'rgb(111, 25, 192)' }}></i>
                                            </div>
                                        ) : (
                                            <div className='position-relative d-flex justify-content-center align-items-center' style={{ height: '100%' }}>
                                                {
                                                    collection.hasOwnProperty('logo_img') && (
                                                        <img src={`${process.env.REACT_APP_SERVER_URL}/upload/collection/${collection.logo_img}`} alt="" width="100%" height="100%" className='border-circle profile-preview' />
                                                    )
                                                }
                                                <i className='fa fa-pencil position-absolute' onClick={(e) => imageRef.current.click()}></i>
                                            </div>
                                        )
                                    }
                                </div>

                                <input ref={imageRef} type="file" className='d-none' onChange={(e) => setLogoImage(e.target.files[0]) & setSelected(true)} accept=".png,.jpg" />

                            </div>
                            <div className='col-12 my-2'>
                                <p className='mb-1 font-bold'> Banner Image <span className='color-red'>*</span></p>
                                <p style={{ fontSize: 12 }}> This image will be used for featuring your collection on the homepage, category pages, or other promotional areas of OpenSea. 600 x 400 recommended.</p>
                                <div className='collection-banner d-flex align-items-center justify-content-center'>
                                    {
                                        bannerSelected ? (
                                            <div className='position-relative d-flex justify-content-center align-items-center' style={{ width: '100%', height: '100%' }}>
                                                <img src={URL.createObjectURL(bannerImage)} alt="" width="100%" height="100%" className='profile-preview' />
                                                <i className='fa fa-trash position-absolute' onClick={(e) => setBannerImage(null) & setBannerSelected(false)} style={{ color: 'rgb(111, 25, 192)' }}></i>
                                            </div>
                                        ) : (
                                            <div className='position-relative d-flex justify-content-center align-items-center' style={{ width: '100%', height: '100%' }}>
                                                {
                                                    collection.hasOwnProperty('banner_img') && (
                                                        <img src={`${process.env.REACT_APP_SERVER_URL}/upload/collection/${collection.banner_img}`} alt="" width="100%" height="100%" className='profile-preview' />
                                                    )
                                                }
                                                <i className='fa fa-pencil position-absolute' onClick={(e) => bannerRef.current.click()}></i>
                                            </div>
                                        )
                                    }
                                </div>
                                <input ref={bannerRef} type="file" className='d-none' onChange={(e) => setBannerImage(e.target.files[0]) & setBannerSelected(true)} accept=".png,.jpg" />
                            </div>
                            <div className="col-md-12">
                                <div id='submit' className="pull-left">
                                    <input type='button' value='Create' className="btn btn-main color-2" onClick={handleSubmit} />
                                </div>
                                <div className="clearfix"></div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            <Footer />
        </div>

    )
}
export default CreateCollection;