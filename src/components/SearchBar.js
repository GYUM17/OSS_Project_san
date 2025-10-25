import React, { useState, useRef, useEffect } from "react";

import {
  FaMapMarkerAlt,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUpAlt,
} from "react-icons/fa";
import styles from "./SearchBar.module.css";

const DEFAULT_REGIONS = [
  "지역선택",
  "서울특별시",
  "경기도",
  "강원도",
  "경상북도",
  "전라남도",
];

function SearchBar({
  region = "지역선택",
  keyword = "",
  sortCriterion = "dictionary",
  sortOrder = "asc",
  onRegionChange,
  onKeywordChange,
  onSearch,
  onSortCriterionChange,
  onSortOrderChange,
  regions = DEFAULT_REGIONS,
  anyDropdownOpen,
  onAnyDropdownChange,
}) {
  const [openRegionDropdown, setOpenRegionDropdown] = useState(false);
  const [openSortDropdown, setOpenSortDropdown] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenRegionDropdown(false);
        setOpenSortDropdown(false);
        onAnyDropdownChange?.(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [onAnyDropdownChange]);

  useEffect(() => {
    if (anyDropdownOpen === false) {
      setOpenRegionDropdown(false);
      setOpenSortDropdown(false);
    }
  }, [anyDropdownOpen]);

  const handleRegionSelect = (selectedRegion, event) => {
    event.stopPropagation();
    onRegionChange?.(selectedRegion);
    setOpenRegionDropdown(false);
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch();
    }
  };

  const handleRegionToggle = (event) => {
    event.stopPropagation();
    setOpenRegionDropdown((prev) => !prev);
    setOpenSortDropdown(false);
    onAnyDropdownChange?.(true);
  };

  const handleRegionKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpenRegionDropdown((prev) => !prev);
    }
  };

  const handleSortToggle = (event) => {
    event.stopPropagation();
    setOpenSortDropdown((prev) => !prev);
    setOpenRegionDropdown(false);
    onAnyDropdownChange?.(true);
  };

  const handleSortSelect = (value) => {
    if (onSortCriterionChange) {
      onSortCriterionChange(value);
    }
    setOpenSortDropdown(false);
  };

  const handleSortKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpenSortDropdown((prev) => !prev);
    }
  };

  const toggleOrder = () => {
    if (onSortOrderChange) {
      onSortOrderChange(sortOrder === "asc" ? "desc" : "asc");
    }
  };

  const getSortLabel = (criterion) =>
    criterion === "dictionary" ? "사전순" : "난이도순";

  return (
    <div className={styles["searchbar-wrapper"]} ref={dropdownRef}>
      <div className={styles["searchbar-container"]}>
        {/* 지역 선택 */}
        <div
          className={styles["region-selector"]}
          tabIndex={0}
          role="button"
          aria-haspopup="listbox"
          aria-expanded={openRegionDropdown}
          onClick={handleRegionToggle}
          onKeyDown={handleRegionKeyDown}
        >
          <FaMapMarkerAlt className={styles["region-icon"]} />
          <span>{region}</span>
          <span className={styles.arrow}>▼</span>

          {openRegionDropdown && (
            <ul className={styles["region-dropdown"]}>
              {regions.map((r) => (
                <li key={r} onClick={(e) => handleRegionSelect(r, e)}>
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
          onChange={(e) => onKeywordChange?.(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleSearch();
            }
          }}
        />

        {/* 검색 버튼 */}
        <button
          className={styles["search-btn"]}
          onClick={handleSearch}
          type="button"
        >
          <FaSearch />
        </button>
      </div>

      {/* 오른쪽 - 정렬 */}
      <div className={styles["sort-controls"]}>
        <div
          className={styles["sort-selector"]}
          tabIndex={0}
          role="button"
          aria-haspopup="listbox"
          aria-expanded={openSortDropdown}
          onClick={handleSortToggle}
          onKeyDown={handleSortKeyDown}
        >
          <span>{getSortLabel(sortCriterion)}</span>
          <span className={styles.arrow}>▼</span>
        </div>
        {openSortDropdown && (
          <ul className={styles["sort-dropdown"]}>
            <li>
              <button
                type="button"
                onClick={() => handleSortSelect("dictionary")}
              >
                사전순
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleSortSelect("difficulty")}
              >
                난이도순
              </button>
            </li>
          </ul>
        )}

        <button
          className={styles["sort-order-btn"]}
          onClick={(e) => {
            e.stopPropagation();
            toggleOrder();
          }}
        >
          {sortOrder === "asc" ? (
            <FaSortAmountUpAlt className={styles["sort-icon"]} />
          ) : (
            <FaSortAmountDown className={styles["sort-icon"]} />
          )}
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
