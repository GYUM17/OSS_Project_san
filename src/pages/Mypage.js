import React, { useEffect, useState } from "react";
import "./Mypage.css";

function MyPage() {
  // 임시 데이터 ==> 나중에 데이터 연결할 때 수정
  // 사용자 프로필
  const [user, setUser] = useState({
    name: "원중",
    email: "wonjung1919@handong.ac.kr",
    profileImage: "/sanlogo.png",
  });

  // 사용자가 남긴 후기
  const [reviews, setReviews] = useState([
    {
      id: 1,
      mountainName: "북한산",
      address: "서울특별시 은평구",
      image: "/mou.jpg",
      content: "경치가 너무 좋아요! 다시 가고 싶어요.",
      createdAt: "2025-10-10",
    },
    {
      id: 2,
      mountainName: "설악산",
      address: "강원도 속초시",
      image: "/mou.jpg",
      content:
        "코스가 길지만 완전 힐링이었어요.코스가완전 힐링이었어요.코스가완전 힐링이었어요.코스가완전 힐링이었어요.코스가 길지만 완전 완전 완전만 완전 완전 완전만 완전 완전 완전 완전 완전 완전 ",
      createdAt: "2025-10-15",
    },
    {
      id: 3,
      mountainName: "지리산",
      address: "전라남도 구례군",
      image: "/mou.jpg",
      content: "정말 힘들지만 정상 뷰는 압도적이에요.",
      createdAt: "2025-09-30",
    },
    {
      id: 4,
      mountainName: "한라산",
      address: "제주특별자치도",
      image: "/mou.jpg",
      content: "눈 덮인 겨울 산은 진짜 예술입니다.",
      createdAt: "2025-01-22",
    },
    {
      id: 5,
      mountainName: "도봉산",
      address: "서울특별시 도봉구",
      image: "/mou.jpg",
      content: "가볍게 오르기 좋아요.",
      createdAt: "2024-12-18",
    },
  ]);

  // 사용자가 남긴 즐겨찾기
  const [favorites, setFavorites] = useState([
    {
      id: 3,
      mountainName: "지리산",
      address: "전라남도 구례군",
      image: "/mou.jpg",
    },
    {
      id: 4,
      mountainName: "한라산",
      address: "제주특별자치도",
      image: "/mou.jpg",
    },
    {
      id: 3,
      mountainName: "지리산",
      address: "전라남도 구례군",
      image: "/mou.jpg",
    },
    {
      id: 4,
      mountainName: "한라산",
      address: "제주특별자치도",
      image: "/mou.jpg",
    },
    {
      id: 3,
      mountainName: "지리산",
      address: "전라남도 구례군",
      image: "/mou.jpg",
    },
    {
      id: 4,
      mountainName: "한라산",
      address: "제주특별자치도",
      image: "/mou.jpg",
    },
  ]);

  // 후기 2개씩 보여주기
  const [visibleCount, setVisibleCount] = useState(2);

  // 더보기 누르면 2개씩 추가하기
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 2);
  };

  // 즐겨찾기 4개씩 보여주기
  const [visibleFavorites, setVisibleFavorites] = useState(4);
  const handleLoadMoreFavorites = () => setVisibleFavorites((prev) => prev + 4);

  return (
    <div className="mypage-container">
      {/* 프로필 영역 */}
        <section className="profile-section">
          <img
            src={user.profileImage}
            alt="프로필 사진"
            className="profile-img"
          />
          <div className="profile-info">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <div className="stats">
              <span>후기 {reviews.length}</span>
              <span>즐겨찾기 {favorites.length}</span>
            </div>
          </div>
        </section>


      {/* 후기 목록 */}
      <section className="reviews-section">
        <div className="section-box">
          <h3 className="section-title">후기</h3>

          <div className="review-card-list">
            {reviews.slice(0, visibleCount).map((r) => (
              <div key={r.id} className="review-card-box">
                <img
                  src={r.image}
                  alt={r.mountainName}
                  className="review-img"
                />

                <div className="review-content">
                  <h4 className="review-title">{r.mountainName}</h4>
                  <p className="review-address">{r.address}</p>
                  <p className="review-text">
                    {r.content.length > 60
                      ? r.content.slice(0, 60) + " ..."
                      : r.content}
                  </p>{" "}
                  {/* 글자 1줄 정도로 제한 */}
                  <p className="review-date">{r.createdAt}</p>
                </div>
              </div>
            ))}
          </div>
          {/* 후기 개수보다 visibleCount가 적을 때 load 표시 */}
          {visibleCount < reviews.length && (
            <button className="load-more-btn" onClick={handleLoadMore}>
              더보기 ▼
            </button>
          )}
        </div>
      </section>

      {/* 즐겨찾기 목록 */}
      <section className="favorites-section">
        <div className="section-box">
          <h3 className="section-title">즐겨찾기</h3>
          <div className="favorite-list">
            {favorites.slice(0, visibleFavorites).map((f) => (
              <div key={f.id} className="favorite-card">
                <img src={f.image} alt={f.mountainName} />
                <div className="favorite-info">
                  <h4>{f.mountainName}</h4>
                  <p>{f.address}</p>
                </div>
              </div>
            ))}
          </div>
          {/* 즐겨찾기 더보기 활성화 */}
          {visibleFavorites < favorites.length && (
            <button className="load-more-btn" onClick={handleLoadMoreFavorites}>
              더보기 ▼
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

export default MyPage;
