import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import WalletItems from '../components/wallet';
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import { Button, Overlay, Tooltip } from 'react-bootstrap';

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

const Wallet = () => {

  const { connected, account } = useSelector(state => state.wallet);

  const [show, setShow] = useState(false);
  const target = useRef(null);

  const onCopy = () => {
    if (connected) {
      navigator.clipboard.writeText(account)
      setShow(true);
      setTimeout(() => {
        setShow(false)
      }, 3000);
    }
  }

  return (
    <div>
      <GlobalStyles />

      <section className='jumbotron breadcumb no-bg' style={{ backgroundImage: `url(${'./img/background/subheader.jpg'})` }}>
        <div className='mainbreadcumb'>
          <div className='container'>
            <div className='row m-10-hor'>
              <div className='col-12'>
                <h1 className='text-center'>Wallet</h1>
                <div className='address-box px-2 py-1'>
                  <div className="w-100">
                    {
                      connected === true ? `${account.slice(0, 10)}...${account.slice(account.length - 8, account.length)}` : 'Not connected'
                    }
                  </div>
                  <div>
                    <Button className='link' variant="link" ref={target} onClick={onCopy}>
                      <i className='fa fa-copy'></i>
                    </Button>
                    <Overlay target={target.current} show={show} placement="bottom">
                      {(props) => (
                        <Tooltip className="font-very-small" id="overlay-example" {...props}>
                          Copied!
                        </Tooltip>
                      )}
                    </Overlay>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='container'>
        <WalletItems />
      </section>

      <Footer />
    </div>

  )
}

export default Wallet;