import React, { useEffect, useState } from 'react';
import { Router, Location, Redirect } from '@reach/router';
import ScrollToTopBtn from './menu/ScrollToTop';
import Header from './menu/header';
import Home1 from './pages/home1';
import Explore from './pages/explore';
import Rangking from './pages/rangking';
import Auction from './pages/Auction';
import Colection from './pages/colection';
import ItemDetail from './pages/ItemDetail';
import Author from './pages/Author';
import Profile from './pages/profile';
import CreateItem from './pages/Item/CreateItem';
import Activity from './pages/activity';
import Contact from './pages/contact';

import { createGlobalStyle } from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WalletConnectModal from './components/WalletConnectModal';
import CreateCollection from './pages/Collection/CreateCollection';
import CollectionList from './pages/Collection/CollectionList';
import setAuthToken from './services/setAuthToken';
import { injected, requestChangeNetwork } from './services/wallet';
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from 'react-redux';
import { connectUser } from '../store/action/user';
import { SET_CONNECTED, SET_WALLET_ACCOUNT } from '../store/types';
import MyCollections from './pages/Collection/MyCollections';
import ItemList from './pages/Item/ItemList';

const GlobalStyles = createGlobalStyle`
  :root {
    scroll-behavior: unset;
  }
`;

export const ScrollTop = ({ children, location }) => {
  React.useEffect(() => window.scrollTo(0, 0), [location])
  return children
}

const PosedRouter = ({ children }) => (
  <Location>
    {({ location }) => (
      <div id='routerhang'>
        <div key={location.key}>
          <Router location={location}>
            {children}
          </Router>
        </div>
      </div>
    )}
  </Location>
);

const App = () => {

  const dispatch = useDispatch();
  const [show, setShow] = useState(false);

  const { account, active, activate } = useWeb3React();

  useEffect(() => {
    if (active) {
      dispatch(connectUser(account))
      dispatch({
        type: SET_WALLET_ACCOUNT,
        payload: account
      });
      dispatch({
        type: SET_CONNECTED,
        payload: true
      });
    }
  }, [active, account, dispatch])

  useEffect(() => {
    if (window.ethereum === undefined) {
      toast.warning("Please install Metamask wallet");
    } else {
      if (window.ethereum.networkVersion !== 56 || window.ethereum.networkVersion !== 97) {
        requestChangeNetwork('0x61')
      }
      connectWallet(injected)
    }
  }, [])

  useEffect(() => {
    if (localStorage.getItem('jwtToken')) {
      setAuthToken(localStorage.getItem('jwtToken'));
    }
  })

  const connectWallet = async (connector) => {
    try {
      await activate(connector);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="wraper">
      <ToastContainer theme='dark' />
      <GlobalStyles />
      <Header onConnect={() => setShow(true)} />
      <PosedRouter>
        <ScrollTop path="/">
          <Home1 exact path="/">
            <Redirect to="/home" />
          </Home1>
          <Home1 path="/home" />
          <Explore path="/explore" />
          <Rangking path="/rangking" />
          <Auction path="/Auction" />
          <Colection path="/colection" />
          <ItemDetail path="/ItemDetail" />
          <Author path="/Author" />
          <Profile path="/profile" />
          <CreateItem path="/create-item" />
          <Activity path="/activity" />
          <Contact path="/contact" />
          <CreateCollection path="/create-collection/:id" />
          <CollectionList path="/collections" />
          <MyCollections path="/my-collections" />
          <ItemList path="/collection/:id" />
        </ScrollTop>
      </PosedRouter>
      <ScrollToTopBtn />
      {
        show && (
          <WalletConnectModal
            show={show}
            onClose={() => setShow(false)}
            onConnect={connectWallet}
          />
        )
      }
    </div>
  )
}
export default App;