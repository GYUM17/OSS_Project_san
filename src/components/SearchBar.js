import React from "react";
import { useState, useRef, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUpAlt,
} from "react-icons/fa";
import "./SearchBar.css";

function SearchBar() {
  const [region, setRegion] = useState("지역선택");
  const [keyword, setKeyword] = useState("");

  const [openRegionDropdown, setOpenRegionDropdown] = useState(false);
  const [openSortDropdown, setOpenSortDropdown] = useState(false);

  const [sortCriterion, setSortCriterion] = useState("dictionary");
  const [order, setOrder] = useState("asc");

  const dropdownRef = useRef(null);

  const regions = ["서울특별시", "경기도", "강원도", "경상북도", "전라남도"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenRegionDropdown(false);
        setOpenSortDropdown(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleRegionSelect = (r, e) => {
    e.stopPropagation();
    setRegion(r);
    setOpenRegionDropdown(false);
  };

  const handleSearch = () => {
    console.log("검색 실행: ", region, keyword);
  };

  // 정렬 상태 관리
  const toggleOrder = () => {
    setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="searchbar-wrapper" ref={dropdownRef}>
      <div className="searchbar-container">
        {/* 지역 선택 */}
        <div
          className="region-selector"
          onClick={() => setOpenRegionDropdown((prev) => !prev)}
        >
          <FaMapMarkerAlt className="region-icon" />
          <span>{region}</span>
          <span className="arrow">▼</span>

          {openRegionDropdown && (
            <ul className="region-dropdown">
              {regions.map((r, idx) => (
                <li key={idx} onClick={(e) => handleRegionSelect(r, e)}>
                  {r}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 검색창 */}
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        {/* 검색 버튼 */}
        <button className="search-btn" onClick={handleSearch}>
          <FaSearch />
        </button>
      </div>

      {/* 오른쪽 - 정렬 */}
      <div className="sort-controls">
        <div
          className="sort-selector"
          onClick={() => setOpenSortDropdown((prev) => !prev)}
        >
          <span>{sortCriterion === "dictionary" ? "사전순" : "난이도순"}</span>
        </div>

        <button
          className="sort-order-btn"
          onClick={(e) => {
            e.stopPropagation();
            toggleOrder();
          }}
        >
          {order === "asc" ? (
            <FaSortAmountUpAlt className="sort-icon" />
          ) : (
            <FaSortAmountDown className="sort-icon" />
          )}
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
