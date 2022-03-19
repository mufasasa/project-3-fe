import * as React from "react";
import { BigNumber, ethers } from "ethers";
import './App.css';
import abi from './utils/StakingToken.json';

export default function App() {

  const [currentAccount, setCurrentAccount] = React.useState("");
  const [totalTokens, setTotalTokens] = React.useState(0);
  const [stakedTokens, setStakedTokens] = React.useState(0);
  const contractAddress = "0x4C32df9591aF6020358BeB8c1356318669011d5F";
  const [tokenNumber, setTokenNumber] = React.useState(0);
  const [stakeNumber, setStakeNumber] = React.useState(0);
  const [addressTo, setAddressTo] = React.useState("");
  const [transferAmount, setTransferAmount] = React.useState(0);

  const contractABI = abi.abi


  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
  
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }


  const getTotalTokens = async () => {

    try {
      const {ethereum} = window;
      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        const userTokens = await contract.balanceOf(currentAccount);

        setTotalTokens(userTokens.toNumber());
        console.log("Total tokens: ", userTokens.toNumber());
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getStakedTokens = async () => {
    try {
      const {ethereum} = window;
      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const userStakedTokens = await contract.stakeOf(currentAccount);
        setStakedTokens(userStakedTokens.toNumber());
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const transferTokens = async () => {
    try {
      const {ethereum} = window;
      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        await contract.transfer(addressTo, transferAmount);
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);
    }
  }


  const stakeTokens = async () => {
    try {
      const {ethereum} = window;
      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        await contract.createStake(BigNumber.from(stakeNumber));
        getStakedTokens();
        getTotalTokens();
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);
    }
  }


  const buyTokens = async () => {
    try {
      const {ethereum} = window;
      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        // call the buyToken function and pass message value
        await contract.buyToken(tokenNumber, {value:BigNumber.from(tokenNumber)});
        getTotalTokens();
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);
    }
  }


  const onTokenNumberChange = async (event) => {
    const {value} = event.target;
    setTokenNumber(value);
  }

  const onStakeNumberChange = async (event) => {
    const {value} = event.target;
    setStakeNumber(value);
  }

  const onAddressToChange = async (event) => {
    const {value} = event.target;
    setAddressTo(value);
  }

  const onTransferAmountChange = async (event) => {
    const {value} = event.target;
    setTransferAmount(value);
  }



  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      
    } catch (error) {
      console.log(error)
    }
  }




  React.useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  

  
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Ginger token says hi!
        </div>

        <div className="bio">
        hey there sailor. you are about to be filthy rich. just stake some tokens and watch your money grow
        </div>

        <h2>
          your total tokens: {totalTokens}
        </h2>
        <h2>
          your staked tokens: {stakedTokens}
        </h2>
        
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {currentAccount && (
          <form
          onSubmit ={(event)=>{
            event.preventDefault();
            buyTokens()
          }}>
  
            <input 
            type="text"
            placeholder="Enter number of tokens!"
            value={tokenNumber}
            onChange={onTokenNumberChange}
            />
            <button disabled ={tokenNumber ===0} type="submit" className="waveButton">
            Buy Tokens 
          </button>
  
            
          </form>
        )}

        {currentAccount && (

        <form
        onSubmit ={(event)=>{
          event.preventDefault();
          stakeTokens()
        }}>

          <input 
          type="text"
          placeholder="Enter number of tokens!"
          value={stakeNumber}
          onChange={onStakeNumberChange}
          />
          <button disabled ={stakeNumber ===0} type="submit" className="waveButton">
          Stake Tokens 
        </button>

          
        </form>

        )}

        {currentAccount && (
          <form
          onSubmit ={(event)=>{
            event.preventDefault();
            transferTokens()
          }}>
            
            <div className="transferInputs">
            <input 
            type="text"
            placeholder="Enter address to transfer tokens to!"
            value={addressTo}
            onChange={onAddressToChange}
            />
            </div>

            <div className="transferInputs">
            <input
            type = "text"
            placeholder="Enter the amount of tokens to transfer"
            value={transferAmount}
            onChange={onTransferAmountChange}
            />
            </div>

            <button disabled ={addressTo ===0} type="submit" className="waveButton">
            Transfer Tokens 
          </button>
  
            
          </form>
        )}

      </div>
    </div>
  );
}
