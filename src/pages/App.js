import { Route, Routes } from "react-router-dom";
import Header from "../components/Header";
import MainPage from "./MainPage";
import DetailPage from "./DetailPage";
import "../components/CardList.css";
import Mypage from "./Mypage";

function App() {
  return (
    <>
      <Header /> {/* 기본으로 헤더 있고 */}
      <Routes>
        <Route
          path="/"
          element={<MainPage />}
        />

        {/* 상세 페이지 */}
        <Route path="/detail/:id" element={<DetailPage />} />
        <Route path="/mypage" element={<Mypage />} />
      </Routes>
    </>
  );
}

export default App;
