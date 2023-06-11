# CryptoShield

![crypto](./coins/CryptoShield.png)

## **Source of Our Inspiration**

*The inherent volatility of cryptocurrencies and the absence of robust government regulations to safeguard individuals' hard-earned money from scams, rug pulls, and unreliable entities have constrained the widespread acceptance of digital currencies. As a result, their global adoption remains limited.* 

*The unpredictable nature of cryptocurrency markets, coupled with the absence of legal frameworks to hold fraudulent actors accountable, has created an environment where investors face significant risks. Consequently, individuals and businesses alike hesitate to fully embrace digital coins as a reliable medium of exchange and store of value. The lack of credibility and investor protection acts as a barrier, hindering the broader acceptance of cryptocurrencies on a global scale.*


## **Functionality and Features**

>[CryptoShield](https://cryptoshield-app.netlify.app/) aims to provide a secure solution for cryptocurrency investors and enthusiasts by mitigating risks and offering peace of mind.


We have introduced a unique concept of insuring digital coins, similar to how celebrities insure their valuable body parts.

*CryptoShield offers three tiers of risk coverage for the entire insurance period. In the event that the price of the insured coin drops from its initial value at the time of insurance issuance, our app compensates the insured individual for the price difference, up to the coverage limit chosen.*


*we thought of providing a way to secure cryptocurrencies investors & enthusatists to eliminate risk and gave them peace of mind to some extend.*

*With CryptoShield, investors can protect their investments and reduce potential losses associated with cryptocurrency volatility.*

## **Approach to Building CryptoShield**
We utilize AI and blockchain technologies to provide risk coverage for investors. This documentation outlines the key components and tools used in developing the project:

- AI-Based Price Prediction:

    *To predict coin behavior, we implemented AI algorithms, specifically LSTM Recurrent Neural Networks. These networks simulate prices based on historical data and market trends, enabling us to forecast coin prices until the end of 2023. This prediction model forms the basis for estimating potential risks and determining insurance coverage.*

- Risk Prediction with GARCH Model:

    *To complement our price prediction, we employed the GARCH (Generalized Autoregressive Conditional Heteroskedasticity) model. This statistical model helps predict and measure market risk by analyzing volatility patterns. By incorporating the GARCH model, we enhance the accuracy of risk assessment for insured assets.*

- Chainlink Integration for Real-Time Data:

    *We integrated Chainlink's Data Feed into our platform to fetch current cryptocurrency prices. This integration ensures that when end users request insurance quotes, the smart contract can make real-time estimations of premiums. By comparing predicted data from our AI models with actual market data obtained through Chainlink, we provide users with up-to-date and accurate premium calculations.*

- Chainlink Integration for AI Prediction Data:

    *To enable seamless access to AI prediction data, we utilized Chainlink's functions to fetch data from our custom API. This integration allows the smart contract to retrieve the latest AI predictions and use them for risk assessment and premium calculations. By leveraging Chainlink's secure and reliable infrastructure, we ensure the integrity and timeliness of the data utilized in our insurance platform.*


- Chainlink Keepers for Automation:

    *To automate the process of fetching data, we implemented Chainlink Keepers. These smart contract-based services monitor and trigger specific actions based on predefined conditions. In our case, Chainlink Keepers automate the data-fetching process, ensuring that AI prediction data and real-time market prices are regularly updated within the platform.*


> By leveraging AI, LSTM Recurrent Neural Networks, GARCH models, and integrating Chainlink's Data Feed, functions, and Keepers, we have built CryptoShield—a comprehensive cryptocurrency insurance platform that provides reliable risk coverage based on accurate price predictions and real-time market data.


## **Challenges Encountered**

- Achieving Accurate Predictions:

    *We diligently explored and implemented a wide range of supervised and unsupervised machine learning techniques, from Monte Carlo simulations to Recurrent Neural Networks. Our goal was to achieve the closest possible predictions to real data. Although challenging, this process was also highly enjoyable as we experimented with different methodologies.*

- Team Composition and UI Development:

    *Initially starting with a team of six developers, we eventually transitioned to a dedicated team with limited UI development experience. Despite the challenges, we successfully built the user interface, even though it may not have been perfect. Our team's perseverance and commitment were instrumental in overcoming this obstacle.*

- Estimating Insurance Premiums: 

    *While we observed a linear relationship between historical, current, and future trends, accurately estimating insurance premiums posed a significant challenge. Our aim was to strike a balance between covering costs and generating profits for the sustainable growth of our business, while still ensuring that all insured individuals can claim losses.*

- Incorporating Truflation and Smart Contract Challenges: 

    *We attempted to implement Truflation in our smart contract on Mumbai, but encountered challenges related to the new opcode of 0X5f. Overcoming this hurdle proved to be a complex task, requiring additional research and problem-solving to find alternative solutions.*

- Time Constraints and Economic Indicators: 

    *Due to limited project time and conflicting work schedules, we were unable to incorporate essential economic indicators such as inflation and GDP into our AI model. Although initially planned, time constraints prevented us from completing this aspect of the project.*

Despite these challenges, we persevered and made significant progress in implementing advanced machine learning techniques, addressing team dynamics, estimating insurance premiums, resolving smart contract issues, and managing time limitations. Our continuous dedication and problem-solving approach have been vital to the development of our project.



## **What's next for CryptoShield**

CryptoShield has achieved significant milestones, but there are exciting future developments planned to enhance the platform further. Here are some key areas of focus:

#### **Integrating NLP for Market Confidence:**

*To provide a comprehensive risk assessment, we plan to incorporate Natural Language Processing (NLP) techniques to analyze market sentiment indicators such as fear and greed Index to consider factors beyond price data, such as market cap, volume, and market confidence.*

*We aim to improve the accuracy of risk predictions and premium estimations.*

#### **Expansion of Supported Coins:** 

*While we have made considerable progress in covering a range of cryptocurrencies, our future roadmap will expand coverage to include other major coins such as BTC, LINK, MATIC, and AltCoins.* 

*By extending our insurance offerings to these popular cryptocurrencies, we aim to cater to a wider audience and provide comprehensive coverage options.*

#### **AI Integration with Economic Indicators:** 

*As mentioned previously, our initial plans to incorporate economic indicators such as inflation and GDP were not completed due to time constraints. However, it remains a crucial aspect of our development roadmap.* 

*By integrating AI models with economic indicators, we can enhance the accuracy of price predictions and risk assessments, providing a more holistic view of the market and enabling more precise premium calculations.*

#### **Continuous Improvement and Refinement:** 

*As the cryptocurrency landscape evolves, we recognize the need for ongoing improvements and refinements. We will continuously update and fine-tune our AI models, incorporating new techniques and algorithms to adapt to changing market conditions.* 

*Regular maintenance and updates will ensure that CryptoShield remains at the forefront of risk coverage in the cryptocurrency industry.*

#### **Implementing DAO Governance:** 

*We plan to implement a Decentralized Autonomous Organization (DAO) to govern the treasury pool, claims center, and any proposed improvements to the protocol. This will enable a decentralized and community-driven decision-making process.*

#### **Partnerships with Major DeFi Protocols:** 

*To provide more value to our users, we aim to form partnerships with major decentralized finance (DeFi) protocols.* 

*By collaborating with these platforms, we can offer our insurers opportunities to expand their profit margins through activities such as lending, borrowing, staking, flash loans, or utilizing our upcoming staking contract.*

>By focusing on NLP integration, expanding coin coverage, incorporating economic indicators, continuous improvement, implementing DAO governance, and establishing partnerships with DeFi protocols, CryptoShield aims to provide even more robust and comprehensive insurance services. These developments will empower users with accurate predictions, enhanced risk assessments, and a wider range of coverage options for their cryptocurrency investments.