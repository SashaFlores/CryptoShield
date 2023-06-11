import "bootstrap/dist/css/bootstrap.min.css";
import Landing from "./Landing";
import { Route, Routes } from "react-router-dom";
import "./styles/Navbar.css";
import Dashboard from "./pages/Dashboard"
import Policies from "./pages/Policies"
import Settings from "./pages/Settings"
import PurchasePolicy from "./pages/PurchasePolicy";
import NavBar from "./components/Navbar";
import { Row, Col } from "react-bootstrap";
import React, { useState } from 'react';

function App() {

  const [quoteData, setQuoteData] = useState([0,0,0,0,0,0]);
  const [quoteAmount, setQuoteAmount] = useState(0);
  const [blockchainData, setBlockchainData] = useState({token:"", duration:"", blockchain:""});

  return (
    <>
      <Landing quoteData={quoteData} setQuoteData={setQuoteData} quoteAmount={quoteAmount} setQuoteAmount={setQuoteAmount} blockchainData={blockchainData} setBlockchainData={setBlockchainData}/>
      {/* TODO: Navbar & routed pages reserved for AFTER linking wallet */}
      <Row>
        <Col xs={2}>
          <NavBar />
        </Col>
        <Col>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="/purchase" element={<PurchasePolicy quoteData={quoteData} setQuoteData={setQuoteData} quoteAmount={quoteAmount} setQuoteAmount={setQuoteAmount} blockchainData={blockchainData} setBlockchainData={setBlockchainData}/>} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Col>
      </Row>
    </>
  );
}

export default App;
