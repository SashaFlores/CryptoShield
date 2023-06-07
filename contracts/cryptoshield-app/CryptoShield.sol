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
    uint8 highRisk;
    uint8 lowRisk;
    uint8 closeRisk;
  }

  DailyData private dailyData;

  event OCRResponse(bytes32 indexed requestId, bytes result, bytes err);

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

  function getQuote(uint256 amount) public returns (uint256) {}

  function selectPolicy(uint256 risk) public {}

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
    ) = abi.decode(response, (uint256, uint256, uint256, uint8, uint8, uint8));

    emit OCRResponse(requestId, response, err);
  }

  function updateOracleAddress(address oracle) public onlyOwner {
    setOracle(oracle);
  }

  function addSimulatedRequestId(address oracleAddress, bytes32 requestId) public onlyOwner {
    addExternalRequest(oracleAddress, requestId);
  }
}
