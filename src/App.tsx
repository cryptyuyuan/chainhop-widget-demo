import "./App.css";
import Header from "./header/Header";
import Document from "./document/Document";
import CustomIframe from "./iframe/CustomIframe";

function App(): JSX.Element {
  return (
    <div>
      <Document />
      <Header />
      <CustomIframe />
    </div>
  );
}

export default App;
