import HeaderAccount from "./HeaderAccount";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import HeaderChain from "./HeaderChain";
import "./Header.css";
export default function Header(): JSX.Element {
  const { web3Modal, address } = useWeb3Context();
  return (
    <div>
      <div className="swapheader">
        <div className="extra">
          {web3Modal.cachedProvider !== "" && <HeaderChain />}
          <HeaderAccount />
        </div>
      </div>
      <div>
        <p>user address: {address}</p>
      </div>
    </div>
  );
}
