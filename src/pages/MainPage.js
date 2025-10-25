import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import CardList from "../components/CardList";

function MainPage({ anyDropdownOpen, onAnyDropdownChange }) {
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
        anyDropdownOpen={anyDropdownOpen}
        onAnyDropdownChange={onAnyDropdownChange}
      />

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
