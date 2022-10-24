import Lent from "./pages/Lent";
import Main from "./pages/Main";
import Return from "./pages/Return";
import Footer from "./component/Footer";
import MaintenancePage from "./pages/MaintenancePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalStyle from "./GlobalStyle";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <GlobalStyle />
        <section>
          <Routes>
            {/* <Route path="/" element={<Main />}></Route>
            <Route path="/lent" element={<Lent />}></Route>
            <Route path="/return" element={<Return />}></Route> */}
            <Route path="/*" element={<MaintenancePage />}></Route>
          </Routes>
        </section>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
