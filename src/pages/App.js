import { Route, Routes } from "react-router-dom";
import Header from "../components/Header";
import MainPage from "./MainPage";
import CardList from "../components/CardList";
import DetailPage from "./DetailPage";
import "../components/CardList.css";

function App() {
  return (
    <>
      <Header /> {/* 기본으로 헤더 있고 */}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <MainPage />
              <CardList />
            </>
          }
        />

        {/* 상세 페이지 */}
        <Route path="/detail/:id" element={<DetailPage />} />
      </Routes>
    </>
  );
}

export default App;
