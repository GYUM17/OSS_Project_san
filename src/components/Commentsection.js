import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { Controller, useForm } from "react-hook-form";
import {
  fetchReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../services/reviewService";

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
  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      nickname: "",
      rating: 5,
      content: "",
    },
  });
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
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          setError("");
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

  const resetForm = () => {
    reset({ nickname: "", rating: 5, content: "" });
    setEditingId(null);
  };

  const onSubmit = async (formValues) => {
    if (!formValues.nickname.trim() || !formValues.content.trim()) return;
    if (!mountainId) {
      setError("산 정보를 불러온 뒤 후기를 작성할 수 있습니다.");
      return;
    }

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
      setError(null);
      resetForm();
    } catch (err) {
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
    }
  };

  const handleEdit = (review) => {
    reset({
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
    <Paper elevation={4} sx={{ p: { xs: 2.5, md: 4 }, mt: 4 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={1.5}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            후기
          </Typography>
          <Typography variant="body2" color="text.secondary">
            다녀온 경험을 공유하면 다른 등산객에게 큰 도움이 됩니다.
          </Typography>
        </Box>
        {loading && (
          <Stack direction="row" alignItems="center" spacing={1}>
            <CircularProgress size={20} />
            <Typography variant="body2" color="text.secondary">
              불러오는 중...
            </Typography>
          </Stack>
        )}
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", md: "center" }}
        >
          <TextField
            label="작성자 이름"
            {...register("nickname", {
              required: "이름을 입력해 주세요.",
              minLength: { value: 2, message: "이름은 최소 2자 이상이어야 합니다." },
            })}
            placeholder="이름을 입력하세요"
            fullWidth
            error={Boolean(errors.nickname)}
            helperText={errors.nickname?.message}
          />
          <Controller
            name="rating"
            control={control}
            rules={{ required: true, min: 1, max: 5 }}
            render={({ field: { value, onChange } }) => (
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Typography variant="body2" color="text.secondary">
                  평점
                </Typography>
                <Rating
                  value={Number(value) || 0}
                  onChange={(_, newValue) => onChange(newValue ?? 0)}
                  precision={1}
                />
              </Stack>
            )}
          />
        </Stack>

        <TextField
          label="후기 내용"
          {...register("content", {
            required: "후기 내용을 입력해 주세요.",
            minLength: { value: 10, message: "최소 10자 이상 작성해 주세요." },
          })}
          placeholder="산행 후기를 남겨주세요 (최소 10자 이상)"
          multiline
          minRows={4}
          error={Boolean(errors.content)}
          helperText={errors.content?.message}
        />

        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          {editingId && (
            <Button variant="text" onClick={resetForm}>
              수정 취소
            </Button>
          )}
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {editingId ? "후기 수정" : "후기 작성"}
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Stack spacing={2}>
        {orderedReviews.map((review) => (
          <Paper
            key={review.id}
            variant="outlined"
            sx={{ p: 2.5, borderRadius: 3 }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <Avatar
                src="/profile1.png"
                alt={review.nickname ?? "익명"}
                sx={{ width: 52, height: 52 }}
              />
              <Box flex={1} width="100%">
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: 0.5, sm: 1.5 }}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    {review.nickname ?? "익명"}
                  </Typography>
                  <Rating
                    value={Number(review.rating) || 0}
                    readOnly
                    size="small"
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    component="time"
                    dateTime={review.createdAt}
                  >
                    {new Date(review.createdAt).toLocaleDateString("ko-KR")}
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ mt: 1.5 }}>
                  {review.content}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                <IconButton
                  size="small"
                  onClick={() => handleEdit(review)}
                  aria-label="후기 수정"
                >
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDelete(review.id)}
                  aria-label="후기 삭제"
                >
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
}
