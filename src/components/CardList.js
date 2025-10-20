import CardItem from "./CardItem";
import { useMemo, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./CardList.css";

const difficulties = ["상", "중", "하"];
const themes = ["힐링", "트래킹", "풍경", "캠핑"];

export default function CardList() {
  const allCards = useMemo(
    () =>
      Array(30)
        .fill(0)
        .map((_, i) => ({
          id: i + 1,
          image: "/mou.jpg",
          title: `산 이름 ${i + 1}`,
          location: "전북 전주시",
          difficulty: difficulties[i % difficulties.length],
          theme: themes[i % themes.length],
          summary: "초보자도 즐길 수 있는 순탄한 숲길과 전망대가 매력적인 코스입니다.",
        })),
    []
  );

  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 12;
  const totalPages = Math.ceil(allCards.length / cardsPerPage);

  const indexOfLast = currentPage * cardsPerPage;
  const indexOfFirst = indexOfLast - cardsPerPage;
  const currentCards = allCards.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <section className="cardlist-section" aria-label="추천 산 목록">
      <div className="cardlist-wrapper">

        <div className="card-container">
          {currentCards.map((card) => (
            <CardItem key={card.id} {...card} />
          ))}
        </div>

        <div className="pagination" role="navigation" aria-label="페이지 이동">
          <button
            className="page-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="이전 페이지"
          >
            <FaChevronLeft />
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={`page-${i + 1}`}
              className={`page-num ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => handlePageChange(i + 1)}
              aria-current={currentPage === i + 1 ? "page" : undefined}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="page-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="다음 페이지"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}
