import myEpicNft from './utils/MyEpicNFT.json';
import { ethers } from "ethers";
// useEffect と useState 関数を React.js からインポートしています。
import React, { useEffect, useState } from "react";
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import NFTimage0 from './assets/IMG0.png';
import NFTimage1 from './assets/IMG1.png';
import NFTimage2 from './assets/IMG2.png';
import NFTimage3 from './assets/IMG3.png';

// Constantsを宣言する: constとは値書き換えを禁止した変数を宣言する方法です。
const TWITTER_HANDLE = 'Heihei53960093';
const TWITTER_LINK = 'https://twitter.com/Heihei53960093';
const OPENSEA_LINK = 'https://testnets.opensea.io/collection/the-nft-bser1k6q1v';
const RARIBLE_LINK = 'https://rinkeby.rarible.com/collection/0x4dF5A9a498E49f6e2aB9D5AF546c86D8e8BFA6a4/items';
const LOOKSRARE_LINK = 'https://rinkeby.looksrare.org/collections/0x4dF5A9a498E49f6e2aB9D5AF546c86D8e8BFA6a4';
const CONTRACT_ADDRESS = '0x4dF5A9a498E49f6e2aB9D5AF546c86D8e8BFA6a4'
//const CONTRACT_ADDRESS = '0xc6C2AC0120147B6E3377c47C104D0b998F6C5A97'
//const CONTRACT_ADDRESS = "0x7Be6721aBF4e5Da2C4073a4c4725afCC915A73De";
//const CONTRACT_ADDRESS = "0x3207402901180aaf04703E5ED7543067d2EC1cA8";
const TOTAL_MINT_COUNT = 3;

const App = () => {
  /*
  * ユーザーのウォレットアドレスを格納するために使用する状態変数を定義します。
  */
  const [currentAccount, setCurrentAccount] = useState("");
  /*この段階でcurrentAccountの中身は空*/
  console.log("currentAccount: ", currentAccount);
  /*
  * ユーザーが認証可能なウォレットアドレスを持っているか確認します。
  */
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        return;
    } else {
        console.log("We have the ethereum object", ethereum);
    }
    /* ユーザーが認証可能なウォレットアドレスを持っている場合は、
     * ユーザーに対してウォレットへのアクセス許可を求める。
     * 許可されれば、ユーザーの最初のウォレットアドレスを
     * accounts に格納する。
     */
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);

      // **** イベントリスナーをここで設定 ****
      // この時点で、ユーザーはウォレット接続が済んでいます。
      setupEventListener();      
    } else {
      console.log("No authorized account found")
    }
  }

  /*
  * connectWallet メソッドを実装します。
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      /*
      * ウォレットアドレスに対してアクセスをリクエストしています。
      */
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected", accounts[0]);
      /*
      * ウォレットアドレスを currentAccount に紐付けます。
      */
      setCurrentAccount(accounts[0]);
      // **** イベントリスナーをここで設定 ****
      setupEventListener();
    } catch (error) {
      console.log(error)
    }
  }

  // setupEventListener 関数を定義します。
  // MyEpicNFT.sol の中で event が　emit された時に、
  // 情報を受け取ります。
  const setupEventListener = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        // NFT が発行されます。
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );
        // Event が　emit される際に、コントラクトから送信される情報を受け取っています。
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          alert(
            `あなたのウォレットに NFT を送信しました。OpenSea に表示されるまで最大で10分かかることがあります。NFT へのリンクはこちらです: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
          );
        });
        console.log("Setup event listener!");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkMintCnt = async () => {
    try {
      const { ethereum } = window;
      if (myEpicNft.newItemId < TOTAL_MINT_COUNT){
        console.log(`TOTAL_MINT_COUNT: ${TOTAL_MINT_COUNT}` )
      } else {
      alert("No more can be issued NFT.");
      }
    } catch (error) {
      console.log(error)
    }
  }





  const askContractToMintNft0 = async () => {
    try {
      const { ethereum } = window;
      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain " + chainId);
      // 0x4 は　Rinkeby の ID です。
      const rinkebyChainId = "0x4";
      if (chainId !== rinkebyChainId) {
        alert("You are not connected to the Rinkeby Test Network!");
      } else {
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
          console.log("Going to pop wallet now to pay gas...")
          let nftTxn = await connectedContract.makeAnEpicNFT0();
          console.log("Mining...please wait.")
          await nftTxn.wait();
    
          console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft1 = async () => {
    try {
      const { ethereum } = window;
      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain " + chainId);
      // 0x4 は　Rinkeby の ID です。
      const rinkebyChainId = "0x4";
      if (chainId !== rinkebyChainId) {
        alert("You are not connected to the Rinkeby Test Network!");
      } else {
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
          console.log("Going to pop wallet now to pay gas...")
          let nftTxn = await connectedContract.makeAnEpicNFT1();
          console.log("Mining...please wait.")
          await nftTxn.wait();
    
          console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  const askContractToMintNft2 = async () => {
    try {
      const { ethereum } = window;
      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain " + chainId);
      // 0x4 は　Rinkeby の ID です。
      const rinkebyChainId = "0x4";
      if (chainId !== rinkebyChainId) {
        alert("You are not connected to the Rinkeby Test Network!");
      } else {
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
          console.log("Going to pop wallet now to pay gas...")
          let nftTxn = await connectedContract.makeAnEpicNFT2();
          console.log("Mining...please wait.")
          await nftTxn.wait();
    
          console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  const askContractToMintNft3 = async () => {
    try {
      const { ethereum } = window;
      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain " + chainId);
      // 0x4 は　Rinkeby の ID です。
      const rinkebyChainId = "0x4";
      if (chainId !== rinkebyChainId) {
        alert("You are not connected to the Rinkeby Test Network!");
      } else {
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
          console.log("Going to pop wallet now to pay gas...")
          let nftTxn = await connectedContract.makeAnEpicNFT3();
          console.log("Mining...please wait.")
          await nftTxn.wait();
    
          console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      }
    } catch (error) {
      console.log(error)
    }
  }  

  // renderNotConnectedContainer メソッドを定義します。
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  /*
  * ページがロードされたときに useEffect()内の関数が呼び出されます。
  */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  return (
     <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">The NFT Collection</p>
          <p className="sub-text">
          This is 100% On-chain TEXT. The minting process is now available. Please click here to mint your NFT.
          </p>

          <ul class="top-banner">
          <li>
          <img alt="Twitter Logo" className="svg-Image" src={NFTimage0} />
          </li>
          <li>
          <img alt="Twitter Logo" className="svg-Image" src={NFTimage1} />
          </li>
          <li>
          <img alt="NFTimage0" className="svg-Image" src={NFTimage2} />
          </li>
          <li>
          <img alt="NFTimage0" className="svg-Image" src={NFTimage3} />
          </li>
          </ul>


          {/*条件付きレンダリングを追加しました
          // すでに接続されている場合は、
          // Connect to Walletを表示しないようにします。*/}
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
          <ul class="top-banner">
            <li>
            <button onClick={askContractToMintNft0} className="cta-button mint-button">
              Mint
            </button>
            </li>
            <li>
            <button onClick={askContractToMintNft1} className="cta-button mint-button">
              Mint
            </button>
            </li>
            <li>
            <button onClick={askContractToMintNft2} className="cta-button mint-button">
              Mint
            </button>
            </li>
            <li>
            <button onClick={askContractToMintNft3} className="cta-button mint-button">
              Mint
            </button>                      
            </li>
          </ul>

          )}
          <p className="sub-text2">Contract: {CONTRACT_ADDRESS}</p>
          <p className="sub-text2">Preview Links</p>
          <a className="sub-text2" href={OPENSEA_LINK} target="_blank" rel="noreferrer">View on Opensea</a><br/>
          <a className="sub-text2" href={RARIBLE_LINK} target="_blank" rel="noreferrer">View on Rarible</a><br/>
          <a className="sub-text2" href={LOOKSRARE_LINK} target="_blank" rel="noreferrer">View on LooksRare</a><br/>
        </div>
        <div className="footer-container">
          <a className="footer-text" href={TWITTER_LINK} target="_blank" rel="noreferrer"><img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} /></a>
        </div>
      </div>
    </div>
  );
};
export default App;