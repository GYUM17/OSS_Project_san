import React from "react";
import "./CommentSection.css";

export default function CommentSection() {
  return (
    <div className="comment-section">
      {/* 맨 윗 부분 - 댓글, 글쓰기 부분*/}
      <div className="comment-header">
        <h2>댓글</h2>
        <button className="write-btn">글쓰기</button>
      </div>

      {/* 댓글 구조 - 프로필, 이름 | 등록 날짜 */}
      <div className="comment-item">
        <img src="/profile1.png" alt="user" className="comment-avatar" />

        <div className="comment-body">
          <div className="comment-info">
            <span className="comment-user">원중</span>
            <span className="divider">|</span>
            <span className="comment-date">2025. 06. 27</span>
          </div>

          <p className="comment-text">ㅁㄴㅇㄻㄴㄹㅇㅁㄴㄻㄴㅇㄹㅇㅁㄴㄻㄴㅇ</p>

          <div className="comment-actions">
            <div className="icons">
              <div className="icon-wrappers">
                <img src="/heart.png" alt="like" className="icon-img" />
                <span>12</span>
              </div>
              <div className="icon-wrappers">
                <img src="/chat.png" alt="comment" className="icon-img" />
                <span>3</span>
              </div>
            </div>

            <button className="modify-btn">수정</button>
          </div>
        </div>
      </div>

      {/* 더보기 버튼 */}
      <button className="load-more">댓글 더보기 +</button>
    </div>
  );
}
