import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalStyle from "./styles/GlobalStyle";
import Login from "./pages/Login";
import Main from "./pages/Main";
import Lent from "./pages/Lent";

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <>
        <GlobalStyle />
        <section>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/main" element={<Main />} />
            <Route path="/Lent" element={<Lent />} />
            <Route path="/*" element={<Login />} />
          </Routes>
        </section>
      </>
    </BrowserRouter>
  );
}

export default App;
