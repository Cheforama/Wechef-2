import { useNavigate } from "@reach/router";
import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createGlobalStyle } from 'styled-components';
import { getMyCollections } from "../../../store/action/collection";
import CollectionCard from "../../components/CollectionCard";

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


const MyCollections = () => {

    const router = useNavigate();
    const { account, active } = useWeb3React();
    const dispatch = useDispatch();

    const { collections } = useSelector(state => state.collection);

    useEffect(() => {
        if (active && account !== undefined) {
            dispatch(getMyCollections());
        }
    }, [active, account])

    return (
        <div className="position-relative">

            <GlobalStyles />

            <section className='jumbotron breadcumb no-bg' style={{ backgroundImage: `url(${'/img/background/wave.ccca1787.svg'})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', height: '85px' }}>
            </section>

            <div className="page-content my-4">
                <div className="container py-4">
                    <h2>My Collections</h2>
                    <p>Create, curate, and manage collections of unique NFTs to share and sell.</p>
                    <Button variant="primary" onClick={() => router('/create-collection/new')}>Create a collection</Button>
                    <div className="row mt-4">
                        {
                            collections.length > 0 ? collections.map((item, index) => (
                                <div className='col-md-4 col-lg-3 col-12 p-2' key={index}>
                                    <div onClick={() => router(`collection/${item.id}`)}>
                                        <CollectionCard editable={true} data={item} />
                                    </div>
                                </div>
                            )) : (
                                <div className='text-center'>No Collections to display</div>
                            )
                        }
                    </div>

                </div>
            </div>

        </div>
    )
}

export default MyCollections;