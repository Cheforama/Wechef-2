import { Modal, Button } from 'react-bootstrap'
import { injected, walletconnect } from '../services/wallet';

const WalletConnectModal = (props) => {

    return (
        <Modal show={props.show} onHide={props.onClose}>
            <Modal.Body>
                <div className="text-center p-2">
                    <Button
                        variant="secondary"
                        className="w-100 background-transparent color-black btn-wallet mb-2"
                        onClick={() => props.onConnect(injected) & props.onClose()}
                        style={{ borderColor: '#ddd' }}
                    >
                        <div className="metamask text-center">
                            <img className="metamask-img my-2" src='img/w1.svg' alt="img" width={'50px'} />
                            <p className="metamask-title Tanker">MetaMask</p>
                            <p className="metamask-txt Tanker">Connect to MetaMask Wallet</p>
                        </div>
                    </Button>
                    <Button
                        variant="secondary"
                        className="w-100 background-transparent color-black btn-wallet"
                        onClick={() => props.onConnect(walletconnect) & props.onClose()}
                        style={{ borderColor: '#ddd' }}
                    >
                        <div className="walletconnect text-center">
                            <img className="walletconnect-img my-2" src='img/w2.svg' alt="img" width={'50px'} />
                            <p className="walletconnect-title Tanker">WalletConnect</p>
                            <p className="walletconnect-txt Tanker"> Scan and Connect to Trust Wallet</p>
                        </div>
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default WalletConnectModal;