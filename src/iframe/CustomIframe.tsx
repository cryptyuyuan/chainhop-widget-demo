import { useCallback, useEffect, useRef } from "react";
import "../App.css";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import { JSONRPC, JSONRPCError } from "json-rpc-2.0";
import { widgetConfig } from "../const";

function CustomIframe(): JSX.Element {
  const { address, chainId, provider, loadWeb3Modal } = useWeb3Context();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const dappUrl = "https://staging-chainhop.netlify.app";
  // const dappUrl = "http://localhost:3001";
  const dappURL = new URL(dappUrl);

  useEffect(() => {
    if (chainId > 0) {
      sendMessageToDAPP({
        jsonrpc: "2.0",
        method: "chainChanged",
        params: [`0x${chainId.toString(16)}`],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId]);
  useEffect(() => {
    if (address.length > 0) {
      sendMessageToDAPP({
        jsonrpc: "2.0",
        method: "accountsChanged",
        params: [`${address}`],
      });
    } else {
      sendMessageToDAPP({
        jsonrpc: "2.0",
        method: "close",
        params: [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  useEffect(() => {
    if (provider) {
      sendMessageToDAPP({
        jsonrpc: "2.0",
        method: "connect",
        params: [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  const sendMessageToDAPP = (message: any) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      console.log("sending answer to app: ", message);
      iframeRef.current.contentWindow.postMessage(message, dappURL.origin);
    }
  };

  type ResponseToDAPP = {
    id: string;
    result?: string;
    error?: JSONRPCError;
  };
  const sendResponseToDAPP = ({ id, result, error }: ResponseToDAPP) => {
    sendMessageToDAPP({
      id,
      jsonrpc: JSONRPC,
      result,
      error,
    });
  };

  const rejectedError = (message: string): JSONRPCError => ({
    code: 3,
    message,
    data: [
      {
        code: 104,
        message: "Rejected",
      },
    ],
  });

  const receiveDAPPMessage = useCallback(
    async (event: MessageEvent) => {
      if (event.origin !== dappURL.origin) {
        return;
      }
      const data = event.data;
      if (data.jsonrpc !== "2.0") {
        return;
      }
      console.log(`MESSAGE FROM APP ${data.method}`, data, data.jsonrpc);

      switch (data.method) {
        case "get_widgetConfig": {
          sendMessageToDAPP({
            id: data.id,
            jsonrpc: "2.0",
            result: `${JSON.stringify(widgetConfig)}`,
          });
          break;
        }
        case "wallet_connect": {
          await loadWeb3Modal("injected");
          sendMessageToDAPP({
            id: data.id,
            jsonrpc: "2.0",
            result: ``,
          });
          break;
        }
        case "eth_chainId": {
          sendMessageToDAPP({
            id: data.id,
            jsonrpc: "2.0",
            result: `0x${chainId.toString(16)}`,
          });
          break;
        }

        case "enable": {
          break;
        }

        case "eth_accounts": {
          sendMessageToDAPP({
            id: data.id,
            jsonrpc: "2.0",
            result: [address],
          });
          break;
        }

        default: {
          break;
        }
      }
      if (address && provider) {
        switch (data.method) {
          case "eth_getBalance":
          case "eth_call":
          case "eth_getTransactionReceipt":
          case "eth_blockNumber":
          case "eth_estimateGas":
          case "eth_getTransactionByHash":
          case "eth_requestAccounts": {
            const swapTx = await provider?.send(data.method, data.params);
            console.log("Iframe ", data.method, ": ", swapTx);
            sendMessageToDAPP({
              id: data.id,
              jsonrpc: "2.0",
              result: swapTx,
            });
            break;
          }
          case "wallet_switchEthereumChain": {
            const tagetChainId = data.params[0];
            // Check chanId is valid hex string
            const decimalChainId = parseInt(tagetChainId, 16);
            if (isNaN(decimalChainId)) {
              sendResponseToDAPP({
                id: data.id,
                error: rejectedError("Invalid chainId"),
              });
              break;
            }

            try {
              await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: `0x${decimalChainId.toString(16)}` }],
              });

              sendMessageToDAPP({
                id: data.id,
                jsonrpc: "2.0",
                result: null,
              });
            } catch (error) {
              sendResponseToDAPP({
                id: data.id,
                error: rejectedError(`error switching chain: ${error}`),
              });
            }

            break;
          }
          case "eth_sendTransaction": {
            const ethTX = data.params[0];
            if (address.toLowerCase() === ethTX.from.toLowerCase()) {
              try {
                const swapTx = await provider?.send(
                  "eth_sendTransaction",
                  data.params
                );
                console.log("Iframe eth_sendTransaction: ", swapTx);
                sendMessageToDAPP({
                  id: data.id,
                  jsonrpc: "2.0",
                  result: `${swapTx}`,
                });
              } catch (error) {
                sendResponseToDAPP({
                  id: data.id,
                  error: rejectedError("Transaction declined"),
                });
              }
            }
            break;
          }
          case "personal_sign": {
            break;
          }

          case data.method.match(/eth_signTypedData(_v.)?$/)?.input: {
            break;
          }
          default: {
            break;
          }
        }
        return;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [address, chainId, provider, sendMessageToDAPP]
  );

  useEffect(() => {
    window.addEventListener("message", receiveDAPPMessage, false);

    return () => {
      window.removeEventListener("message", receiveDAPPMessage, false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiveDAPPMessage]);

  return (
    <iframe
      title="chainhop"
      name="iframeName"
      className="chainhop-iframe"
      id="iframeId"
      src={dappUrl}
      scrolling="no"
      ref={iframeRef}
    ></iframe>
  );
}

export default CustomIframe;
