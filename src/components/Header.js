import React from "react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaUser, FaGlobe } from "react-icons/fa";

import "./Header.css";

// 헤더 (네비게이션 바)
function Header() {
  // 언어 드롭다운 펼치기 위함
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef(null); // 클릭 감지

  // 바깥쪽 클릭해도 드롭다운 닫도록 (현재 useRef가 참조한)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLangOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []); // 의존성 배열이 비었으니까, 한 번만 실행

  return (
    <header className="header">
      {/* 왼쪽 로고, 이름 들어갈 부분 */}
      <div className="header-left">
        <Link to="/" className="logo">
          <img
            src="./3_5.jpg" // 로고 이미지, 나중에 만들어야 함
            alt="산 너머 로고"
            className="logo-img"
          />
          <span className="logo-text">산너머</span>
        </Link>
      </div>

      {/* 중앙 메뉴 */}
      <nav className="nav-menu">
        <Link to="/" className="active">
          홈
        </Link>
        <Link>테마</Link> {/* 나중에 추가 및 수정 */}
        <Link>지역</Link>
      </nav>

      {/* 오른쪽 아이콘 => react icon 사용 */}
      <div className="header-icons">
        {/* 돋보기 */}
        <div className="icon-wrapper">
          <FaSearch className="icon" />
        </div>

        {/* 프로필 */}
        <div className="icon-wrapper">
          <FaUser className="icon" />
        </div>

        {/* 지구본(언어 선택) */}
        <div className="lang-dropdown" ref={dropdownRef}>
          <FaGlobe
            className="icon globe-icon"
            onClick={(e) => {
              e.stopPropagation(); // 클릭 전파 방지
              setLangOpen((prev) => !prev); // 최근 상태 반대로
            }}
          />
          {langOpen && (
            <ul className="dropdown-menu">
              <li onClick={() => setLangOpen(false)}>한국어</li>
              <li onClick={() => setLangOpen(false)}>English</li>
              <li onClick={() => setLangOpen(false)}>日本語</li>
              <li onClick={() => setLangOpen(false)}>中文</li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
