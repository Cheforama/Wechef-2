import React, { useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import SliderMainParticle from '../components/SliderMainParticle';
import FeatureBox from '../components/FeatureBox';
import ColumnNew from '../components/ColumnNew';
import AuthorList from '../components/authorList';
import Footer from '../components/footer';
import { getDashboardData } from '../../store/action/item';
import { GET_ITEMS } from '../../store/types';

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
    color: #fff;
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


const Homeone = () => {

  const dispatch = useDispatch();

  const { pending } = useSelector(state => state.collection);

  useEffect(() => {
    dispatch({
      type: GET_ITEMS,
      payload: []
    })
    dispatch(getDashboardData())
  }, [dispatch])

  useEffect(() => {
    if (pending) {
      document.getElementById('myHeader').style.display = 'none';
    } else {
      document.getElementById('myHeader').style.display = 'flex';
    }
  }, [pending])

  return (
    <div>
      {
        pending ? (
          <Box className='d-flex align-items-center justify-content-center' sx={{ width: '100vw', height: '100vh' }}>
            <CircularProgress />
          </Box>
        ) : (
          <div>
            <GlobalStyles />
            <section className="jumbotron no-bg"
              style={{ backgroundImage: `url(${'./img/background/wave.ccca1787.svg'})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}
            >
              <SliderMainParticle />
              <img
                src="img/background/cheforama-logo.png"
                className='anim-logo'
                alt=""
              />
            </section>

            <section className='container'>
              <div className='row'>
                <div className='col-lg-12'>
                  <div className='text-center'>
                    <h2>Popular Items</h2>
                    <div className="small-border"></div>
                  </div>
                </div>
              </div>
              <ColumnNew />
            </section>

            <section className='container-fluid bg-gray'>
              <div className='row'>
                <div className='col-lg-12'>
                  <div className='text-center'>
                    <h2>Top Sellers</h2>
                    <div className="small-border"></div>
                  </div>
                </div>
              </div>
              <div className='container'>
                <div className='col-lg-12'>
                  <AuthorList />
                </div>
              </div>
            </section>

            <section className='container-fluid'>
              <div className='row'>
                <div className='col-lg-12'>
                  <div className='text-center'>
                    <h2>Create and sell your NFTs</h2>
                    <div className="small-border"></div>
                  </div>
                </div>
              </div>
              <div className='container'>
                <FeatureBox />
              </div>
            </section>

            <Footer />
          </div>
        )
      }
    </div>
  )

};
export default Homeone;