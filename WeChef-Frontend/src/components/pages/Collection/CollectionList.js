import React, { useEffect } from 'react';
import { Link } from '@reach/router';
import { useDispatch, useSelector } from 'react-redux';
import Footer from '../../components/footer';
import { createGlobalStyle } from 'styled-components';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { getCollectionList } from '../../../store/action/collection';
import CollectionCard from '../../components/CollectionCard';

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

const CollectionList = () => {

  const dispatch = useDispatch();

  const { collections, pending } = useSelector(state => state.collection);

  useEffect(() => {
    dispatch(getCollectionList())
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

            <section className='jumbotron breadcumb no-bg' style={{ backgroundImage: `url(${'./img/collections/coll-5.jpg'})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
              <div className='mainbreadcumb'>
                <div className='container'>
                  <div className='row'>
                    <div className="col-md-12 text-center">
                      <h1>Collections</h1>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className='container'>
              <p className='text-center'>The way we value internet-native items is changing with the development of blockchain technology.
                Kittens, punks, and memes are now trading digital wallets for cryptocurrencies, and the online collectibles market is taking shape before our eyes.
              </p>
              <div className="row my-4">
                {
                  collections.length > 0 ? collections.map((item, index) => (
                    <div className='col-md-4 col-lg-3 col-12 p-2' key={index}>
                      <Link to={`/collection/${item.id}`}>
                        <CollectionCard data={item} />
                      </Link>
                    </div>
                  )) : (
                    <div className='text-center'>No Collections to display</div>
                  )
                }
              </div>
            </section>

            <Footer />
          </div>
        )
      }
    </div>
  )
}
export default CollectionList;