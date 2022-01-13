import "./styles/App.scss";
import AppRouting from "./AppRouting";
import Routes from "./config/Routes";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";

const theme = createTheme({
  typography: {
    fontFamily: `"Avenir", Arial;`,
  },
});
function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <AppRouting routes={Routes} />

        <ToastContainer />
      </div>
    </ThemeProvider>
  );
}



export default App;
