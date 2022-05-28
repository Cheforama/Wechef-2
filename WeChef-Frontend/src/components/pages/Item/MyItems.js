import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import Select from 'react-select'
import { createGlobalStyle } from 'styled-components';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import PopularItemCard from '../../components/popularItemCard';
import Footer from '../../components/footer';
import { useParams } from '@reach/router';
import { getMyItems } from '../../../store/action/item';
import { useWeb3React } from '@web3-react/core';

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
    color: rgba(255, 255, 255, .5);;
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

const customStyles = {
  option: (base, state) => ({
    ...base,
    background: "#fff",
    color: "#333",
    borderRadius: state.isFocused ? "0" : 0,
    "&:hover": {
      background: "#eee",
    }
  }),
  menu: base => ({
    ...base,
    borderRadius: 0,
    marginTop: 0
  }),
  menuList: base => ({
    ...base,
    padding: 0
  }),
  control: (base, state) => ({
    ...base,
    padding: 2
  })
};

const options1 = [
  { value: 'recently_listed', label: 'Recently Listed' },
  { value: 'recently_created', label: 'Recently Created' },
  { value: 'recently_sold', label: 'Recently Sold' },
  { value: 'low_to_high', label: 'Price: Low to High' },
  { value: 'high_to_low', label: 'Price: High to Low' },
  { value: 'highest_last_sale', label: 'Highest Last Sale' },
  { value: 'oldest', label: 'Oldest' },
]

const MyItems = () => {

  const dispatch = useDispatch();
  const params = useParams();
  const { account } = useWeb3React();

  const [filterKey, setFilterKey] = useState('')
  const [sortKey, setSortKey] = useState('recently_listed');
  const [filteredItems, setFilteredItems] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  const { items, totalItems } = useSelector(state => state.item);
  const { pending } = useSelector(state => state.collection);
  const { connected } = useSelector(state => state.wallet);

  useEffect(() => {
    if (connected) {
      dispatch(getMyItems(page, rowsPerPage, params.account));
    }
  }, [dispatch, page, rowsPerPage, connected]);

  useEffect(() => {
    if (items.length > 0) {
      setFilteredItems(items);
    }
  }, [items]);

  useEffect(() => {
    setFilteredItems(items.filter(item =>
      item.name.indexOf(filterKey) > -1 ||
      item.owner_name.indexOf(filterKey) > -1
    ))
  }, [filterKey])

  useEffect(() => {
    if (pending) {
      document.getElementById('myHeader').style.display = 'none';
    } else {
      document.getElementById('myHeader').style.display = 'flex';
    }
  }, [pending])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


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

            <section className='jumbotron breadcumb no-bg' style={{ backgroundImage: `url(${'/img/background/wave.ccca1787.svg'})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
              <div className='mainbreadcumb'>
                <div className='container'>
                  <div className='row m-10-hor'>
                    <div className='col-12'>
                      <h1 className='text-center'>{account === params.account ? 'My Items' : `Items`}</h1>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className='container'>
              <div className='row'>
                <div className='col-lg-12'>
                  <div className="items_filter d-flex align-items-center justify-content-between">
                    <form className="row form-dark" id="form_quick_search" name="form_quick_search">
                      <div className="col">
                        <input className="form-control mb-0" placeholder="search item here..." type="text" onChange={(e) => setFilterKey(e.target.value)} />
                        <button id="btn-submit">
                          <i className="fa fa-search bg-color-secondary"></i>
                        </button>
                        <div className="clearfix"></div>
                      </div>
                    </form>
                    <div className='dropdownSelect two'>
                      <Select
                        styles={customStyles}
                        defaultValue={options1[0]}
                        options={options1}
                        onChange={(e) => setSortKey(e.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='row'>
                {items.length > 0 ? items
                  .sort((a, b) => {
                    switch (sortKey) {
                      case 'recently_listed':
                        return moment(b.listed_date) - moment(a.listed_date)
                      case 'recently_created':
                        return moment(b.createdAt) - moment(a.createdAt)
                      case 'recently_sold':
                        return moment(b.latest_sold_date) - moment(a.latest_sold_date)
                      case 'low_to_high':
                        return a.listed_price - b.listed_price
                      case 'high_to_low':
                        return b.listed_price - a.listed_price
                      case 'highest_last_sale':
                        return b.max_sold_price - a.max_sold_price
                      case 'oldest':
                        return moment(a.createdAt) - moment(b.createdAt)
                      default:
                        return moment(b.listed_date) - moment(a.listed_date)
                    }
                  })
                  .map((item, index) => (
                    <div key={index} className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-4">
                      <PopularItemCard item={item} />
                    </div>
                  )) : (
                  <div className="col-12 text-center">No data</div>
                )}
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <span className='color-black'>Total Items: {totalItems}</span>
                <TablePagination
                  component="div"
                  count={totalItems}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[12, 20, 32, 40]}
                />
              </div>
            </section>

            <Footer />
          </div>
        )
      }
    </div>
  )
};
export default MyItems;