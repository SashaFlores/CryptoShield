import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import illustration from './assets/illustration.png'
import howItWorks1 from './assets/how it works1.jpg'
import howItWorks2 from './assets/how it works2.jpg'
import howItWorks3 from './assets/how it works3.jpg'
// import logo from './assets/logo.png'
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import metamask from "./assets/metamask.png";
import './styles/Landing.css'

import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

function Landing ({quoteData, setQuoteData, quoteAmount, setQuoteAmount, blockchainData, setBlockchainData}) {
  const [show, setShow] = useState(false);
  const [walletText, setWalletText] = useState("Connect Wallet");

  
  useEffect(()=>{
    const getAddress = async () => {
      const account = await ethereum;
      let network;
      if (account.networkVersion === "11155111"){
        network = "Sepolia"
      } else if(account.networkVersion === "137"){
        network = "Polygon"
      } else if(account.networkVersion === "1"){
        network = "Ethereum"
      } else if(account.networkVersion === "80001"){
        network = "Mumbai"
      }
      if(account.selectedAddress != "0x0000000000000000000000000000000000000000"){
        setWalletText("Connected  " + account.selectedAddress.substring(0,6)+"..."+account.selectedAddress.substring(account.selectedAddress.length-4)+" at "+network);
      }
    }
    getAddress();
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const connectWallet = async () =>{
    if (typeof window.ethereum !== "undefined") {
      try {
        await ethereum.request({ method: "eth_requestAccounts" })
      } catch (error) {
        console.log(error)
      }
      let objectEthereum = await ethereum;
      console.log(objectEthereum);
      const accounts = await ethereum.request({ method: "eth_accounts" })
      let network;
      if (objectEthereum.networkVersion === "11155111"){
        network = "Sepolia"
      } else if(objectEthereum.networkVersion === "137"){
        network = "Polygon"
      } else if(objectEthereum.networkVersion === "1"){
        network = "Ethereum"
      } else if(objectEthereum.networkVersion === "80001"){
        network = "Mumbai"
      }
      setWalletText(`Connected  ${accounts[0].substring(0,6)}...${accounts[0].substring(accounts[0].length-4)} at ${network}`);
      setShow(false)
    } else {
      setWalletText("Please install MetaMask");
    }
  }

  const getQuoteFunction = async () =>{
    const ethAmount = ethers.utils.parseEther(document.getElementById("quoteAmount").value)
    const quoteBlockchain = document.getElementById("quoteBlockchain").value
    const quoteDuration = document.getElementById("quoteDuration").value
    const quoteToken = document.getElementById("quoteToken").value
    if(quoteToken=="--Select Token--" || quoteDuration=="--Select Duration--" || quoteBlockchain=="--Select Blockchain--" || ethAmount==""){
      document.getElementById('quoteTextarea').value = "There is an empty field that must be filled";
    } else{
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        
        try {
          
          const transactionResponse = await contract.getQuote(ethAmount)
          document.getElementById('quoteTextarea').value = "Executing transaction..."
          await transactionResponse.wait(1);
          const rep1 = await contract.highRisk()
          const rep2 = await contract.lowRisk()
          const rep3 = await contract.closeRisk()
          const rep4 = await contract.highPrice()
          const rep5 = await contract.lowPrice()
          const rep6 = await contract.closePrice()
          setQuoteData([rep1.toString(), rep2.toString(), rep3.toString(), rep4.toString(), rep5.toString(), rep6.toString()])
          setQuoteAmount(ethAmount);
          const newBlockchainData = {token: quoteToken, duration: quoteDuration, blockchain: quoteBlockchain};
          setBlockchainData(newBlockchainData);
          const dataReceived = 
           `
           highRisk: ${(rep1/10**15).toString().substring(0,5)}
           lowRisk: ${(rep2/10**15).toString().substring(0,5)}
           closeRisk: ${(rep3/10**15).toString().substring(0,5)}
           premiumHighRisk: ${ethers.utils.formatEther(rep4).toString().substring(0,8)}
           premiumLowRisk: ${ethers.utils.formatEther(rep5).toString().substring(0,8)}
           premiumCloseRisk: ${ethers.utils.formatEther(rep6).toString().substring(0,8)}`
           document.getElementById('quoteTextarea').value = dataReceived;
        } catch (error) {
          console.log(error);
          document.getElementById('quoteTextarea').value = "Please connect your wallet";
        }
      } else {
        document.getElementById('quoteTextarea').value = "Please install MetaMask";
      }
    }
  }

  

return (
    <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Connect a wallet</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="d-grid gap-2">
              <Button
                variant="outline-primary"
                size="lg"
                width="100%"
                length="100%"
                onClick={connectWallet}
              >
                <img width={'30px'} src={metamask} className="" alt="" />
                Meta Mask
              </Button>
            </div>
          </Modal.Body>

        <Modal.Footer>
          <Button variant="link" size="lg" width="100%" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
     </Modal>
    <header id="header" className="fixed-top ">
      <div className="container d-flex align-items-center">
  
        <h1 className="logo me-auto"><a href="index.html">CryptoShield</a></h1>
        {/* <a href="index.html" className="logo me-auto">
            <img src={logo} alt="" className="img-fluid"/></a> */}
  
        <nav id="navbar" className="navbar">
          <ul>
            <li><a className="getstarted scrollto" href="#about" onClick={handleShow}>{walletText}</a></li>
          </ul>
          <i className="bi bi-list mobile-nav-toggle"></i>
        </nav>
  
      </div>
    </header>
    
      <section id="hero" className="d-flex align-items-center" style={{marginTop:'50px'}}>    
        <div className="container">
          <div className="row">
            <div className="col-lg-6 d-flex flex-column justify-content-center pt-4 pt-lg-0 order-2 order-lg-1" data-aos="fade-up" data-aos-delay="200">
              <h1>Protect your crypto from market fluctuations and inflation.</h1>
              <h2>Protect your cryptocurrencies from market fluctuations, inflation, and scams with CryptoShield - the decentralized insurance platform. Link your wallet now to get started.</h2>
              <div className="d-flex justify-content-center justify-content-lg-start">
                <a href="#getQoute" className="btn-get-started scrollto">Get Quote</a>
                <a href="#HowItWorks" className="glightbox btn-watch-video btn-outline-dark"><span>Learn More</span></a>
              </div>
            </div>
            <div className="col-lg-6 order-1 order-lg-2 hero-img" data-aos="zoom-in" data-aos-delay="200">
              <img src={illustration} className="img-fluid animated" alt=""/>
            </div>
          </div>
        </div>
    
      </section>
      <br/><br/>
      <section id="HowItWorks" className="skills">
      <div className="container" data-aos="fade-up">
      <div className="section-title">
          <h2>How it works</h2>
        </div>
        <div className="row">
          <div className="col-lg-6 d-flex align-items-center" data-aos="fade-right" data-aos-delay="100">
            <img src={howItWorks1} className="img-fluid" alt=""/>
          </div>
          <div className="col-lg-6 pt-4 pt-lg-0 content" data-aos="fade-left" data-aos-delay="100">
            <h3>Follow these steps</h3>
            <p className="fst-italic">
              
            </p>

            <div className="skills-content">
                <ul style={{ listStyleType: 'circle' }}>
                    <li><h4>Connect your wallet via MetaMask to access our protocol.</h4></li>
                    <li><h4>Select which token you’d like to insure and under which blockchain.</h4></li>
                    <li><h4>Then select a policy duration corresponding to the insured amount.</h4></li>
                </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <section id="skills" className="skills">
      <div className="container" data-aos="fade-up">

        <div className="row">
          <div className="col-lg-6 pt-4 pt-lg-0 content" data-aos="fade-left" data-aos-delay="100">
            <h3>Why Us</h3>
            <p className="fst-italic">
              
            </p>

            <div className="skills-content">
                <h4>Markets will fluctuate or crash and that’s where our signature ML algorithm comes in to protect your investment from further losses. 
                <br/>Think of it as adding a stop loss to your investment to mitigate further forfeiture.</h4>
            </div>
          </div>
          <div className="col-lg-6 d-flex align-items-center" data-aos="fade-right" data-aos-delay="100">
            <img src={howItWorks2} className="img-fluid" alt=""/>
          </div>
        </div>
      </div>
    </section>

    <section id="skills" className="skills">
      <div className="container" data-aos="fade-up">
        <div className="row">
          <div className="col-lg-6 d-flex align-items-center" data-aos="fade-right" data-aos-delay="100">
            <img src={howItWorks3} className="img-fluid" alt=""/>
          </div>
          <div className="col-lg-6 pt-4 pt-lg-0 content" data-aos="fade-left" data-aos-delay="100">           
            <h3>Why-Us</h3>
            <p className="fst-italic">
              
            </p>
            <div className="skills-content">
                <ul style={{ listStyleType: 'circle' }}>
                    <li><h4>We’ve got mid to long-term investors covered..</h4></li>
                    <li><h4>You can now invest in digital assets without worrying about holding empty bags.</h4></li>
                    <li><h4>Reduce stress and anxiety to focus on what really matters to you.</h4></li>
                </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="getQoute" className="contact">
      <div className="container" data-aos="fade-up">

        <div className="section-title">
          <h2>Get Quote</h2>
          <p></p>
        </div>

        <div className="row">
          <div className="col-lg-12 mt-5 mt-lg-0 d-flex align-items-stretch">
            <form action="forms/contact.php" method="post" role="form" className="php-email-form">
              <div className="row">
                <div className="form-group col-md-6">
                  <label >Token</label>
                  <select className="form-control" id="quoteToken">
                    <option>--Select Token--</option>
                  <option>ETH</option>
                  <option>LINK</option>
                  <option>BTC</option>
                  </select>
                </div>                
                <div className="form-group col-md-6">
                  <label>Select Duration</label>
                  <select className="form-control" id="quoteDuration">
                    <option>--Select Duration--</option>
                    <option>3 Month</option>
                    <option>6 Month</option>
                    <option>9 Month</option>
                  </select>
                </div>
                
                <div className="form-group col-md-6">
                  <label >Blockchain</label>
                  <select className="form-control" id="quoteBlockchain">
                    <option>--Select Blockchain--</option>
                    <option>Sepolia</option>
                    <option>Ethereum</option>
                    <option>Polygon</option>
                  </select>
                </div>                
                <div className="form-group col-md-6">
                  <label>Amount</label>
                  <input className="form-control" id="quoteAmount"/>
                </div>

              </div>
              <div className="form-group">
                <textarea disabled className="form-control" name="message" rows="7" id="quoteTextarea"></textarea>
              </div>
              <div className="my-3">
                <div className="loading">Loading</div>
                <div className="error-message"></div>
                <div className="sent-message">Total premium: 0.032ETH</div>
              </div>
              <div className="text-center"><button className="btn-get-started scrollto" type="button" onClick={getQuoteFunction}>Get Quote</button></div>
            </form>
          </div>
        </div>

      </div>
    </section>
      </>
);
}
export default Landing;