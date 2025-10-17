import React from "react";
import { useEffect, useState, useRef } from "react";
import "./DetailPage.css";
import CommentSection from "../components/Commentsection";

function DetailPage() {
  const [mountainData, setMountainData] = useState({
    name: "명품옻골 1616 협동조합", // 임시 데이터 세팅
    address: "대구 동구",
    level: "상",
    image:
      "https://images.unsplash.com/photo-1602526216030-bd8c9fa81b19?auto=format&fit=crop&w=1200&q=60", // 임시 이미지
    description: `압해도는 지세가 삼면으로 퍼져 바다를 누르고 있는 형태라서 압해도라 불렸다.
낙지가 발을 펴고 바다를 누르고 있는 형상이라서 그렇게 불렸다고도 한다.
신안군청의 소재지이다.

동쪽으로 바다 건너 무안군 삼향면과 청계면, 서쪽으로는 암태면, 남쪽은 해남군 화원면,
그리고 북쪽은 지도읍과 이웃하고 있다.
"그리움이 없는 사람은 압해도를 보지 못하네" 시인 노향림이 어린 시절,
목포시 산정동 야산 기슭에서 건너편 압해도를 바라보며 느꼈던 그 섬에 가고 싶은 무한한 동경을 주제로 쓴 60여 편의 압해도 연작시집의 제목이다.dddddddddddddddddddddddddddddddddddddddddddddddddddddd네" 시인 노향림이 어린 시절,
목포시 산정동 야산 기슭에서 건너편 압해도를 바라보며 느꼈던 그 섬에 가고 싶은 무한한 동경을 주제로 쓴 60여 편의 압해도 연작시집의 제목이다.dddddddddddddddddddddddddddddddddddddddddddddddddddddd네" 시인 노향림이 어린 시절,
목포시 산정동 야산 기슭에서 건너편 압해도를 바라보며 느꼈던 그 섬에 가고 싶은 무한한 동경을 주제로 쓴 60여 편의 압해도 연작시집의 제목이다.dddddddddddddddddddddddddddddddddddddddddddddddddddddd네" 시인 노향림이 어린 시절,
목포시 산정동 야산 기슭에서 건너편 압해도를 바라보며 느꼈던 그 섬에 가고 싶은 무한한 동경을 주제로 쓴 60여 편의 압해도 연작시집의 제목이다.dddddddddddddddddddddddddddddddddddddddddddddddddddddd네" 시인 노향림이 어린 시절,
목포시 산정동 야산 기슭에서 건너편 압해도를 바라보며 느꼈던 그 섬에 가고 싶은 무한한 동경을 주제로 쓴 60여 편의 압해도 연작시집의 제목이다.dddddddddddddddddddddddddddddddddddddddddddddddddddddd네" 시인 노향림이 어린 시절,
목포시 산정동 야산 기슭에서 건너편 압해도를 바라보며 느꼈던 그 섬에 가고 싶은 무한한 동경을 주제로 쓴 60여 편의 압해도 연작시집의 제목이다.dddddddddddddddddddddddddddddddddddddddddddddddddddddd네" 시인 노향림이 어린 시절,
목포시 산정동 야산 기슭에서 건너편 압해도를 바라보며 느꼈던 그 섬에 가고 싶은 무한한 동경을 주제로 쓴 60여 편의 압해도 연작시집의 제목이다.dddddddddddddddddddddddddddddddddddddddddddddddddddddd`,
  });

  const [activeTab, setActiveTab] = useState("photo");
  const [showFull, setShowFull] = useState(false);

  // 스크롤 이동용 useref
  const photoRef = useRef(null);
  const infoRef = useRef(null);
  const commentRef = useRef(null);

  // 스크롤 함수
  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // 스크롤을 감지해서, 해당 영역에 들어가면 active 되도록
  useEffect(() => {
    const handleScroll = () => {
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
  // API 호출
  useEffect(() => {
    // // 실제 주소로 바꿔서
    // fetch("https://api.example.com/mountain/1616")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setMountainData({
    //       name: data.name, // 명품옻골 1616 협동조합
    //       address: data.address, // 대구 동구
    //       level: data.level, // 상 / 중 / 하
    //     });
    //   })
    //   .catch((err) => console.error(err));
  }, []);

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

  /* 상세 설명 토글 부분 */
  const toggleDescription = () => setShowFull((prev) => !prev);

  return (
    <div className="detail-page">
      {/* 난이도 - API 연동*/}
      <div className="difficulty">
        난이도 <span className="divider">|</span>
        <span
          className={`level high ${
            mountainData.level === "상" ? "active" : ""
          }`}
        >
          상
        </span>
        <span
          className={`level mid ${mountainData.level === "중" ? "active" : ""}`}
        >
          중
        </span>
        <span
          className={`level low ${mountainData.level === "하" ? "active" : ""}`}
        >
          하
        </span>
      </div>

      {/* 산 이름 - API 연동 */}
      <h1 className={`title ${getLevelClass(mountainData.level)}`}>
        {mountainData.name}
      </h1>

      {/* 주소 - API 연동 */}
      <p className="address">{mountainData.address}</p>

      {/* 하단 탭 메뉴 */}
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

      {/* 이미지 부분*/}
      <div className="photo-section" ref={photoRef}>
        <img
          //src={mountainData.image}
          src="../logo.png"
          alt={mountainData.name}
          className="main-image"
        />
      </div>

      {/* 상세 정보 */}
      <div className="info-section" ref={infoRef}>
        <h2>상세정보</h2>
        <p className={`description ${showFull ? "expanded" : ""}`}>
          {mountainData.description}
        </p>

        {/* 더보기 버튼 */}
        <button className="more-btn" onClick={toggleDescription}>
          {showFull ? "내용 닫기 -" : "내용 더보기 +"}
        </button>
      </div>

      {/* 댓글 부분 */}
      <div ref={commentRef}>
        <CommentSection />
      </div>
    </div>
  );
}

export default DetailPage;
