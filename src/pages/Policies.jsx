import btcLogo from "../assets/btc-logo.png";
import ethLogo from "../assets/eth-logo.png";
import polygonLogo from "../assets/polygon-logo.png";

const Policies = () => {
  return (
    <div>
      <h1 className="text-center mb-5">Policies</h1>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Token</th>
            <th>Blockchain</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Coverage</th>
            <th>Balance</th>
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
            <td>May 5 2003</td>
            <td>August 5 2003</td>
            <td>12%</td>
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
            <td>May 5 2003</td>
            <td>August 5 2003</td>
            <td>20%</td>
            <td>2.15 ETH</td>
            <td>📉📈</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Policies;
