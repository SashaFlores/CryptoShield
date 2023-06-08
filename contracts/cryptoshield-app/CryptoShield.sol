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

  // subscription state variables
  uint64 private constant _subscriptionId = 387;
  uint32 private constant _gasLimit = 300000;

  /**
   * @dev the daily data returned by API
   */
  struct DailyData {
    uint256 highPrice;
    uint256 lowPrice;
    uint256 closePrice;
    uint16 highRisk;
    uint16 lowRisk;
    uint16 closeRisk;
  }

  DailyData private dailyData;

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
    sendRequest(req, _subscriptionId, _gasLimit);
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
    if (secrets.length > 0) {
      req.addRemoteSecrets(secrets);
    }
    if (args.length > 0) req.addArgs(args);

    bytes32 assignedReqID = sendRequest(req, subscriptionId, gasLimit);
    return assignedReqID;
  }

  function getQuote(uint256 amount) public returns (uint16, uint16, uint16, uint256, uint256, uint256) {
    int256 currentPriceInt = getLatestPrice();
    uint256 currentPrice = currentPriceInt >= 0 ? uint256(currentPriceInt) : 0;

    if (currentPrice > dailyData.highPrice) {
      uint256 priceDifference = currentPrice - dailyData.highPrice;

      // Update the risk values
      dailyData.highRisk += uint16(priceDifference);
      dailyData.lowRisk += uint16(priceDifference);
      dailyData.closeRisk += uint16(priceDifference);

      uint256 premiumHighRisk = _estimatePremium(amount, dailyData.highRisk);
      uint256 premiumLowRisk = _estimatePremium(amount, dailyData.lowRisk);
      uint256 premiumCloseRisk = _estimatePremium(amount, dailyData.closeRisk);

      return (
        dailyData.highRisk,
        dailyData.lowRisk,
        dailyData.closeRisk,
        premiumHighRisk,
        premiumLowRisk,
        premiumCloseRisk
      );
    } else {
      uint256 premiumHighRisk = _estimatePremium(amount, dailyData.highRisk);
      uint256 premiumLowRisk = _estimatePremium(amount, dailyData.lowRisk);
      uint256 premiumCloseRisk = _estimatePremium(amount, dailyData.closeRisk);
      return (
        dailyData.highRisk,
        dailyData.lowRisk,
        dailyData.closeRisk,
        premiumHighRisk,
        premiumLowRisk,
        premiumCloseRisk
      );
    }
  }

  function selectPolicy(uint16 risk) public payable virtual {
    require(
      risk == dailyData.highRisk || risk == dailyData.lowRisk || risk == dailyData.closeRisk,
      "CryptoShield: risk selected out of range"
    );

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

  // callback function called by the chainlink nodes once they have fetched the information requested.
  function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
    (
      dailyData.highPrice,
      dailyData.lowPrice,
      dailyData.closePrice,
      dailyData.highRisk,
      dailyData.lowRisk,
      dailyData.closeRisk
    ) = abi.decode(response, (uint256, uint256, uint256, uint16, uint16, uint16));

    emit OCRResponse(requestId, response, err);
  }

  function _estimatePremium(uint256 amount, uint16 selectedRisk) private pure returns (uint256) {
    // Calculate the premium based on the amount and selected risk
    uint256 premium = (amount * uint256(selectedRisk)) / 100;
    return premium;
  }

  function updateOracleAddress(address oracle) public onlyOwner {
    setOracle(oracle);
  }

  function addSimulatedRequestId(address oracleAddress, bytes32 requestId) public onlyOwner {
    addExternalRequest(oracleAddress, requestId);
  }
}
