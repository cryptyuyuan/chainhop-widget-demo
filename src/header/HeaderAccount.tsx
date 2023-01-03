import { Button, Dropdown, Menu, Typography } from "antd";
import { useState } from "react";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import "./Header.css";

export default function HeaderAccount(): JSX.Element {
  const { address, web3Modal, loadWeb3Modal, logoutOfWeb3Modal } =
    useWeb3Context();
  const [menuVisible, setMenuVisible] = useState(false);

  const onConnectButton = async () => {
    await loadWeb3Modal("injected");
  };

  if (web3Modal.cachedProvider !== "") {
    const menu = (
      <Menu className="dropDownMenu">
        <Menu.Item
          className="logoutBtn"
          key="logout"
          onClick={() => {
            logoutOfWeb3Modal();
            setMenuVisible(false);
          }}
        >
          <div className="disconnect">Disconnect</div>
        </Menu.Item>
      </Menu>
    );
    return (
      <Dropdown
        overlay={menu}
        trigger={["click"]}
        onVisibleChange={(visible) => {
          setMenuVisible(visible);
        }}
      >
        <div
          className={
            menuVisible
              ? "headerItemBga headerItemBgaSelected"
              : "headerItemBga"
          }
        >
          <Button className="addressBtn" type="text">
            <Typography.Text
              className="addressText"
              ellipsis={{ suffix: address.slice(-4) }}
            >
              {address}
            </Typography.Text>
            <span className="indicator" />
          </Button>
        </div>
      </Dropdown>
    );
  }

  return (
    <>
      <Button
        type="text"
        className="connectWalletBtn"
        onClick={onConnectButton}
      >
        Connect Wallet
      </Button>
    </>
  );
}
