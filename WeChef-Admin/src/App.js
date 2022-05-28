import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Home from './pages/Home/Home';
import axiosInstance from './utils/axiosInstance';
import { GET_AUTHENTICATED, GET_USER } from './store/types';
import Header from './components/layout/Header';
import Users from './pages/Home/Users';
import Reports from './pages/Home/Reports';
import Admin from './pages/Home/Admin';
import Account from './pages/Home/Account';

function App() {

  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector(state => state.user);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      axiosInstance.get('/auth')
        .then(res => {
          console.log(res.data);
          dispatch({
            type: GET_AUTHENTICATED,
            payload: true
          });
          dispatch({
            type: GET_USER,
            payload: res.data
          })
        }).catch(err => {
          console.log(err.response.data);
          localStorage.removeItem('jwtToken');
          window.location.href = '/login';
        })
    } else {
      // window.location.href = '/login';
    }
  }, []);

  return (
    <Box>
      <Header />
      <Routes>
        <Route path='/' element={<Users />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path="/users" element={<Users />} />
        <Route path="/report" element={<Reports />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/account" element={<Account />} />
      </Routes>
      <ToastContainer theme='dark' />
    </Box>
  );
}

export default App;
