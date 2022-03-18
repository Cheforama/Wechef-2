import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Footer from '../../components/footer';
import { createGlobalStyle } from 'styled-components';
import { Button, Spinner } from "react-bootstrap";
import Switch from "react-switch";
import PropertyModal from "../../modals/PropertyModal";
import { getMyCollections } from "../../../store/action/collection";
import { IpfsStorage } from '../../../IPFSStorage/ipfs';
import { toast } from "react-toastify";
import { getContract } from "../../services/contract";
import { saveItem } from "../../../store/action/item";
import { SET_PENDING } from "../../../store/types";

const video_extList = ['mp4', 'avi', 'webm', 'ogg'];
const image_extList = ['png', 'jpg', 'gif', 'jpeg'];

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

const CreateItem = () => {

  const fileRef = useRef();
  const previewRef = useRef();
  const dispatch = useDispatch();
  const { account } = useSelector(state => state.wallet);
  const { collections, pending } = useSelector(state => state.collection);

  useEffect(() => {
    if (account !== null) {
      dispatch(getMyCollections())
    }
  }, [dispatch, account])

  const [openProperty, setOpenProperty] = useState(false);
  const [properties, setProperties] = useState([]);
  const [unlock, setUnlock] = useState(false);
  const [item_asset, setItemAsset] = useState(null);
  const [name, setName] = useState('')
  const [externalLink, setExternalLink] = useState('');
  const [description, setDescription] = useState('');
  const [collection, setCollection] = useState('');
  const [unlockableContent, setUnlockableContent] = useState('');
  const [mintCount, setMintCount] = useState(1);
  const [video_selected, setVideoSelected] = useState(false);
  const [preview_selected, setPreviewSelected] = useState(false);
  const [assetFile, setAssetFile] = useState(null);
  const [preview_image, setPreviewImage] = useState(null);
  const [pendingText, setPendingText] = useState('');
  const [id, setId] = useState(-1);

  const handleSave = async () => {
    if (account === null) {
      toast.warning("Please connect wallet");
      return;
    }
    if (name === '') {
      toast.warning("Please input item name");
      return;
    }
    if (item_asset === null) {
      toast.warning("Please select Item asset");
      return;
    }
    try {
      dispatch({
        type: SET_PENDING,
        payload: true
      })
      setPendingText("Uploading asset to IPFS...")

      const asset_hash = await IpfsStorage(assetFile);

      setPendingText("Uploading metadata to IPFS...")

      const details = {
        image: "https://ipfs.io/ipfs/" + asset_hash.path,
        name: name,
        description: description,
        externalLink: externalLink,
        collection: collection,
        unlockableContent: unlockableContent,
        supply: mintCount,
        attributes: properties
      }
      const details_hash = await IpfsStorage(Buffer.from(JSON.stringify(details)));

      setPendingText('Minting now...')

      const nftContract = getContract();
      await nftContract.methods.createToken(details_hash.path).send({ from: account })

      const formData = new FormData();
      formData.append("id", id);
      formData.append("owner", account);
      formData.append('name', name);
      formData.append('collection', collection);
      formData.append('externalLink', externalLink);
      formData.append('description', description);
      formData.append('properties', JSON.stringify(properties));
      formData.append('unlockable', unlock);
      formData.append('unlockableContent', unlockableContent);
      formData.append('supply', mintCount);
      formData.append('asset', details_hash.path);
      formData.append('preview_image', preview_image);

      dispatch(saveItem(formData))
    } catch (err) {
      console.log(err)
      dispatch({
        type: SET_PENDING,
        payload: false
      })
    }
  }

  const captureFile = (event, asset_type) => {
    const file = event.target.files[0];
    if (file) {
      const fileName = (event.target.value).split('/');
      const mainName = fileName[fileName.length - 1];
      const extNames = mainName.split('.');
      if (extNames.length > 1) {
        const ext = extNames[extNames.length - 1];
        if (asset_type === 'video') {
          if (video_extList.indexOf(ext) > -1) {
            const reader = new window.FileReader();
            reader.readAsArrayBuffer(file); // Read bufffered file
            reader.onloadend = () => {
              setAssetFile(Buffer(reader.result));
            };
            setItemAsset(file);
            setVideoSelected(true);
          } else {
            toast.warning("Invalid file format");
          }
        } else {
          if (image_extList.indexOf(ext) > -1) {
            setPreviewImage(file);
            setPreviewSelected(true);
          } else {
            toast.warning("Invalid file format");
          }
        }
      }
    } else {
      setAssetFile('');
    }
  }

  return (
    <div>
      <>
        <GlobalStyles />

        <section className='jumbotron breadcumb no-bg' style={{ backgroundImage: `url(${'./img/background/wave.ccca1787.svg'})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
          <div className='mainbreadcumb'>
            <div className='container'>
              <div className='row m-10-hor'>
                <div className='col-12'>
                  <h1 className='text-center'>Create Item</h1>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='container'>

          <div className="row">
            <div className="col-lg-8 offset-lg-2 col-12">
              <div className="field-set">

                <div className="spacer-single"></div>

                <h5>Name <span className="color-red">*</span></h5>
                <input type="text" className="form-control" placeholder="Item name" onChange={(e) => setName(e.target.value)} />

                <div className="spacer-single"></div>

                <h5>External Link</h5>
                <p className="mb-1 font-size--small">
                  This will include a link to this URL on this item's detail page, so that users can click to learn more about it.
                  You are welcome to link to your own webpage with more details.
                </p>
                <input type="text" className="form-control" onChange={(e) => setExternalLink(e.target.value)} placeholder="https://yoursite.io/item/123" />

                <div className="spacer-10"></div>

                <h5>Description</h5>
                <p className="mb-1 font-size--small">
                  The description will be included on the item's detail page underneath its image. Markdown syntax is supported.
                </p>
                <textarea data-autoresize className="form-control" onChange={(e) => setDescription(e.target.value)} placeholder=""></textarea>

                <div className="spacer-10"></div>

                <h5>Collection <span className="color-red">*</span></h5>
                <p className="mb-1 font-size--small">
                  This is the collection where your item will appear.
                </p>
                <select className="form-control" onChange={(e) => setCollection(e.target.value)}>
                  <option value=''>Select a collection</option>
                  {
                    collections.length > 0 && collections.map((collection, index) => (
                      <option value={collection.id} key={index}>{collection.name}</option>
                    ))
                  }
                </select>

                <div className="spacer-10"></div>

                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex">
                    <i className="fa fa-list mt-1" style={{ fontSize: 22 }}></i>
                    <div className="d-inline-block mx-2">
                      <h5 className="mb-1 font-bold">Properties</h5>
                      <span className="mb-1 font-size--small">Textual traits that show up as rectangles</span>
                    </div>
                  </div>
                  <Button variant="outline-primary" onClick={() => setOpenProperty(true)}>+</Button>
                </div>
                <div className="row">
                  {
                    properties.length > 0 && properties.map((data, index) => (
                      <div className="col-md-3 col-6 p-2" key={index}>
                        <div className="attribute-box py-3">
                          <p className="color-light-blue mb-2">{data.trait_type}</p>
                          <p className="color-black mb-0">{data.value}</p>
                        </div>
                      </div>
                    ))
                  }
                </div>

                <div className="spacer-single"></div>

                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex">
                    <i className="fa fa-unlock mt-1" style={{ fontSize: 22 }}></i>
                    <div className="d-inline-block mx-2">
                      <h5 className="mb-1 font-bold">Unlockable Content</h5>
                      <span className="mb-1 font-size--small">Include unlockable content that can only be revealed by the owner of the item.</span>
                    </div>
                  </div>
                  <Switch onChange={() => setUnlock(!unlock)} checked={unlock} />
                </div>
                {
                  unlock && (
                    <div className="my-2">
                      <textarea rows={3} className="form-control" onChange={(e) => setUnlockableContent(e.target.value)} placeholder="Enter content(access key, code to redeem, link to file, etc.)"></textarea>
                    </div>
                  )
                }

                <div className="spacer-single"></div>

                <h5>Supply </h5>
                <p className="font-size--small">The number of items that can be minted. No gas cost to you! </p>
                <input type="text" className="form-control" placeholder="Supply" value="1" onChange={(e) => setMintCount(e.target.value)} disabled />

                <h5>Upload asset <span className="color-red">*</span></h5>
                {
                  video_selected ? (
                    <div className="d-create-file position-relative">
                      <video width="400" height="100%" controls>
                        <source src={URL.createObjectURL(item_asset)} />
                      </video>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="position-absolute top-0 right-0"
                        onClick={() => fileRef.current.click()}
                      >Change</Button>
                      <input type="file" className="d-none" ref={fileRef} onChange={(e) => captureFile(e, 'video')} />
                    </div>
                  ) : (
                    <div className="d-create-file">
                      <div>
                        <p id="file_name">MP4, OGG or WEBM. Max 200mb.</p>
                        <div className='browse'>
                          <input type="button" id="get_file" className="btn-main" value="Browse" />
                          <input id='upload_file' type="file" onChange={(e) => captureFile(e, 'video')} />
                        </div>
                      </div>
                    </div>
                  )
                }

                <div className="spacer-single"></div>

                <h5>Preview Image <span className="color-red">*</span></h5>
                <p>Because you’ve included multimedia, you’ll need to provide an image (PNG, JPG, or GIF) for the card display of your item.</p>
                <div className='collection-banner d-flex align-items-center justify-content-center' style={{ width: '150px !important' }}>
                  {
                    preview_selected ? (
                      <div className='position-relative d-flex justify-content-center align-items-center' style={{ width: '100%', height: '100%' }}>
                        <img src={URL.createObjectURL(preview_image)} alt="" width="100%" height="100%" className='profile-preview' />
                        <i className='fa fa-trash position-absolute' onClick={(e) => setPreviewImage(null) & setPreviewSelected(false)} style={{ color: 'rgb(111, 25, 192)' }}></i>
                      </div>
                    ) : (
                      <div className='position-relative d-flex justify-content-center align-items-center' style={{ width: '100%', height: '100%' }}>
                        <i className='fa fa-pencil position-absolute' onClick={(e) => previewRef.current.click()}></i>
                      </div>
                    )
                  }
                </div>
                <input ref={previewRef} type="file" className='d-none' onChange={(e) => captureFile(e, 'image')} accept=".png,.jpg" />

                <div className="d-flex align-items-center mt-4">
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={pending === true}
                  >Create</Button>
                  {
                    pending && (
                      <div className="d-flex align-items-center mx-4">
                        <div className="mx-4">
                          <Spinner animation="border" variant="primary" />
                        </div>
                        {pendingText}
                      </div>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
          {
            openProperty && <PropertyModal
              show={openProperty}
              handleClose={() => setOpenProperty(false)}
              saveProperties={(val) => setProperties(val)}
              data={properties}
            />
          }

        </section>

        <Footer />
      </>
    </div>
  )
}

export default CreateItem;