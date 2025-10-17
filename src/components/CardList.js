import CardItem from "./CardItem";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./CardList.css";

export default function CardList() {
  const allCards = Array(30)
  .fill(0)
  .map((_,i) => ({
    id: i+1,
    image: "/mou.jpg",
    title: `산 이름 ${i+1}`,
    location: "전북 전주시",
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 12; // 총 12개 (4 4 4)
  const totalPages = Math.ceil(allCards.length / cardsPerPage);

  // 현재 페이지에 맞는 카드 슬라이스
  const indexOfLast = currentPage * cardsPerPage;
  const indexOfFirst = indexOfLast - cardsPerPage;
  const currentCards = allCards.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="cardlist-wrapper">
      <div className="card-container">
        {currentCards.map((card, idx) => (
          <CardItem key={idx} {...card} />
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="pagination">
        <button
          className="page-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FaChevronLeft />
        </button>

        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            className={`page-num ${currentPage === i + 1 ? "active" : ""}`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="page-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}
