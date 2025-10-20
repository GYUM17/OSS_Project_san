import CardItem from "./CardItem";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./CardList.css";
import { fetchMountainList } from "../services/mountainService";

export default function CardList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [cards, setCards] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cardsPerPage = 12;
  const totalPages = Math.max(1, Math.ceil(totalCount / cardsPerPage));
  const pageGroupSize = 5;
  const groupStartPage = Math.floor((currentPage - 1) / pageGroupSize) * pageGroupSize + 1;
  const groupEndPage = Math.min(groupStartPage + pageGroupSize - 1, totalPages);
  const pageNumbers = [];
  for (let page = groupStartPage; page <= groupEndPage; page += 1) {
    pageNumbers.push(page);
  }

  useEffect(() => {
    let cancelled = false;
    async function loadMountains() {
      setLoading(true);
      setError(null);
      try {
        const { items, totalCount: count } = await fetchMountainList({
          page: currentPage,
          perPage: cardsPerPage,
        });
        if (cancelled) return;
        setCards(items);
        setTotalCount(count || items.length);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err : new Error("데이터를 불러오지 못했습니다."));
        setCards([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadMountains();
    return () => {
      cancelled = true;
    };
  }, [currentPage, cardsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <section className="cardlist-section" aria-label="추천 산 목록">
      <div className="cardlist-wrapper">

        <div className="card-container">
          {loading && <p className="cardlist-status">데이터를 불러오는 중입니다...</p>}
          {!loading && error && (
            <p className="cardlist-status cardlist-status-error">{error.message}</p>
          )}
          {!loading && !error && cards.length === 0 && (
            <p className="cardlist-status">표시할 산 정보가 없습니다.</p>
          )}
          {!loading && !error && cards.map((card) => <CardItem key={card.id} {...card} />)}
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

          {pageNumbers.map((page) => (
            <button
              key={`page-${page}`}
              className={`page-num ${currentPage === page ? "active" : ""}`}
              onClick={() => handlePageChange(page)}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
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
