import '../styles/Dashboard.css'
import btcLogo from "../assets/btc-logo.png";
import ethLogo from "../assets/eth-logo.png";
import polygonLogo from "../assets/polygon-logo.png";

const Dashboard = () => {
  return (
    <div>
        <div className="container pt-5">
          <div className="row align-items-stretch">
            <div className="c-dashboardInfo col-lg-3 col-md-6">
              <div className="wrap">
                <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">Total Balance<svg
                    className="MuiSvgIcon-root-19" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z">
                    </path>
                  </svg></h4><span className="hind-font caption-12 c-dashboardInfo__count">BTC 0.74</span>
              </div>
            </div>
            <div className="c-dashboardInfo col-lg-3 col-md-6">
              <div className="wrap">
                <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">Total Spending<svg
                    className="MuiSvgIcon-root-19" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z">
                    </path>
                  </svg></h4><span className="hind-font caption-12 c-dashboardInfo__count">ETH 4.2</span><span
                  className="hind-font caption-12 c-dashboardInfo__subInfo">Last month: 0.2 ETH </span>
              </div>
            </div>
            <div className="c-dashboardInfo col-lg-3 col-md-6">
              <div className="wrap">
                <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">Balance<svg
                    className="MuiSvgIcon-root-19" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z">
                    </path>
                  </svg></h4><span className="hind-font caption-12 c-dashboardInfo__count">SHIB 505</span>
              </div>
            </div>
            <div className="c-dashboardInfo col-lg-3 col-md-6">
              <div className="wrap">
                <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">Saved<svg
                    className="MuiSvgIcon-root-19" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z">
                    </path>
                  </svg></h4><span className="hind-font caption-12 c-dashboardInfo__count">6,40%</span>
              </div>
            </div>
          </div>
        </div>
        <br />
        <h2 >Live Crypto Price..</h2><br/>
        <table className="table table-hover">
        <thead>
          <tr>
            <th>Token</th>
            <th>Blockchain</th>
            <th>Price</th>
            <th>Live Feed</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <span>
                {" "}
                <img src={btcLogo} alt="" />{" "}
              </span>Bitcoin
            </td>
            <td>
              <span>
                {" "}
                <img src={polygonLogo} alt="" />{" "}
              </span>Polygon
            </td>
            <td>0.015 BTC</td>
            <td>📉📈</td>
          </tr>
          <tr>
            <td>
              <span>
                {" "}
                <img src={ethLogo} alt="" />{" "}
              </span>Ethereum
            </td>
            <td>
              <span>
                {" "}
                <img src={polygonLogo} alt="" />{" "}
              </span>Polygon
            </td>
            <td>2.15 ETH</td>
            <td>📉📈</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
