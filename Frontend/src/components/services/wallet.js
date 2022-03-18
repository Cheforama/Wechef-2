import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

export const injected = new InjectedConnector({
    supportedChainIds: [56, 97]
});

export const walletconnect = new WalletConnectConnector({
    rpc: {
        // 1: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        56: 'https://bsc-dataseed1.binance.org/',
        97: 'https://data-seed-prebsc-1-s1.binance.org:8545/'
    },
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true,
    pollingInterval: 15000
})

export const requestChangeNetwork = async (chainId) => {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainId }],
        });
    } catch (error) {
        if (error.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: chainId,
                            rpcUrl: getrpcURLWithChainId(chainId),
                        },
                    ],
                });
            } catch (addError) {
                console.error(addError);
            }
        }
        console.error(error);
    }
}

export const getrpcURLWithChainId = (id) => {
    switch (id) {
        case 1:
            return "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
        case 56:
            return "https://bsc-dataseed1.binance.org/";
        case 97:
            return "https://data-seed-prebsc-1-s1.binance.org:8545/";
        case 137:
            return "https://polygon-rpc.com/"
        case 43114:
            return "https://api.avax.network/ext/bc/C/rpc"
        default:
            return "";
    }
}