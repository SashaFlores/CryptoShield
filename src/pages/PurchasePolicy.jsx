import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import '../styles/Landing.css'
import { ethers } from "../ethers-5.6.esm.min.js"
import { abi, contractAddress } from "../constants.js"

import Modal from "react-bootstrap/Modal";

const PurchasePolicy = ({quoteData, setQuoteData, quoteAmount, setQuoteAmount, blockchainData, setBlockchainData}) => {
  const [show, setShow] = useState(false);
  const [buttonText, setButtonText] = useState("Proceed");
  const [manualSelector, setManualSelector] = useState("manual");
  const [risk, setRisk] = useState("--Select Risk--")

  useEffect(()=>{
    if(quoteData!=""){
      setManualSelector("filled");
    }
  }, [])

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const add = (A, B) => {
    const AL = A.length
    const BL = B.length
    const ML = Math.max(AL, BL)
  
    let carry = 0, sum = ''
  
    for (let i = 1; i <= ML; i++) {
      let a = +A.charAt(AL - i)
      let b = +B.charAt(BL - i)
  
      let t = carry + a + b
      carry = t/10 |0
      t %= 10
  
      sum = (i === ML && carry)
        ? carry*10 + t + sum
        : t + sum
    }
  
    return sum
  }

  const selectPolicyFunction = async () =>{
    const ethAmount = document.getElementById("policyAmount").value
    const policyBlockchain = document.getElementById("policyBlockchain").value
    const policyDuration = document.getElementById("policyDuration").value
    const policyToken = document.getElementById("policyToken").value
    const policyRisk = document.getElementById("policyRisk").value
    if(policyToken=="--Select Token--" || policyDuration=="--Select Duration--" || policyBlockchain=="--Select Blockchain--" || policyRisk=="--Select Risk--" || policyAmount==""){
      setButtonText("Empty field")
          setTimeout(()=>{
            setButtonText("Proceed");
          }, 2000
          )
    } else{
      console.log("Ready");
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
          const transactionResponse = await contract.selectPolicy(policyRisk, {
            value: ethAmount,
          })
          setButtonText("Executing transaction...")

          await transactionResponse.wait(1);
          setButtonText("Transaction success")
          setTimeout(()=>{
            setButtonText("Proceed");
          }, 2000
          )
        } catch (error) {
          console.log(error)
        }
      } else {
        setButtonText("Please install MetaMask");
      }
    }
  }

  const changeMode = () => {
    if(manualSelector=="filled"){
      setManualSelector("manual");
    } else{
      setManualSelector("filled");
    }
  }


  return (
    <div>
      <h1 className="text-center mb-5">Purchase Policy</h1>
      {manualSelector=="filled" ?       <><Form action="" method="post" role="form" className="php-email-form">
            <Row>
              <Button variant="link" size="lg" width="100%" onClick={changeMode}>
                {manualSelector=="filled" ? "Manual" : "Autocompleted"}
              </Button>
              <Col md={6}>
                <Form.Group controlId="tokenSelect">
                  <Form.Label>Token</Form.Label>
                  <Form.Control disabled as="select" id="policyToken" value={blockchainData.token}>
                    <option>--Select Token--</option>
                    <option>ETH</option>
                    <option>LINK</option>
                    <option>BTC</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="durationSelect">
                  <Form.Label>Duration</Form.Label>
                  <Form.Control disabled as="select" id="policyDuration" value={blockchainData.duration}>
                    <option>--Select Duration--</option>
                    <option>3 Month</option>
                    <option>6 Month</option>
                    <option>9 Month</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="blockchainSelect">
                  <Form.Label>Blockchain</Form.Label>
                  <Form.Control disabled as="select" id="policyBlockchain" value={blockchainData.blockchain}>
                    <option>--Select Blockchain--</option>
                    <option>Sepolia</option>
                    <option>Ethereum</option>
                    <option>Polygon</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="riskSelect">
                  <Form.Label>Risk</Form.Label>
                  <Form.Control as="select" id="policyRisk" onChange={()=>{setRisk(document.getElementById("policyRisk").value)}}>
                    <option>--Select Risk--</option>
                    <option>{(quoteData[0]/10**15).toString().substring(0,5)}</option>
                    <option>{(quoteData[1]/10**15).toString().substring(0,5)}</option>
                    <option>{(quoteData[2]/10**15).toString().substring(0,5)}</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="amountInput">
                  <Form.Label>Amount + Premium</Form.Label>
                  {console.log(quoteAmount.toString())}
                  <Form.Control disabled type="text" className="form-control" id="policyAmount" value={document.getElementById("policyRisk").value===(quoteData[0]/10**15).toString().substring(0,5) ? ethers.utils.formatEther(add(quoteAmount.toString(),quoteData[3])).substring(0,8) : (document.getElementById("policyRisk").value===(quoteData[1]/10**15).toString().substring(0,5) ? ethers.utils.formatEther(add(quoteAmount.toString(),quoteData[4])).substring(0,8) : (document.getElementById("policyRisk").value===(quoteData[2]/10**15).toString().substring(0,5) ? ethers.utils.formatEther(add(quoteAmount.toString(),quoteData[5])).substring(0,8) : ""))}/>
                </Form.Group>
              </Col>
            </Row>
            <div className="text-center"><br/>
              <Button type="button" onClick={selectPolicyFunction} variant="success" className="btn-get-started scrollto" style={{ float: 'right' }}>
                {buttonText}
              </Button>
            </div>
          </Form>
          <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Purchase Summary</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="d-grid gap-2">
              
            </div>
          </Modal.Body>

        <Modal.Footer>
          <Button variant="link" size="lg" width="100%" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
     </Modal></> : 
           <><Form action="" method="post" role="form" className="php-email-form">
           <Row>
             <Button variant="link" size="lg" width="100%" onClick={changeMode}>
               {manualSelector=="filled" ? "Manual" : "Autocompleted"}
             </Button>
             <Col md={6}>
               <Form.Group controlId="tokenSelect">
                 <Form.Label>Token</Form.Label>
                 <Form.Control as="select" id="policyToken" value={blockchainData.token}>
                   <option>--Select Token--</option>
                   <option>ETH</option>
                   <option>LINK</option>
                   <option>BTC</option>
                 </Form.Control>
               </Form.Group>
             </Col>
             <Col md={6}>
               <Form.Group controlId="durationSelect">
                 <Form.Label>Duration</Form.Label>
                 <Form.Control as="select" id="policyDuration" value={blockchainData.duration}>
                   <option>--Select Duration--</option>
                   <option>3 Month</option>
                   <option>6 Month</option>
                   <option>9 Month</option>
                 </Form.Control>
               </Form.Group>
             </Col>
             <Col md={6}>
               <Form.Group controlId="blockchainSelect">
                 <Form.Label>Blockchain</Form.Label>
                 <Form.Control as="select" id="policyBlockchain" value={blockchainData.blockchain}>
                   <option>--Select Blockchain--</option>
                   <option>Sepolia</option>
                   <option>Ethereum</option>
                   <option>Polygon</option>
                 </Form.Control>
               </Form.Group>
             </Col>
             <Col md={6}>
               <Form.Group controlId="riskSelect">
                 <Form.Label>Risk</Form.Label>
                 <Form.Control as="select" id="policyRisk">
                   <option>--Select Risk--</option>
                   <option>{(quoteData[0]/10**15).toString().substring(0,5)}</option>
                   <option>{(quoteData[1]/10**15).toString().substring(0,5)}</option>
                   <option>{(quoteData[2]/10**15).toString().substring(0,5)}</option>
                 </Form.Control>
               </Form.Group>
             </Col>
             <Col md={6}>
               <Form.Group controlId="amountInput">
                 <Form.Label>Amount + Premium</Form.Label>
                 <Form.Control type="text" className="form-control" id="policyAmount"/>
               </Form.Group>
             </Col>
           </Row>
           <div className="text-center"><br/>
             <Button type="button" onClick={selectPolicyFunction} variant="success" className="btn-get-started scrollto" style={{ float: 'right' }}>
               {buttonText}
             </Button>
           </div>
         </Form>
         <Modal show={show} onHide={handleClose}>
         <Modal.Header closeButton>
           <Modal.Title>Purchase Summary</Modal.Title>
         </Modal.Header>

         <Modal.Body>
           <div className="d-grid gap-2">
             
           </div>
         </Modal.Body>

       <Modal.Footer>
         <Button variant="link" size="lg" width="100%" onClick={handleClose}>
           Close
         </Button>
       </Modal.Footer>
    </Modal></>}

    </div>
  );
};

export default PurchasePolicy;
