import React from "react";
import styled from "@emotion/styled";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalStyle from "./styles/GlobalStyle";
import Login from "./pages/Login";
import Main from "./pages/Main";
import Lent from "./pages/Lent";
import Carousel from "./sample/Carousel/Carousel";

// 기존 .App 설정
const AppDiv = styled.div`
  height: 100%;
  margin: 0;
`;

const Section = styled.section`
  padding-bottom: 0.5rem;
`;

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <>
        <GlobalStyle />
        <Section>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/main" element={<Main />} />
            <Route path="/Lent" element={<Lent />} />
            <Route path="/Carousel" element={<Carousel />} />
            <Route path="/*" element={<Login />} />
          </Routes>
        </Section>
      </>
    </BrowserRouter>
  );
}

export default App;
