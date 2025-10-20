import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLeaf, FaMountain, FaChevronRight } from "react-icons/fa";

const themeIconMap = {
  힐링: FaLeaf,
  트래킹: FaMountain,
  풍경: FaLeaf,
  캠핑: FaMountain,
};

const difficultyClassMap = {
  상: "high",
  중: "mid",
  하: "low",
};

export default function CardItem({
  image,
  title,
  location,
  id,
  difficulty,
  theme,
  summary,
}) {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  const ThemeIcon = themeIconMap[theme] ?? FaLeaf;

  const handleNavigate = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    setTimeout(() => navigate(`/detail/${id}`), 180);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleNavigate();
    }
  };

  return (
    <article
      className={`card ${isNavigating ? "is-activating" : ""}`}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${title} 상세 보기`}
    >
      <div className="card-media">
        <img src={image} alt={title} className="card-img" />
        <div className="card-badges">
          <span
            className={`badge difficulty-badge difficulty-${difficultyClassMap[difficulty] ?? "low"}`}
          >
            난이도 {difficulty}
          </span>
          <span className="badge theme-badge">
            <ThemeIcon aria-hidden="true" /> {theme}
          </span>
        </div>
      </div>

      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <p className="card-location">{location}</p>
        <p className="card-summary">{summary}</p>
        <span className="card-cta">
          자세히 보기 <FaChevronRight aria-hidden="true" />
        </span>
      </div>

      {isNavigating && (
        <div className="card-progress" aria-hidden="true">
          <div className="card-spinner" />
        </div>
      )}
    </article>
  );
}
