import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import { toast } from 'react-toastify';
import { MdCollections, MdGridView } from 'react-icons/md'
import { saveProfile } from '../../store/action/user';
import { getMyCollections } from '../../store/action/collection';
import Panel from '../components/Panel';
import { collectionsHeader, itemsHeader } from '../../utils/tables';
import { useNavigate } from '@reach/router';
import { getMyItems } from '../../store/action/item';

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

const Profile = () => {

  const router = useNavigate();
  const dispatch = useDispatch();
  const imageRef = useRef();

  const { account, connected, profile } = useSelector(state => state.wallet);
  const { pending, collections } = useSelector(state => state.collection);
  const { items } = useSelector(state => state.item);

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [selected, setSelected] = useState(false)
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (Object.keys(profile).length > 0) {
      setUsername(profile.username)
      setEmail(profile.email)
    }
  }, [profile])

  useEffect(() => {
    if (connected) {
      dispatch(getMyCollections());
      dispatch(getMyItems(0, 5, account))
    }
  }, [connected, account])

  const handleSubmit = () => {
    if (!connected) {
      toast.warning("Please connect with metamask");
      return;
    }
    if (username === "") {
      toast.warning("Please input username.")
      return;
    }
    if (email === "") {
      toast.warning("Please input email address");
      return;
    }
    if (account === "") {
      toast.warning("Please connect with metamask");
      return;
    }
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("address", account);
    formData.append("image", avatar)
    dispatch(saveProfile(formData))
  }

  return (
    <div>
      <GlobalStyles />

      <section className='jumbotron breadcumb no-bg' style={{ backgroundImage: `url(${'./img/background/wave.ccca1787.svg'})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
        <div className='mainbreadcumb'>
          <div className='container'>
            <div className='row'>
              <div className="col-md-12 text-center">
                <h1>Profile Setting</h1>
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

              <div className='col-md-6'>
                <div className="field-set">
                  <label>Username:</label>
                  <input type='text' name='username' value={username} className="form-control" onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="field-set">
                  <label>Email Address:</label>
                  <input type='text' name='email' value={email} className="form-control" onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="field-set">
                  <label>Wallet Address:</label>
                  <input type='text' name='address' value={connected ? account : ''} className="form-control" disabled />
                </div>

              </div>

              <div className='col-md-6'>
                <div className="field-set d-flex flex-direction-column align-items-center mb-3">
                  <label>Profile Image:</label>
                  <div
                    className='border-circle profile-image d-flex align-items-center justify-content-center'
                    style={!selected ? { backgroundColor: 'rgb(111, 25, 192)' } : { backgroundColor: '#c5c3c3' }}
                  >
                    {
                      selected ? (
                        <div className='position-relative d-flex justify-content-center align-items-center' style={{ height: '100%' }}>
                          <img src={URL.createObjectURL(avatar)} alt="" width="100%" height="100%" className='border-circle profile-preview' />
                          <i className='fa fa-trash position-absolute' onClick={(e) => setAvatar(null) & setSelected(false)} style={{ color: 'rgb(111, 25, 192)' }}></i>
                        </div>
                      ) : Object(profile).hasOwnProperty('profile_img') ? profile.profile_img !== "" ? (
                        <div className='position-relative d-flex justify-content-center align-items-center' style={{ height: '100%' }}>
                          <img src={`${process.env.REACT_APP_SERVER_URL}/file/profile/${profile.profile_img}`} alt="" width="150px" height="150px" className='border-circle profile-preview' />
                          <i className='fa fa-pencil position-absolute color-red' onClick={(e) => imageRef.current.click()}></i>
                        </div>
                      ) : (
                        <i className='fa fa-pencil' onClick={(e) => imageRef.current.click()}></i>
                      ) : (
                        <i className='fa fa-pencil' onClick={(e) => imageRef.current.click()}></i>
                      )
                    }
                  </div>
                  <input ref={imageRef} type="file" className='d-none' onChange={(e) => setAvatar(e.target.files[0]) & setSelected(true)} accept=".png,.jpg" />
                </div>
              </div>

              <div className="col-md-12">
                <div id='submit' className="pull-left d-flex">
                  <input
                    type='button'
                    value='Register Now'
                    className="btn btn-main color-2"
                    onClick={handleSubmit}
                    disabled={pending === true}
                  />
                  {/* {
                    pending && (
                      <div className='mx-4 d-flex align-items-center'>
                        <Spinner animation="border" variant="primary" /> &nbsp; &nbsp; Saving profile...
                      </div>
                    )
                  } */}
                </div>

                <div className="clearfix"></div>
              </div>

            </div>
          </div>

          <div className='col-12 mt-4'>
            <Panel
              icon={<MdCollections />}
              title="My Collections"
              default={true}
              header={collectionsHeader(router)}
              data={collections}
              isViewAll={true}
              link="/my-collections"
            />
          </div>

          <div className='col-12 mt-4'>
            <Panel
              icon={<MdGridView />}
              title="My Items"
              default={true}
              header={itemsHeader(router)}
              data={items}
              isViewAll={true}
              link={`/items/${account}`}
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>

  )
}
export default Profile;