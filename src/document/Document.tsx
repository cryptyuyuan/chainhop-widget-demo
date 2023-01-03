import "./Document.css";
import docStep5Image from "../images/step5.png";
import { widgetConfig } from "../const";

export default function Document(): JSX.Element {
  const widgetConfigStr = `${JSON.stringify(widgetConfig, null, 2)}`;
  const ifameStr = JSON.stringify(
    `<iframe title='chainhop' name='iframeName' className='chainhop-iframe' id='iframeId'  src={dappUrl} scrolling='no' ref={iframeRef} ></iframe>`
  );
  return (
    <div className="content-block">
      <div className="state-content">
        <div className="tutorial-teach item-block">
          <div className="step">
            <h3>Step 1: Configuration Setting</h3>
            <p>Refer code: Metamask // Name of your Dapp</p>
            <p>Domain: domain of your Dapp</p>
            <p>{`Swap mode: 0 ===> Simple Mode, 1 ===> Classic Mode, 2 ===> Simple and Classic`}</p>
            <p>
              Chains: Swap-supported chains. ChainHop widget will use all
              supported chains if chains are not specified.
            </p>
            <p>TokenList: Swap-supported tokens.</p>
            <h5>eg:testConfig </h5>
            <pre id="configJson">{widgetConfigStr}</pre>
          </div>
          <div className="step">
            <h3>
              Step 2: Receive and send messages and implement the following
              methods
            </h3>
            <p> • get_widgetConfig</p>
            <p> • wallet_connect</p>
            <p> • eth_chainId</p>
            <p> • eth_accounts</p>
            <p> • eth_requestAccounts</p>
            <p> • wallet_switchEthereumChain</p>
            <p> • eth_sendTransaction</p>
            <p> •eth_getBalance</p>
            <p> • eth_call</p>
            <p> • eth_getTransactionReceipt</p>
            <p> • eth_blockNumber</p>
            <p> • eth_estimateGas</p>
            <p> • eth_getTransactionByHash</p>
          </div>
          <div className="step">
            <h3>Step 3: Import ChainHop Widget through iFrame</h3>
            <p id="iframeStr">eg: {ifameStr} </p>
          </div>
          <div className="step">
            <h3>Step 4: Request to add your domain to ChainHop whitelist</h3>
          </div>
          <div className="step">
            <h3>Step 5: Verify your integration</h3>
            <div className="step-img-block">
              <img className="step-img" src={docStep5Image} alt="xxx" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
