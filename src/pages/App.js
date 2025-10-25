import { Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "../components/Header";
import MainPage from "./MainPage";
import DetailPage from "./DetailPage";
import "../components/CardList.css";
import Mypage from "./Mypage";

function App() {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <Header />
      <Box component="main" sx={{ pb: 6 }}>
        <Routes>
          <Route
            path="/"
            element={<MainPage />}
          />

          {/* 상세 페이지 */}
          <Route path="/detail/:id" element={<DetailPage />} />
          <Route path="/mypage" element={<Mypage />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
