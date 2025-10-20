import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./DetailPage.css";
import CommentSection from "../components/Commentsection";
import { fetchMountainDetail } from "../services/mountainService";

const FALLBACK_IMAGE = "/mou.jpg";

function DetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const initialData = location.state ?? null;

  const [mountainData, setMountainData] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("photo");
  const [showFull, setShowFull] = useState(false);
  const [imageSrc, setImageSrc] = useState(initialData?.image ?? FALLBACK_IMAGE);

  const photoRef = useRef(null);
  const infoRef = useRef(null);
  const commentRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!infoRef.current || !commentRef.current) return;
      const scrollY = window.scrollY + 10;
      const infoTop = infoRef.current.offsetTop;
      const commentTop = commentRef.current.offsetTop;

      if (scrollY >= commentTop) setActiveTab("comment");
      else if (scrollY >= infoTop) setActiveTab("info");
      else setActiveTab("photo");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function loadDetail() {
      setLoading(true);
      setError(null);
      try {
        const detail = await fetchMountainDetail(id);
        if (cancelled) return;
        setMountainData((prev) => ({ ...(prev ?? {}), ...detail }));
        setImageSrc((current) => detail.detailImage || detail.image || current || FALLBACK_IMAGE);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err : new Error("상세 정보를 불러오지 못했습니다."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadDetail();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    setShowFull(false);
    setActiveTab("photo");
  }, [id]);

  const getLevelClass = (level) => {
    switch (level) {
      case "상":
        return "high";
      case "중":
        return "mid";
      case "하":
        return "low";
      default:
        return "";
    }
  };

  const toggleDescription = () => setShowFull((prev) => !prev);

  if (loading) {
    const isInitialLoading = !mountainData;
    if (isInitialLoading) {
      return (
        <div className="detail-page">
          <p className="detail-status">상세 정보를 불러오는 중입니다...</p>
        </div>
      );
    }
  }

  if (error && !mountainData) {
    return (
      <div className="detail-page">
        <p className="detail-status detail-status-error">{error.message}</p>
      </div>
    );
  }

  if (!mountainData) {
    return (
      <div className="detail-page">
        <p className="detail-status detail-status-error">표시할 산 정보가 없습니다.</p>
      </div>
    );
  }

  const difficulty = mountainData.difficulty ?? "중";
  const title = mountainData.title ?? "이름 미상";
  const address = mountainData.location ?? "위치 정보 없음";
  const description =
    mountainData.description || mountainData.summary || "상세 설명이 제공되지 않았습니다.";
  const heightText = mountainData.height ? `해발 ${mountainData.height}m` : null;
  const transport = mountainData.transport ?? "교통 정보가 제공되지 않았습니다.";
  const tourismInfo = mountainData.tourismInfo ?? "주변 관광 정보가 제공되지 않았습니다.";

  return (
    <div className="detail-page">
      {error && mountainData && (
        <p className="detail-inline-error" role="status">
          {error.message}
        </p>
      )}

      <div className="difficulty">
        난이도 <span className="divider">|</span>
        <span className={`level high ${difficulty === "상" ? "active" : ""}`}>상</span>
        <span className={`level mid ${difficulty === "중" ? "active" : ""}`}>중</span>
        <span className={`level low ${difficulty === "하" ? "active" : ""}`}>하</span>
      </div>

      <h1 className={`title ${getLevelClass(difficulty)}`}>{title}</h1>
      <p className="address">
        {address}
        {heightText ? ` · ${heightText}` : ""}
      </p>

      <div className="tab-menu sticky">
        <span
          className={`tab ${activeTab === "photo" ? "active" : ""}`}
          onClick={() => scrollToSection(photoRef)}
        >
          사진보기
        </span>
        <span className="divider">|</span>
        <span
          className={`tab ${activeTab === "info" ? "active" : ""}`}
          onClick={() => scrollToSection(infoRef)}
        >
          상세정보
        </span>
        <span className="divider">|</span>
        <span
          className={`tab ${activeTab === "comment" ? "active" : ""}`}
          onClick={() => scrollToSection(commentRef)}
        >
          댓글
        </span>
      </div>

      <div className="photo-section" ref={photoRef}>
        <img
          src={imageSrc}
          alt={title}
          className="main-image"
          onError={() => {
            if (imageSrc !== FALLBACK_IMAGE) {
              setImageSrc(FALLBACK_IMAGE);
            }
          }}
        />
      </div>

      <div className="info-section" ref={infoRef}>
        <h2>상세정보</h2>
        <p className={`description ${showFull ? "expanded" : ""}`}>{description}</p>
        <button className="more-btn" onClick={toggleDescription}>
          {showFull ? "내용 닫기 -" : "내용 더보기 +"}
        </button>

        <div className="info-block">
          <h3>교통 정보</h3>
          <p>{transport}</p>
        </div>

        <div className="info-block">
          <h3>주변 관광</h3>
          <p>{tourismInfo}</p>
        </div>
      </div>

      <div ref={commentRef}>
        <CommentSection />
      </div>
    </div>
  );
}

export default DetailPage;
