import CardItem from "./CardItem";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./CardList.css";
import { fetchMountainList } from "../services/mountainService";

const CARDS_PER_PAGE = 12;

const difficultyRank = {
  상: 3,
  중: 2,
  하: 1,
};

function sortCards(items, criterion, order) {
  if (!Array.isArray(items)) return [];

  const direction = order === "desc" ? -1 : 1;

  return [...items].sort((a, b) => {
    if (criterion === "difficulty") {
      const rankA = difficultyRank[a.difficulty] ?? 0;
      const rankB = difficultyRank[b.difficulty] ?? 0;

      // 난이도 순으로
      if (rankA > rankB) return direction;
      if (rankA < rankB) return -direction;

      // 난이도 동일하면 이름 순으로
      return a.title.localeCompare(b.title, "ko");
    }
    // 난이도 순일 때
    return a.title.localeCompare(b.title, "ko") * direction;
  });
}

export default function CardList({
  region = "지역선택",
  keyword = "",
  sortCriterion = "dictionary",
  sortOrder = "asc",
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [cards, setCards] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalPages = Math.max(1, Math.ceil(totalCount / CARDS_PER_PAGE));
  const pageGroupSize = 5;
  const groupStartPage =
    Math.floor((currentPage - 1) / pageGroupSize) * pageGroupSize + 1;
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
        const normalizedRegion = region === "지역선택" ? undefined : region;
        const normalizedKeyword = keyword?.trim() ? keyword.trim() : undefined;
        const { items, totalCount: count = 0 } = await fetchMountainList({
          page: 1, // 전체 데이터 다 받기 위해서 1페이지로 고정
          perPage: 200, // 값 크게 받기
          region: normalizedRegion,
          keyword: normalizedKeyword,
        });
        if (cancelled) return;

        // 전체 정렬 먼저 수행
        const sortedItems = sortCards(items, sortCriterion, sortOrder);

        // 페이지 수동으로 처리
        const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
        const endIndex = startIndex + CARDS_PER_PAGE;
        const pagedItems = sortedItems.slice(startIndex, endIndex);

        setCards(pagedItems);
        setTotalCount(sortedItems.length);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error
            ? err
            : new Error("데이터를 불러오지 못했습니다.")
        );
        setCards([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadMountains();
    return () => {
      cancelled = true;
    };
  }, [currentPage, region, keyword, sortCriterion, sortOrder]);

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
          {loading && (
            <p className="cardlist-status">데이터를 불러오는 중입니다...</p>
          )}
          {!loading && error && (
            <p className="cardlist-status cardlist-status-error">
              {error.message}
            </p>
          )}
          {!loading && !error && cards.length === 0 && (
            <p className="cardlist-status">표시할 산 정보가 없습니다.</p>
          )}
          {!loading &&
            !error &&
            cards.map((card) => <CardItem key={card.id} {...card} />)}
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
