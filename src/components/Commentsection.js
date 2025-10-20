import React, { useEffect, useMemo, useState } from "react";
import {
  fetchReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../services/reviewService";
import "./CommentSection.css";

const fallbackReviews = [
  {
    id: "seed-1",
    userName: "원중",
    content: "가벼운 등산길이라 주말 산책 코스로 딱 좋아요. 정상에서 내려다보는 도시 야경이 최고!",
    createdAt: "2025-06-27T09:00:00Z",
    likes: 12,
    replies: 3,
  },
  {
    id: "seed-2",
    userName: "지은",
    content: "봄에 벚꽃이 터질 때 꼭 다시 가보고 싶은 산이에요. 초보자도 부담 없이 오를 수 있어요.",
    createdAt: "2025-03-19T12:00:00Z",
    likes: 8,
    replies: 1,
  },
];

export default function CommentSection() {
  const [reviews, setReviews] = useState(fallbackReviews);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formValues, setFormValues] = useState({ userName: "", content: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const orderedReviews = useMemo(
    () =>
      [...reviews].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [reviews]
  );

  useEffect(() => {
    let ignore = false;

    const loadReviews = async () => {
      setLoading(true);
      try {
        const data = await fetchReviews();
        if (!ignore && Array.isArray(data) && data.length > 0) {
          setReviews(data);
        }
      } catch (err) {
        if (!ignore) {
          setError("후기를 불러오지 못했습니다. 설정된 MockAPI 주소를 확인해 주세요.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadReviews();
    return () => {
      ignore = true;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormValues({ userName: "", content: "" });
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formValues.userName.trim() || !formValues.content.trim()) return;

    setIsSubmitting(true);

    const payload = {
      userName: formValues.userName.trim(),
      content: formValues.content.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      if (editingId) {
        const updated = await updateReview(editingId, payload);
        setReviews((prev) =>
          prev.map((item) => (item.id === editingId ? { ...item, ...updated } : item))
        );
      } else {
        const created = await createReview(payload);
        setReviews((prev) => [{ ...payload, ...created }, ...prev]);
      }
      resetForm();
    } catch (err) {
      // MockAPI 주소가 아직 없을 때는 로컬 목록만 업데이트합니다.
      const localReview = {
        id: editingId ?? `local-${Date.now()}`,
        ...payload,
        likes: 0,
        replies: 0,
      };

      setReviews((prev) =>
        editingId
          ? prev.map((item) => (item.id === editingId ? { ...item, ...localReview } : item))
          : [localReview, ...prev]
      );

      setError("임시로 로컬 목록을 갱신했습니다. MockAPI 연결 후 다시 시도해 주세요.");
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (review) => {
    setFormValues({ userName: review.userName, content: review.content });
    setEditingId(review.id);
  };

  const handleDelete = async (id) => {
    const previous = reviews;
    setReviews((prev) => prev.filter((item) => item.id !== id));
    try {
      await deleteReview(id);
    } catch (err) {
      setReviews(previous);
      setError("삭제에 실패했습니다. MockAPI 연결 상태를 확인해 주세요.");
    }
  };

  return (
    <section className="comment-section" aria-labelledby="comment-heading">
      <div className="comment-header">
        <div>
          <h2 id="comment-heading">후기</h2>
          <p className="comment-subtitle">
            다녀온 경험을 공유하면 다른 등산객에게 큰 도움이 됩니다.
          </p>
        </div>
      </div>

      <form className="comment-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label className="visually-hidden" htmlFor="reviewer-name">
            작성자 이름
          </label>
          <input
            id="reviewer-name"
            name="userName"
            type="text"
            placeholder="이름을 입력하세요"
            value={formValues.userName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label className="visually-hidden" htmlFor="review-content">
            후기 내용
          </label>
          <textarea
            id="review-content"
            name="content"
            placeholder="산행 후기를 남겨주세요 (최소 10자 이상)"
            value={formValues.content}
            onChange={handleChange}
            rows={3}
            minLength={10}
            required
          />
        </div>

        <div className="form-actions">
          {editingId && (
            <button type="button" className="ghost-btn" onClick={resetForm}>
              수정 취소
            </button>
          )}
          <button type="submit" className="write-btn" disabled={isSubmitting}>
            {editingId ? "후기 수정" : "후기 작성"}
          </button>
        </div>
      </form>

      {loading && <p className="comment-status">후기를 불러오는 중입니다...</p>}
      {error && <p className="comment-status error">{error}</p>}

      <ul className="comment-list">
        {orderedReviews.map((review) => (
          <li key={review.id} className="comment-item">
            <img src="/profile1.png" alt="" className="comment-avatar" />

            <div className="comment-body">
              <div className="comment-info">
                <span className="comment-user">{review.userName}</span>
                <span className="divider" aria-hidden="true">
                  |
                </span>
                <time className="comment-date" dateTime={review.createdAt}>
                  {new Date(review.createdAt).toLocaleDateString("ko-KR")}
                </time>
              </div>

              <p className="comment-text">{review.content}</p>

              <div className="comment-actions">
                <div className="icons">
                  <div className="icon-wrappers">
                    <img src="/heart.png" alt="" className="icon-img" />
                    <span>{review.likes ?? 0}</span>
                  </div>
                  <div className="icon-wrappers">
                    <img src="/chat.png" alt="" className="icon-img" />
                    <span>{review.replies ?? 0}</span>
                  </div>
                </div>

                <div className="comment-buttons">
                  <button type="button" className="modify-btn" onClick={() => handleEdit(review)}>
                    수정
                  </button>
                  <button type="button" className="modify-btn" onClick={() => handleDelete(review.id)}>
                    삭제
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
