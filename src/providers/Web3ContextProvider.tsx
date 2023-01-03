import { message } from "antd";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAsync } from "react-use";

import Web3Modal from "@celer-network/web3modal";
import {
  JsonRpcProvider,
  JsonRpcSigner,
  Web3Provider,
} from "@ethersproject/providers";

const web3Modal = new Web3Modal({
  cacheProvider: true,
  network: "mainnet",
  providerOptions: {
    injected: {
      display: {
        name: "Injected",
        description: "Connect with the provider in your Browser",
      },
      package: null,
    },
  },
  theme: "dark",
});

interface Web3ContextProps {
  provider: JsonRpcProvider | undefined;
  signer: JsonRpcSigner | undefined;
  network: string;
  address: string;
  chainId: number;
  web3Modal: Web3Modal;
  connecting: boolean;
  reload: boolean;
  loadWeb3Modal: (providerName: string) => Promise<void>;
  logoutOfWeb3Modal: () => Promise<void>;
}

interface Web3ContextProviderProps {
  children: ReactNode;
}

export const Web3Context = createContext<Web3ContextProps>({
  provider: undefined,
  signer: undefined,
  address: "",
  network: "",
  chainId: 0,
  web3Modal,
  connecting: false,
  reload: false,
  loadWeb3Modal: async () => {},
  logoutOfWeb3Modal: async () => {},
});

export const Web3ContextProvider = ({
  children,
}: Web3ContextProviderProps): JSX.Element => {
  const [provider, setProvider] = useState<JsonRpcProvider>();
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const [network, setNetwork] = useState("");
  const [address, setAddress] = useState("");
  const [chainId, setChainId] = useState(0);
  const [connectName, setConnectName] = useState("injected");
  const [connecting, setConnecting] = useState(false);
  const [reload, setReload] = useState(false);
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const [web3Connection, setWeb3Connection] = useState<any>();
  useAsync(async () => {
    if (!web3Connection) {
      return;
    }
    web3Connection.on("accountsChanged", (accounts: string | any[]) => {
      if (web3Connection && web3Connection.close) {
        web3Connection.close();
      }
      if (accounts?.length === 0) {
        web3Modal.clearCachedProvider();
      }
      window.location.reload();
    });
    web3Connection.on("chainChanged", () => {
      console.log("chainChanged");
      setReload(true);
    });
    web3Connection.on("disconnect", () => {});
  }, [web3Connection]);

  useAsync(async () => {
    if (!provider) {
      return;
    }

    const networkData = await provider.getNetwork();
    setChainId(networkData.chainId);
    setNetwork(networkData.name);
  }, [provider]);

  const loadWeb3Modal = useCallback(async (providerName: string) => {
    setConnecting(true);
    setConnectName(providerName);

    const connection = await web3Modal
      .connectTo(providerName)
      .catch(() => setConnecting(false));
    if (!connection) {
      message.error("connection failed!");
      return;
    }
    setConnecting(false);
    setWeb3Connection(connection);
    if (connection.isImToken) {
      connection.request = undefined;
    }
    const newProvider = new Web3Provider(connection);
    setProvider(newProvider);
    const newSigner = newProvider.getSigner();
    setSigner(newSigner);
    setAddress(await newSigner.getAddress());
    setReload(false);
  }, []);

  const logoutOfWeb3Modal = useCallback(async () => {
    if (web3Connection && web3Connection.close) {
      web3Connection.close();
    }
    web3Modal.clearCachedProvider();
    window.location.reload();
  }, [web3Connection]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal(web3Modal.cachedProvider);
    }
  }, [loadWeb3Modal, connectName, reload]);

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        network,
        address,
        chainId,
        web3Modal,
        connecting,
        reload,
        loadWeb3Modal,
        logoutOfWeb3Modal,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3Context: () => Web3ContextProps = () =>
  useContext(Web3Context);
