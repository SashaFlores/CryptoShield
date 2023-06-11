// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./Insured.sol";
import "../dev/functions/FunctionsClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

contract CryptoShield is FunctionsClient, ConfirmedOwner, AutomationCompatibleInterface, Insured {
  using Functions for Functions.Request;

  /**
   * un-used variables momentarily
   * AggregatorV3Interface private priceFeedBTC;
   * AggregatorV3Interface private priceFeedLINK;
   */
  // ETH price aggregator on sepolia
  AggregatorV3Interface private priceFeedETH;

  // automation state variables (keepers)
  uint private constant INTERVAL = 1 days;
  uint private lastTimeStamp;

  // functions consumer variables
  bytes32 public latestRequestId;
  bytes public latestResponse;
  bytes public latestError;

  // subscription state variables
  uint64 private constant _subscriptionId = 387;
  uint32 private constant _gasLimit = 300000;

  Functions.Request public s_request;
  bool public fetching = true;

  /**
   * @dev the daily data returned by API from ML Predictions
   */
  uint256 public highPrice;
  uint256 public lowPrice;
  uint256 public closePrice;
  uint256 public highRisk;
  uint256 public lowRisk;
  uint256 public closeRisk;

  event OCRResponse(bytes32 indexed requestId, bytes result, bytes err);
  event PremiumReceived(address sender, uint256 premium);

  constructor(address oracle) FunctionsClient(oracle) ConfirmedOwner(msg.sender) {
    priceFeedETH = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
  }

  /**
   * receive function to accept ETH.
   */
  receive() external payable {
    emit FundsReceived(msg.sender, msg.value, address(this).balance);
  }

  /**
   * @dev this function is what the chainlink keeper checks before executing performUpkeep.
   * It just looks if it has passed 1 day before last timestamp
   */
  function checkUpkeep(
    bytes calldata /* checkData */
  ) external view override returns (bool upkeepNeeded, bytes memory /* performData */) {
    upkeepNeeded = (block.timestamp - lastTimeStamp) > INTERVAL;
  }

  /**
   * @dev this function is what chainlink keepers execute once a day has passed.
   * It only executes a request to get the data from our api
   */
  function performUpkeep(bytes calldata /* performData */) external override {
    if ((block.timestamp - lastTimeStamp) > INTERVAL) {
      lastTimeStamp = block.timestamp;
      fetchData();
    }
  }

  /**
   * @dev this is the only function to get the data from our server
   * it fetches all 6 parameters
   */
  function fetchData() public {
    Functions.Request memory req;
    req = s_request;
    sendRequest(req, _subscriptionId, _gasLimit);
    fetching = true;
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
    s_request = req;
    if (secrets.length > 0) {
      req.addRemoteSecrets(secrets);
    }
    if (args.length > 0) req.addArgs(args);

    bytes32 assignedReqID = sendRequest(req, subscriptionId, gasLimit);
    latestRequestId = assignedReqID;
    return assignedReqID;
  }

  function getQuote(uint256 amount) public view returns (uint256, uint256, uint256, uint256, uint256, uint256) {
    require(!fetching, "CryptoShield: Daily data is being fetched");
    int256 currentPriceInt = getLatestPrice();
    uint256 currentPrice = currentPriceInt >= 0 ? uint256(currentPriceInt) : 0;

    if (currentPrice > highPrice) {
      uint256 priceDifference = (currentPrice * 100) / highPrice - 100; // Calculate percentage difference
      highPrice = currentPrice;

      // Calculate risk based on the percentage difference
      uint256 riskChange = (highRisk * priceDifference) / 100;

      // Update the risk values
      highRisk += riskChange;
      lowRisk += riskChange;
      closeRisk += riskChange;
    }

    uint256 premiumHighRisk = _estimatePremium(amount, highRisk);
    uint256 premiumLowRisk = _estimatePremium(amount, lowRisk);
    uint256 premiumCloseRisk = _estimatePremium(amount, closeRisk);

    return (highRisk, lowRisk, closeRisk, premiumHighRisk, premiumLowRisk, premiumCloseRisk);
  }

  function selectPolicy(uint256 risk) public payable virtual {
    require(risk == highRisk || risk == lowRisk || risk == closeRisk, "CryptoShield: risk selected out of range");

    uint256 amount = msg.value; // Amount to be insured
    uint256 premium = _estimatePremium(amount, risk); // Calculate the premium based on amount and risk
    require(msg.value >= amount + premium, "CryptoShield: insufficient premium & insured amount");

    // Separate the payments
    uint256 insuranceAmount = amount;
    uint256 premiumAmount = premium;
    // Make the first payment for the insured amount
    _startPolicy(msg.sender, insuranceAmount, premium, risk);

    // Make the second payment for the premium amount
    (bool success, ) = (address(this)).call{value: premiumAmount}("");
    require(success, "Insured: withdrawal failed");

    emit PremiumReceived(msg.sender, premiumAmount);
  }

  function getLatestPrice() public view virtual returns (int256) {
    (, int price, , , ) = priceFeedETH.latestRoundData();
    return price;
  }

  function updateOracleAddress(address oracle) public onlyOwner {
    setOracle(oracle);
  }

  function addSimulatedRequestId(address oracleAddress, bytes32 requestId) public onlyOwner {
    addExternalRequest(oracleAddress, requestId);
  }

  // callback function called by the chainlink nodes once they have fetched the information requested.
  function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
    latestResponse = response;
    latestError = err;
    (highPrice, lowPrice, closePrice, highRisk, lowRisk, closeRisk) = abi.decode(
      response,
      (uint256, uint256, uint256, uint256, uint256, uint256)
    );
    fetching = false;
    emit OCRResponse(requestId, response, err);
  }

  function _estimatePremium(uint256 amount, uint256 selectedRisk) private pure returns (uint256) {
    // Calculate the premium based on the amount and selected risk
    uint256 premium = (amount * uint256(selectedRisk)) / 100;
    return premium;
  }
}
