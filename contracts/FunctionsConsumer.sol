// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import { chainlink } from "hardhat";
import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/FunctionsClient.sol";   // Delete this line if you run this smart contract outside the chainlink functions hardhat kit and discomment the line below
import {Functions} from "@chainlink/contracts/src/v0.8/functions/Functions.sol"; 
// import "@chainlink/contracts/src/v0.8/dev/functions/FunctionsClient.sol";      // Discomment this when you are going to deploy this smart contract outside the chainlink functions kit 
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract FunctionsConsumer is FunctionsClient, ConfirmedOwner {
  using Functions for Functions.Request;

  AggregatorV3Interface internal priceFeedETH;
  AggregatorV3Interface internal priceFeedBTC;
  AggregatorV3Interface internal priceFeedLINK;

  uint64 public constant c_subscriptionId = 387;
  uint32 public constant c_gasLimit = 300000;

  uint256 public highPricePrediction;
  uint256 public lowPricePrediction;
  uint256 public closePricePrediction;

  // These state variables will be internal or private to disable other people to see it
  uint256 public highRisk;
  uint256 public lowRisk;
  uint256 public closeRisk;

  bytes32 public latestRequestId;
  bytes public latestResponse;
  bytes public latestError;

  uint256 public requestCount = 0;

  enum RequestType {
    PricePrediction,
    Risk
  }

  RequestType public lastRequestType;

  Functions.Request public pricePredictionRequest;
  Functions.Request public riskRequest;

  event OCRResponse(bytes32 indexed requestId, bytes result, bytes err);

  constructor(address oracle) FunctionsClient(oracle) ConfirmedOwner(msg.sender) {
    priceFeedETH = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306); // Address ETH/USD
    priceFeedBTC = AggregatorV3Interface(0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43); // Address BTC/USD
    priceFeedLINK = AggregatorV3Interface(0xc59E3633BAAC79493d908e63626716e204A45EdF); // Address LINK/USD
  }

  /// @notice function to request price prediction stored in the api server. It returns the price predict from the current date. Data has 15 decimals
  function fetchPricePredict() public {
    Functions.Request memory req;
    req = pricePredictionRequest;
    bytes32 assignedReqID = sendRequest(req, c_subscriptionId, c_gasLimit);
    lastRequestType = RequestType.PricePrediction;
    latestRequestId = assignedReqID;
  }

  /// @notice function to request risk stored in the api server. It returns the price predict from the current date. Data has 15 decimals
  function fetchRisk() public {
    Functions.Request memory req;
    req = riskRequest;
    bytes32 assignedReqID = sendRequest(req, c_subscriptionId, c_gasLimit);
    lastRequestType = RequestType.Risk;
    latestRequestId = assignedReqID;
  }

  /// @notice do NOT use this function, it is used to initialize the requests
  function executeRequest(
    string memory source,
    bytes memory secrets,
    string[] memory args,
    uint64 subscriptionId,
    uint32 gasLimit
  ) public returns (bytes32) {
    Functions.Request memory req;
    req.initializeRequest(Functions.Location.Inline, Functions.CodeLanguage.JavaScript, source);
    if (requestCount == 0) {
      pricePredictionRequest = req;
    } else if (requestCount == 1) {
      riskRequest = req;
    }
    if (secrets.length > 0) {
      req.addRemoteSecrets(secrets);
    }
    if (args.length > 0) req.addArgs(args);

    bytes32 assignedReqID = sendRequest(req, subscriptionId, gasLimit);
    latestRequestId = assignedReqID;
    requestCount++;
    return assignedReqID;
  }

  /// @notice callback function called by the chainlink nodes once they have fetched the information requested.
  ///       You can write the code to execute once the requested date has been received inside the if conditionals
  function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
    latestResponse = response;
    latestError = err;
    if (lastRequestType == RequestType.PricePrediction) {
      (highPricePrediction, lowPricePrediction, closePricePrediction) = abi.decode(
        response,
        (uint256, uint256, uint256)
      );
      // code to execute once price prediction has been received.
    } else if (lastRequestType == RequestType.Risk) {
      (highRisk, lowRisk, closeRisk) = abi.decode(response, (uint256, uint256, uint256));
      // code to execute once risk has been received.
    }
    emit OCRResponse(requestId, response, err);
  }

  /// @notice Function to retrieve the ETH/USD price from chainlink price feed
  function getLatestPriceETH() public view returns (int256) {
    (, int price, , , ) = priceFeedETH.latestRoundData();
    return price;
  }

  /// @notice Function to retrieve the BTC/USD price from chainlink price feed
  function getLatestPriceBTC() public view returns (int256) {
    (, int price, , , ) = priceFeedBTC.latestRoundData();
    return price;
  }

  /// @notice Function to retrieve the LINK/USD price from chainlink price feed
  function getLatestPriceLINK() public view returns (int256) {
    (, int price, , , ) = priceFeedLINK.latestRoundData();
    return price;
  }

  function resetPricePredicts() public {
    highPricePrediction = 0;
    lowPricePrediction = 0;
    closePricePrediction = 0;
  }

  function resetRisks() public {
    highRisk = 0;
    lowRisk = 0;
    closeRisk = 0;
  }

  function updateOracleAddress(address oracle) public onlyOwner {
    setOracle(oracle);
  }

  function addSimulatedRequestId(address oracleAddress, bytes32 requestId) public onlyOwner {
    addExternalRequest(oracleAddress, requestId);
  }
}