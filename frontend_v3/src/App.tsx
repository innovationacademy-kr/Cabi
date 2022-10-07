import React from "react";
import styled from "@emotion/styled";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import gaTracker from "./network/ga/gaTracker";
import GlobalStyle from "./styles/GlobalStyle";
import Login from "./pages/Login";
import Main from "./pages/Main";
import Lent from "./pages/Lent";

const Section = styled.section`
  padding-bottom: 0.5rem;
`;

function App(): JSX.Element {
  gaTracker();
  return (
    <BrowserRouter>
      <>
        <GlobalStyle />
        <Section>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/main" element={<Main />} />
            <Route path="/lent" element={<Lent />} />
            <Route path="/*" element={<Login />} />
          </Routes>
        </Section>
      </>
    </BrowserRouter>
  );
}

export default App;
