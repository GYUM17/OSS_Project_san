import React, { useEffect, useMemo, useState } from "react";
import {
  fetchReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../services/reviewService";
import "./CommentSection.css";

function createFallbackReview(mntnId) {
  return {
    id: `seed-${mntnId ?? "default"}`,
    mntnId,
    nickname: "익명 등산객",
    rating: 4,
    content: "첫 번째 후기를 남겨주세요!",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export default function CommentSection({ mountainId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formValues, setFormValues] = useState({ nickname: "", rating: 5, content: "" });
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
      if (!mountainId) {
        setReviews([createFallbackReview()]);
        return;
      }
      setLoading(true);
      try {
        const data = await fetchReviews(mountainId);
        if (!ignore) {
          if (Array.isArray(data) && data.length > 0) {
            setReviews(data);
          } else {
            setReviews([createFallbackReview(mountainId)]);
          }
        }
      } catch (err) {
        if (!ignore) {
          setError("후기를 불러오지 못했습니다. 설정된 MockAPI 주소를 확인해 주세요.");
          setReviews([createFallbackReview(mountainId)]);
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
  }, [mountainId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormValues({ nickname: "", rating: 5, content: "" });
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formValues.nickname.trim() || !formValues.content.trim()) return;
    if (!mountainId) {
      setError("산 정보를 불러온 뒤 후기를 작성할 수 있습니다.");
      return;
    }

    setIsSubmitting(true);

    const timestamp = new Date().toISOString();
    const cleanedRating = Math.min(5, Math.max(1, Number(formValues.rating) || 0));

    const basePayload = {
      nickname: formValues.nickname.trim(),
      mntnId: mountainId,
      rating: cleanedRating,
      content: formValues.content.trim(),
    };

    try {
      if (editingId) {
        const updated = await updateReview(editingId, {
          ...basePayload,
          createdAt:
            reviews.find((item) => item.id === editingId)?.createdAt ?? timestamp,
          updatedAt: timestamp,
        });
        setReviews((prev) =>
          prev.map((item) => (item.id === editingId ? { ...item, ...updated } : item))
        );
      } else {
        const created = await createReview({
          ...basePayload,
          createdAt: timestamp,
          updatedAt: timestamp,
        });
        setReviews((prev) => [{ ...basePayload, ...created }, ...prev]);
      }
      resetForm();
    } catch (err) {
      // MockAPI 주소가 아직 없을 때는 로컬 목록만 업데이트합니다.
      const localReview = {
        id: editingId ?? `local-${Date.now()}`,
        mntnId: mountainId,
        ...basePayload,
        createdAt:
          editingId
            ? reviews.find((item) => item.id === editingId)?.createdAt ?? timestamp
            : timestamp,
        updatedAt: timestamp,
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
    setFormValues({
      nickname: review.nickname ?? "",
      rating: review.rating ?? 5,
      content: review.content ?? "",
    });
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
            name="nickname"
            type="text"
            placeholder="이름을 입력하세요"
            value={formValues.nickname}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label className="visually-hidden" htmlFor="review-rating">
            평점
          </label>
          <select
            id="review-rating"
            name="rating"
            value={formValues.rating}
            onChange={handleChange}
            required
          >
            {[5, 4, 3, 2, 1].map((score) => (
              <option key={score} value={score}>
                {score}점
              </option>
            ))}
          </select>
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
                <span className="comment-user">{review.nickname ?? "익명"}</span>
                <span className="comment-rating" aria-label={`평점 ${review.rating ?? 0}점`}>
                  {"★".repeat(Math.max(0, Math.round(review.rating ?? 0)))}
                  {"☆".repeat(Math.max(0, 5 - Math.round(review.rating ?? 0)))}
                </span>
                <span className="divider" aria-hidden="true">
                  |
                </span>
                <time className="comment-date" dateTime={review.createdAt}>
                  {new Date(review.createdAt).toLocaleDateString("ko-KR")}
                </time>
              </div>

              <p className="comment-text">{review.content}</p>

              <div className="comment-actions">
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
