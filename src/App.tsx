import "./styles/App.scss";
import AppRouting from "./AppRouting";
import Routes from "./config/Routes";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="App">
      <AppRouting routes={Routes} />
      <ToastContainer />
    </div>
  );
}

export default App;
