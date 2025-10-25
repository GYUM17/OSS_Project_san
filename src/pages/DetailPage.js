import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import CommentSection from "../components/Commentsection";
import { fetchMountainDetail, getCachedMountainSummary } from "../services/mountainService";

const FALLBACK_IMAGE = "/mou.jpg";
const TABS = [
  { label: "사진보기", value: "photo" },
  { label: "상세정보", value: "info" },
  { label: "후기", value: "comment" },
];

function DetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const cachedSummary = id ? getCachedMountainSummary(id) : null;
  const initialData = location.state ?? cachedSummary ?? null;

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
    if (!ref.current) return;
    ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleTabChange = (_event, value) => {
    setActiveTab(value);
    if (value === "photo") scrollToSection(photoRef);
    if (value === "info") scrollToSection(infoRef);
    if (value === "comment") scrollToSection(commentRef);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 120;
      const infoTop = infoRef.current?.offsetTop ?? Infinity;
      const commentTop = commentRef.current?.offsetTop ?? Infinity;

      if (scrollY >= commentTop) setActiveTab("comment");
      else if (scrollY >= infoTop) setActiveTab("info");
      else setActiveTab("photo");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!location.state && cachedSummary && !mountainData) {
      setMountainData(cachedSummary);
      setLoading(false);
    }
  }, [cachedSummary, location.state, mountainData]);

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

  const getDifficultyStyles = (level) => {
    const palette = {
      상: { bg: "success.dark", color: "#fff" },
      중: { bg: "success.main", color: "#fff" },
      하: { bg: "success.light", color: "#1f3d1f" },
    };
    return palette[level] ?? { bg: "grey.200", color: "text.primary" };
  };

  if (loading && !mountainData) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" mt={2}>
          상세 정보를 불러오는 중입니다...
        </Typography>
      </Container>
    );
  }

  if (error && !mountainData) {
    return (
      <Container maxWidth="md" sx={{ py: 10 }}>
        <Typography color="error" align="center">
          {error.message}
        </Typography>
      </Container>
    );
  }

  if (!mountainData) {
    return (
      <Container maxWidth="md" sx={{ py: 10 }}>
        <Typography align="center">표시할 산 정보가 없습니다.</Typography>
      </Container>
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
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, minHeight: "70vh" }}>
      {error && mountainData && (
        <Typography color="error" variant="body2" mb={2}>
          {error.message}
        </Typography>
      )}

      <Stack spacing={2}>
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
          <Typography variant="body2" color="text.secondary">
            난이도
          </Typography>
          <Stack direction="row" spacing={1}>
            {["상", "중", "하"].map((level) => {
              const styles = getDifficultyStyles(level);
              const isActive = difficulty === level;
              return (
                <Chip
                  key={level}
                  label={level}
                  size="small"
                  sx={{
                    fontWeight: isActive ? 700 : 500,
                    backgroundColor: isActive ? styles.bg : "transparent",
                    color: isActive ? styles.color : "text.secondary",
                    border: "1px solid",
                    borderColor: isActive ? styles.bg : "divider",
                  }}
                />
              );
            })}
          </Stack>
        </Stack>

        <Box>
          <Typography variant="h3" fontWeight={800}>
            {title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" mt={1}>
            {address}
            {heightText ? ` · ${heightText}` : ""}
          </Typography>
        </Box>

        <Box
          sx={{
            position: "sticky",
            top: 90,
            zIndex: 8,
            backgroundColor: "background.paper",
            borderRadius: 3,
            boxShadow: 2,
            mt: 2,
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
          >
            {TABS.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
        </Box>

        <Card ref={photoRef} sx={{ mt: 4, borderRadius: 4, boxShadow: 4 }}>
          <CardMedia
            component="img"
            image={imageSrc}
            alt={title}
            sx={{ height: { xs: 320, md: 500 }, objectFit: "cover" }}
            onError={() => {
              if (imageSrc !== FALLBACK_IMAGE) {
                setImageSrc(FALLBACK_IMAGE);
              }
            }}
          />
        </Card>

        <Box ref={infoRef} sx={{ mt: 6 }}>
          <Typography variant="h5" fontWeight={700}>
            상세정보
          </Typography>
          <Typography
            variant="body1"
            mt={2}
            sx={{
              color: "text.primary",
              display: "-webkit-box",
              WebkitLineClamp: showFull ? "unset" : 5,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description}
          </Typography>
          <Button
            variant="text"
            color="primary"
            onClick={() => setShowFull((prev) => !prev)}
            sx={{ mt: 1, fontWeight: 600 }}
          >
            {showFull ? "내용 닫기 -" : "내용 더보기 +"}
          </Button>

          <Grid container spacing={3} mt={1}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  p: 3,
                  height: "100%",
                }}
              >
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  교통 정보
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {transport}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  p: 3,
                  height: "100%",
                }}
              >
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  주변 관광 정보
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {tourismInfo}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box ref={commentRef}>
          <CommentSection mountainId={mountainData.id} />
        </Box>
      </Stack>
    </Container>
  );
}

export default DetailPage;
