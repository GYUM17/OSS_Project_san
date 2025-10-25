import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

function MyPage() {
  const [user] = useState({
    name: "원중",
    email: "wonjung1919@handong.ac.kr",
    profileImage: "/sanlogo.png",
  });

  const [reviews] = useState([
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

  const [favorites] = useState([
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
      id: 5,
      mountainName: "도봉산",
      address: "서울특별시 도봉구",
      image: "/mou.jpg",
    },
    {
      id: 6,
      mountainName: "북한산",
      address: "서울특별시 은평구",
      image: "/mou.jpg",
    },
  ]);

  const [visibleCount, setVisibleCount] = useState(2);
  const [visibleFavorites, setVisibleFavorites] = useState(4);

  const reviewsToShow = reviews.slice(0, visibleCount);
  const favoritesToShow = favorites.slice(0, visibleFavorites);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          mb: 4,
        }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center">
          <Avatar
            src={user.profileImage}
            alt={user.name}
            sx={{ width: 96, height: 96, border: "3px solid", borderColor: "success.light" }}
          />
          <Box textAlign={{ xs: "center", sm: "left" }}>
            <Typography variant="h5" fontWeight={700}>
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {user.email}
            </Typography>
            <Stack direction="row" spacing={2} justifyContent={{ xs: "center", sm: "flex-start" }} mt={2}>
              <Typography fontWeight={600}>후기 {reviews.length}</Typography>
              <Typography fontWeight={600}>즐겨찾기 {favorites.length}</Typography>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          p: { xs: 3, md: 4 },
          mb: 4,
        }}
      >
        <Typography variant="h5" fontWeight={700} gutterBottom>
          후기
        </Typography>
        <Stack spacing={2}>
          {reviewsToShow.map((review) => (
            <Card
              key={review.id}
              variant="outlined"
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                borderRadius: 3,
              }}
            >
              <CardMedia
                component="img"
                image={review.image}
                alt={review.mountainName}
                sx={{ width: { xs: "100%", sm: 160 }, height: 140, objectFit: "cover" }}
              />
              <CardContent sx={{ flex: 1, position: "relative" }}>
                <Typography variant="h6" fontWeight={700}>
                  {review.mountainName}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  {review.address}
                </Typography>
                <Typography variant="body2" mt={1.5}>
                  {review.content.length > 100 ? `${review.content.slice(0, 100)}...` : review.content}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ position: "absolute", bottom: 16, right: 16 }}>
                  {review.createdAt}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>

        {visibleCount < reviews.length && (
          <Box textAlign="center" mt={3}>
            <Button variant="contained" color="primary" onClick={() => setVisibleCount((prev) => prev + 2)}>
              후기 더보기
            </Button>
          </Box>
        )}
      </Paper>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          p: { xs: 3, md: 4 },
        }}
      >
        <Typography variant="h5" fontWeight={700} gutterBottom>
          즐겨찾기
        </Typography>
        <Grid container spacing={2}>
          {favoritesToShow.map((fav) => (
            <Grid item xs={12} sm={6} md={3} key={`${fav.id}-${fav.mountainName}`}>
              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardMedia component="img" image={fav.image} alt={fav.mountainName} sx={{ height: 140 }} />
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {fav.mountainName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {fav.address}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {visibleFavorites < favorites.length && (
          <Box textAlign="center" mt={3}>
            <Button variant="outlined" onClick={() => setVisibleFavorites((prev) => prev + 4)}>
              즐겨찾기 더보기
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default MyPage;
