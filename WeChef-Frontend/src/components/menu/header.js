import React, { useEffect, useState } from "react";
import Breakpoint, { BreakpointProvider, setDefaultBreakpoints } from "react-socks";
import { Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from '@reach/router';
import useOnclickOutside from "react-cool-onclickoutside";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { MdApps, MdSettings, MdLogout } from 'react-icons/md';
import { SET_CONNECTED, SET_WALLET_ACCOUNT } from "../../store/types";

setDefaultBreakpoints([
  { xs: 0 },
  { l: 1199 },
  { xl: 1200 }
]);

const NavLink = props => (
  <Link
    {...props}
    getProps={({ isCurrent }) => {
      // the object returned here is passed to the
      // anchor element's props
      return {
        className: isCurrent ? 'active' : 'non-active',
      };
    }}
  />
);



const Header = function (props) {

  const { deactivate } = useWeb3React();
  const dispatch = useDispatch();
  const router = useNavigate();

  const [openMenu1, setOpenMenu1] = React.useState(false);
  const [openMenu2, setOpenMenu2] = React.useState(false);

  const { connected, profile, account } = useSelector(state => state.wallet);

  const handleBtnClick1 = () => {
    setOpenMenu1(!openMenu1);
  };
  const handleBtnClick2 = () => {
    setOpenMenu2(!openMenu2);
  };
  const closeMenu1 = () => {
    setOpenMenu1(false);
  };
  const closeMenu2 = () => {
    setOpenMenu2(false);
  };
  const ref1 = useOnclickOutside(() => {
    closeMenu1();
  });
  const ref2 = useOnclickOutside(() => {
    closeMenu2();
  });

  const [showmenu, btn_icon] = useState(false);

  useEffect(() => {
    const header = document.getElementById("myHeader");
    const totop = document.getElementById("scroll-to-top");
    const sticky = header.offsetTop;
    const scrollCallBack = window.addEventListener("scroll", () => {
      btn_icon(false);
      if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
        totop.classList.add("show");

      } else {
        header.classList.remove("sticky");
        totop.classList.remove("show");
      } if (window.pageYOffset > sticky) {

      }
    });
    return () => {
      window.removeEventListener("scroll", scrollCallBack);
    };
  }, []);

  const onDisconnect = async () => {
    try {
      deactivate();
      dispatch({
        type: SET_WALLET_ACCOUNT,
        payload: null
      });
      dispatch({
        type: SET_CONNECTED,
        payload: false
      });
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <header id="myHeader" className='navbar white'>
      <div className='container'>
        <div className='row w-100-nav d-flex align-items-center'>
          <div className='logo px-0'>
            <div className='navbar-title navbar-item d-flex align-items-center' style={{ color: 'white' }}>
              <div className="d-flex d-xs--none">
                WeChef <span style={{ fontSize: 17, display: 'contents' }}>by</span>&nbsp;
              </div>
              <NavLink to="/">
                <img
                  src="/img/logo.png"
                  className="img-logo"
                  alt="#"
                />
              </NavLink>
            </div>
          </div>

          {/* <div className='search'>
            <input id="quick_search" className="xs-hide" name="quick_search" placeholder="search item here..." type="text" />
          </div> */}

          <BreakpointProvider>
            <Breakpoint l down>
              {showmenu &&
                <div className='menu'>
                  <div className='navbar-item'>
                    <NavLink to="/">
                      Home
                      <span className='lines'></span>
                    </NavLink>
                  </div>
                  <div className='navbar-item'>
                    <div ref={ref1}>
                      <div className="dropdown-custom dropdown-toggle btn"
                        onMouseEnter={handleBtnClick1} onMouseLeave={closeMenu1}>
                        Explore
                        <span className='lines'></span>
                        {openMenu1 && (
                          <div className='item-dropdown'>
                            <div className="dropdown" onClick={closeMenu1}>
                              <NavLink to="/explore">All Items</NavLink>
                              {/* <NavLink to="/rangking">Rangking</NavLink> */}
                              <NavLink to="/collections">Collections</NavLink>
                              {/* <NavLink to="/ItemDetail">Items Details</NavLink> */}
                              {/* <NavLink to="/Auction">Live Auction</NavLink> */}
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                  <div className='navbar-item'>
                    <div ref={ref2}>
                      <div className="dropdown-custom dropdown-toggle btn"
                        onMouseEnter={handleBtnClick2} onMouseLeave={closeMenu2}>
                        Create
                        <span className='lines'></span>
                        {openMenu2 && (
                          <div className='item-dropdown'>
                            <div className="dropdown" onClick={closeMenu2}>
                              <NavLink to="/create-item">Create item</NavLink>
                              <NavLink to="/create-collection/new">Create collection</NavLink>
                              {/* <NavLink to="/profile">Profile</NavLink>
                              <NavLink to="/contact">Contact Us</NavLink> */}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className='navbar-item'>
                    <NavLink to="/activity">
                      Activity
                      <span className='lines'></span>
                    </NavLink>
                  </div>
                </div>
              }
            </Breakpoint>

            <Breakpoint xl>
              <div className='menu'>
                <div className='navbar-item'>
                  <NavLink to="/">
                    Home
                    <span className='lines'></span>
                  </NavLink>
                </div>
                <div className='navbar-item'>
                  <div ref={ref1}>
                    <div className="dropdown-custom dropdown-toggle btn"
                      onMouseEnter={handleBtnClick1} onMouseLeave={closeMenu1}>
                      Explore
                      <span className='lines'></span>
                      {openMenu1 && (
                        <div className='item-dropdown'>
                          <div className="dropdown" onClick={closeMenu1}>
                            <NavLink to="/explore">All Items</NavLink>
                            {/* <NavLink to="/rangking">Rangking</NavLink> */}
                            <NavLink to="/collections">Collections</NavLink>
                            {/* <NavLink to="/ItemDetail">Items Details</NavLink> */}
                            {/* <NavLink to="/Auction">Live Auction</NavLink> */}
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
                <div className='navbar-item'>
                  <div ref={ref2}>
                    <div className="dropdown-custom dropdown-toggle btn"
                      onMouseEnter={handleBtnClick2} onMouseLeave={closeMenu2}>
                      Create
                      <span className='lines'></span>
                      {openMenu2 && (
                        <div className='item-dropdown'>
                          <div className="dropdown" onClick={closeMenu2}>
                            <NavLink to="/create-item">Create item</NavLink>
                            <NavLink to="/create-collection/new">Create collection</NavLink>
                            {/* <NavLink to="/profile">Profile</NavLink>
                            <NavLink to="/contact">Contact Us</NavLink> */}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className='navbar-item'>
                  <NavLink to="/activity">
                    Activity
                    <span className='lines'></span>
                  </NavLink>
                </div>
              </div>
            </Breakpoint>
          </BreakpointProvider>

          <div className='mainside'>
            {
              connected === true ? (
                <Dropdown navbar={false}>
                  <Dropdown.Toggle variant="link" id="dropdown-basic">
                    {
                      profile.hasOwnProperty('profile_img') ? profile.profile_img !== "" ? (
                        <img
                          src={`${process.env.REACT_APP_SERVER_URL}/file/profile/${profile.profile_img}`}
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = "/img/no-avatar.png";
                          }}
                          className="border-circle"
                          width={30}
                          alt=""
                        />
                      ) : (
                        <img src="/img/no-avatar.png" className="border-circle" width={30} alt="" />
                      ) : <></>
                    }
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => router('/profile')}>
                      <span>{profile.username}</span>
                      <br />
                      <span style={{ color: 'gray', fontSize: '14px' }}>
                        {account.slice(0, 6)}...{account.slice(account.length - 6, account.length)}
                      </span>
                    </Dropdown.Item>
                    {/* <Dropdown.Item onClick={() => router('/profile')}><MdSettings /> Profile</Dropdown.Item> */}
                    {/* <Dropdown.Item onClick={() => router('/my-collections')}><MdApps /> My Collections</Dropdown.Item>
                    {
                      connected && (
                        <Dropdown.Item onClick={() => router(`/items/${account}`)}><MdApps /> My Items</Dropdown.Item>
                      )
                    } */}
                    <Dropdown.Item onClick={onDisconnect}><MdLogout /> Disconnect</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Button onClick={props.onConnect}>Connect Wallet</Button>
              )
            }
          </div>

        </div>

        <button className="nav-icon" onClick={() => btn_icon(!showmenu)}>
          <div className="menu-line white"></div>
          <div className="menu-line1 white"></div>
          <div className="menu-line2 white"></div>
        </button>

      </div>
    </header >
  );
}
export default Header;