// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title Insured
 * @author Sasha Flores
 * @notice contract meant to be inheited by
 * CrptoShield if client choose to service
 * to store all insured clients info.
 */
contract Insured is ReentrancyGuard {
  // ETH price aggregator on sepolia
  AggregatorV3Interface private constant priceFeedETH =
    AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);

  /**
   * @dev maps the insured address to the policies
   * array in the InsuranceSummary
   */
  mapping(address => uint256) private holders;
  // @dev array of all policy holders
  PolicyHolder[] private policyHolders;

  /**
   * store insured:
   * @param insured: user address
   * @param amount: amount insured
   * @param from: date insurance kicked in
   * @param to: date insurance expires
   * @param coverage: the risk coverage
   * @param price: ETH price at time of policy
   */
  struct Policy {
    address insured;
    uint256 amount;
    uint256 from;
    uint256 coverage;
    uint256 price;
    uint256 premium;
  }

  /**
   * @dev snapshot of insurance summary of a specific user
   * @param totalAmount: total amount insured
   * @param Insurance struct
   */
  struct PolicySummary {
    uint256 totalAmount;
    Policy[] policies;
  }

  /**
   * @dev Active Policy Holders
   */
  struct PolicyHolder {
    address insured;
    Policy[] userPolicies;
  }

  event PolicyStarted(address indexed insured, uint256 amount, uint256 index, uint256 startDate);
  event Withdrawal(address indexed insured, uint256 amount, uint256 timestamp);
  event FundsReceived(address indexed sender, uint256 amount, uint256 balance);

  /**
   * @dev this is a simple logic for the sake of the hackathon
   * @param policyIndex uint256: polic index
   */
  function withdraw(uint256 policyIndex) external payable nonReentrant {
    PolicyHolder memory policyHolder = policyHolders[holders[msg.sender]];
    require(policyIndex < policyHolder.userPolicies.length, "Insured: invalid policy index");

    Policy memory policy = policyHolder.userPolicies[policyIndex];
    require(policy.insured == msg.sender, "Insured: invalid policy owner");

    uint256 amount = policy.amount;
    uint256 initialPrice = policy.price;
    int256 currentPriceInt = getCurrentPrice();
    uint256 currentPrice = currentPriceInt >= 0 ? uint256(currentPriceInt) : 0;

    if (initialPrice < currentPrice) {
      uint256 priceDifference = currentPrice - initialPrice;
      // Calculate price difference as a percentage
      uint256 priceDifferencePercentage = ((priceDifference * 100) / initialPrice);
      // Convert policy coverage to a percentage
      uint256 coveragePercentage = policy.coverage;

      if (priceDifferencePercentage > coveragePercentage) {
        // Calculate the loss based on the coverage percentage
        uint256 loss = (amount * coveragePercentage) / 100;
        amount = amount + loss;
      } else {
        // Calculate the actual loss based on the price difference percentage
        uint256 loss = (amount * priceDifferencePercentage) / 100;
        amount = amount + loss;
      }
    }

    // Remove the policy from the userPolicies array
    Policy[] memory userPolicies = new Policy[](policyHolder.userPolicies.length - 1);
    uint256 index = 0;
    for (uint256 i = 0; i < policyHolder.userPolicies.length; i++) {
      if (i != policyIndex) {
        userPolicies[index] = policyHolder.userPolicies[i];
        index++;
      }
    }
    // Update the userPolicies array in the policyHolder struct
    policyHolder.userPolicies = userPolicies;

    (bool success, ) = payable(msg.sender).call{value: amount}("");
    require(success, "Insured: withdrawal failed");

    emit Withdrawal(msg.sender, amount, block.timestamp);
  }

  /**
   * @dev function to check if address is insured, returns summary of policies
   * @param user address of insured user if exists
   */
  function isInsured(address user) public view returns (PolicySummary memory) {
    uint256 index = holders[user];
    require(index != 0, "Insured: user is not insured");

    PolicyHolder memory policyHolder = policyHolders[index];
    PolicySummary memory summary;

    summary.policies = new Policy[](policyHolder.userPolicies.length);

    for (uint256 i = 0; i < policyHolder.userPolicies.length; i++) {
      Policy memory policy = policyHolder.userPolicies[i];
      summary.policies[i] = policy;
      summary.totalAmount += policy.amount;
    }

    return summary;
  }

  /**
   * @dev function to be called by CryptShield to start insurance.
   * @param user address: user address holding ETH
   * @param amount uint256: amount to be insured
   * @param risk uint256: level of risk coverage aganist fluctations
   */
  function _startPolicy(
    address user,
    uint256 amount,
    uint256 premium,
    uint256 risk
  ) internal virtual nonReentrant returns (uint256) {
    require(amount >= 1 ether, "Insured: min insured amount is 1 ETH");
    require(user != address(0), "Insured: unauthorized zero address");
    uint256 index = holders[user];
    if (index == 0) {
      PolicyHolder storage newPolicyHolder = policyHolders.push();
      newPolicyHolder.insured = user;
      index = policyHolders.length - 1;
      holders[user] = index;
    }

    int256 currentPrice = getCurrentPrice();
    uint256 price = currentPrice >= 0 ? uint256(currentPrice) : 0;

    policyHolders[index].userPolicies.push(Policy(user, amount, block.timestamp, risk, price, premium));

    emit PolicyStarted(user, amount, index, block.timestamp);

    return index;
  }

  function getCurrentPrice() private view returns (int256) {
    (, int price, , , ) = priceFeedETH.latestRoundData();
    return price;
  }

  /**
   * function claims() {
   * }
   */
}
