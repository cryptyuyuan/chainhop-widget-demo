/* eslint-disable camelcase */
import { Button, Dropdown, Menu, Typography } from "antd";
import { useState } from "react";
import { CHAIN_LIST, getNetworkById } from "../const";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import "./Header.css";

export default function HeaderChain(): JSX.Element {
  const { chainId, network } = useWeb3Context();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleSelectChain = async (id: number) => {
    if (id !== chainId) {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${id.toString(16)}` }],
      });
    }
    setMenuVisible(false);
  };

  const menu = (
    <Menu className="headerChainDropDownMenu">
      {CHAIN_LIST?.map((item) => {
        return (
          <Menu.Item
            className="Item"
            key={item.chainId}
            onClick={() => {
              handleSelectChain(item.chainId);
            }}
          >
            <div
              className={
                item.chainId === chainId ? "chainItemSelect" : "chainItem"
              }
            >
              <Typography.Text className="chainName" ellipsis={{ suffix: "" }}>
                {item.name}
              </Typography.Text>
            </div>
          </Menu.Item>
        );
      })}
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
            ? "headerChainItemBg headerChainItemBgSelected"
            : "headerChainItemBg"
        }
      >
        <Button className="moreChainBtn" type="text">
          <span className="chainName">
            {getNetworkById(chainId)?.name !== "--"
              ? getNetworkById(chainId)?.name
              : network}
          </span>
          <span className={menuVisible ? "triangleUp" : "triangleDown"} />
        </Button>
      </div>
    </Dropdown>
  );
}
