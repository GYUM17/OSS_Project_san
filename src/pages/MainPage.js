import React, { useState } from "react";
import { Box } from "@mui/material";
import SearchBar from "../components/SearchBar";
import CardList from "../components/CardList";

function MainPage() {
  const [region, setRegion] = useState("지역선택");
  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [sortCriterion, setSortCriterion] = useState("dictionary");
  const [sortOrder, setSortOrder] = useState("asc");

  const handleKeywordChange = (value) => {
    setKeywordInput(value);
  };

  const handleSearchSubmit = () => {
    setKeyword(keywordInput.trim());
  };

  return (
    <main>
      <Box
        component="section"
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          px: { xs: 2, md: 4 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 1400,
          }}
        >
          <SearchBar
            region={region}
            keyword={keywordInput}
            sortCriterion={sortCriterion}
            sortOrder={sortOrder}
            onRegionChange={setRegion}
            onKeywordChange={handleKeywordChange}
            onSearch={handleSearchSubmit}
            onSortCriterionChange={setSortCriterion}
            onSortOrderChange={setSortOrder}
          />
        </Box>
      </Box>
      <CardList
        key={`${region}-${keyword}-${sortCriterion}-${sortOrder}`}
        region={region}
        keyword={keyword}
        sortCriterion={sortCriterion}
        sortOrder={sortOrder}
      />
    </main>
  );
}

export default MainPage;
