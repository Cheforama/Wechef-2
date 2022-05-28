import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { createGlobalStyle } from 'styled-components';
import moment from 'moment'
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import Footer from '../components/footer';
import { getAllActivities } from '../../store/action/history';
import { GET_HISTORIES } from '../../store/types';
import { market_address } from '../../contracts/contract';

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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const Activity = function () {

  const dispatch = useDispatch();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const { histories, totalCount } = useSelector(state => state.history)
  const { pending } = useSelector(state => state.collection);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    dispatch({
      type: GET_HISTORIES,
      payload: []
    })
  }, [])

  useEffect(() => {
    dispatch(getAllActivities(page, rowsPerPage))
  }, [page, rowsPerPage, dispatch])

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

            <section className='jumbotron breadcumb no-bg' style={{ backgroundImage: `url(${'./img/background/wave.ccca1787.svg'})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
              <div className='mainbreadcumb'>
                <div className='container'>
                  <div className='row m-10-hor'>
                    <div className='col-12'>
                      <h1 className='text-center'>Activity</h1>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className='container'>
              <div className='row'>
                <div className='col-12'>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Event</StyledTableCell>
                          <StyledTableCell>Item</StyledTableCell>
                          <StyledTableCell align="right">Price (CHEF)</StyledTableCell>
                          <StyledTableCell align="right">From</StyledTableCell>
                          <StyledTableCell align="right">To</StyledTableCell>
                          <StyledTableCell align="right">Time</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {histories.length > 0 && histories.map((row, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell component="th" scope="row">
                              {row.event}
                            </StyledTableCell>
                            <StyledTableCell>
                              <Box display="flex" alignItems="center">
                                <img src={`${process.env.REACT_APP_SERVER_URL}/upload/item/${row?.preview_img}`} height={50} alt="" />&nbsp;&nbsp;
                                <Box>
                                  <span style={{ color: 'gray' }}>{row?.collection_name}</span>
                                  <br />
                                  <span>{row?.item_name}&nbsp;#{row.token_id}</span>
                                </Box>
                              </Box>
                            </StyledTableCell>
                            <StyledTableCell align="right">{row?.price === 0 ? '' : row?.price}</StyledTableCell>
                            <StyledTableCell align="right">{row?.from.slice(0, 6)}...{row?.from.slice(row?.from.length - 6, row?.from.length)}</StyledTableCell>
                            <StyledTableCell align="right">
                              {row.event === 'List' ? `${market_address.slice(0, 6)}...${market_address.slice(market_address.length - 6, market_address.length)}` : `${row?.to.slice(0, 6)}...${row?.to.slice(row?.to.length - 6, row?.to.length)}`}
                            </StyledTableCell>
                            <StyledTableCell align="right">{moment(row.createdAt).format('MM-DD-YYYY HH:mm')}</StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <TablePagination
                    component="div"
                    count={totalCount}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </div>
              </div>
            </section>

            <Footer />
          </div>
        )
      }
    </div>

  );
}

export default Activity;