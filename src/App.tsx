import "./styles/App.scss";
import AppRouting from "./AppRouting";
import Routes from "./config/Routes";

function App() {
  return (
    <div className="App">
      <AppRouting routes={Routes} />
    </div>
  );
}

export default App;
