import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import MainPage from "./MainPage";
import DetailPage from "./DetailPage";
import "../components/CardList.css";
import Mypage from "./Mypage";

function App() {
  const [anyDropdownOpen, setAnyDropdownOpen] = useState(false);

  return (
    <>
      <Header
        anyDropdownOpen={anyDropdownOpen}
        onAnyDropdownChange={setAnyDropdownOpen}
      />
      <Routes>
        <Route
          path="/"
          element={
            <MainPage
              anyDropdownOpen={anyDropdownOpen}
              onAnyDropdownChange={setAnyDropdownOpen}
            />
          }
        />

        {/* 상세 페이지 */}
        <Route path="/detail/:id" element={<DetailPage />} />
        <Route path="/mypage" element={<Mypage />} />
      </Routes>
    </>
  );
}

export default App;
