// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./dev/functions/FunctionsClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract CryptoShield is FunctionsClient, ConfirmedOwner, ReentrancyGuard {
  using Functions for Functions.Request;

  /**
   * un-used variables momentarily
   */
  // AggregatorV3Interface private priceFeedBTC;
  // AggregatorV3Interface private priceFeedLINK;
  AggregatorV3Interface private priceFeedETH;

  //
  bytes32 public latestRequestId;
  bytes public latestResponse;
  bytes public latestError;

  uint256 private requestCount = 0;
  uint256 private highRisk;
  uint256 private lowRisk;
  uint256 private closeRisk;
  uint256 private highPrice;
  uint256 private lowPrice;
  uint256 private closePrice;

  RequestType private lastRequestType;

  Functions.Request private priceRequest;
  Functions.Request private riskRequest;

  enum RequestType {
    PricePrediction,
    Risk
  }

  uint64 private constant _subscriptionId = 387;
  uint32 private constant _gasLimit = 300000;

  constructor(address oracle) FunctionsClient(oracle) ConfirmedOwner(msg.sender) {
    priceFeedETH = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
  }

  function executeRequest(
    string memory source,
    bytes memory secrets,
    string[] memory args,
    uint64 subscriptionId,
    uint32 gasLimit
  ) public onlyOwner returns (bytes32) {
    Functions.Request memory req;
    req.initializeRequest(Functions.Location.Inline, Functions.CodeLanguage.JavaScript, source);
    if (requestCount == 0) {
      priceRequest = req;
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

  function getLatestPriceETH() public view returns (int256) {
    (, int price, , , ) = priceFeedETH.latestRoundData();
    return price;
  }

  function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
    latestResponse = response;
    latestError = err;
    if (lastRequestType == RequestType.PricePrediction) {
      (highPrice, lowPrice, closePrice) = abi.decode(response, (uint256, uint256, uint256));
    } else if (lastRequestType == RequestType.Risk) {
      (highRisk, lowRisk, closeRisk) = abi.decode(response, (uint256, uint256, uint256));
    }
  }

  function fetchPricePredict() private returns (uint256, uint256, uint256) {
    Functions.Request memory req;
    req = priceRequest;
    bytes32 assignedReqID = sendRequest(req, _subscriptionId, _gasLimit);
    lastRequestType = RequestType.PricePrediction;
    latestRequestId = assignedReqID;
    return (highPrice, lowPrice, closePrice);
  }

  // function to request risk stored in the api server.
  // It returns the price predict from the current date. Data has 15 decimals
  function fetchRisk() private returns (uint256, uint256, uint256) {
    Functions.Request memory req;
    req = riskRequest;
    bytes32 assignedReqID = sendRequest(req, _subscriptionId, _gasLimit);
    lastRequestType = RequestType.Risk;
    latestRequestId = assignedReqID;
    return (highRisk, lowRisk, closeRisk);
  }
}
