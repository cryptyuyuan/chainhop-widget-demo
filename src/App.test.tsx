import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

// const balanceRes = await iFrameProvider.send("eth_getBalance", [
//   address,
//   "latest",
// ]);
// console.log("chainhop eth_getBalance: ", balanceRes);
