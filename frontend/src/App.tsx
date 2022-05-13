import Lent from "./pages/Lent";
import Main from "./pages/Main";
import Return from "./pages/Return";
import Event from "./pages/Event";
import Footer from "./component/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <section>
          <Routes>
            <Route path="/" element={<Main />}></Route>
            <Route path="/lent" element={<Lent />}></Route>
            <Route path="/return" element={<Return />}></Route>
            <Route path="/*" element={<Main />}></Route>
          </Routes>
        </section>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
