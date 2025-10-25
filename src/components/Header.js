import React, { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";

const LANGUAGES = ["한국어", "English", "日本語", "中文"];
const NAV_LINKS = [
  { label: "홈", to: "/" },
  { label: "테마", to: "", disabled: true },
  { label: "지역", to: "", disabled: true },
];

function Header() {
  const [languageAnchor, setLanguageAnchor] = useState(null);
  const location = useLocation();

  const isActive = (path) => {
    if (!path) return false;
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={3}
      sx={{
        backgroundColor: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(46,125,50,0.08)",
      }}
    >
      <Toolbar
        sx={{
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "space-between",
          minHeight: { xs: 88, md: 96 },
          py: 2.5,
          px: { xs: 2, sm: 3.5, md: 5 },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Button
            component={RouterLink}
            to="/"
            sx={{ p: 0, minWidth: "auto" }}
            aria-label="산 너머 홈으로 이동"
          >
            <Box
              component="img"
              src="/logo.png"
              alt="산 너머 로고"
              sx={{ height: 56 }}
            />
          </Button>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            flexGrow: 1,
            justifyContent: { xs: "flex-start", md: "center" },
          }}
        >
          {NAV_LINKS.map((link) => {
            const buttonProps = link.to
              ? { component: RouterLink, to: link.to }
              : {};
            const active = isActive(link.to);
            return (
              <Button
                key={link.label}
                {...buttonProps}
                disabled={link.disabled}
                color={active ? "primary" : "inherit"}
                sx={{
                  fontWeight: active ? 700 : 500,
                  fontSize: { xs: "0.95rem", md: "1.05rem" },
                  px: { xs: 1, md: 2.5 },
                  py: 1,
                  opacity: link.disabled ? 0.5 : 1,
                }}
              >
                {link.label}
              </Button>
            );
          })}
        </Stack>

        <Stack direction="row" spacing={1.2}>
          <IconButton
            color="primary"
            aria-label="검색"
            size="large"
            sx={{
              border: "1px solid",
              borderColor: "primary.main",
              borderRadius: 2,
              width: 52,
              height: 52,
            }}
          >
            <SearchRoundedIcon />
          </IconButton>
          <IconButton
            color="primary"
            component={RouterLink}
            to="/mypage"
            aria-label="마이페이지"
            size="large"
            sx={{
              border: "1px solid",
              borderColor: "primary.main",
              borderRadius: 2,
              width: 52,
              height: 52,
            }}
          >
            <PersonOutlineRoundedIcon />
          </IconButton>
          <IconButton
            color="primary"
            aria-label="언어 선택"
            onClick={(event) => setLanguageAnchor(event.currentTarget)}
            size="large"
            sx={{
              border: "1px solid",
              borderColor: "primary.main",
              borderRadius: 2,
              width: 52,
              height: 52,
            }}
          >
            <LanguageRoundedIcon />
          </IconButton>
          <Menu
            anchorEl={languageAnchor}
            open={Boolean(languageAnchor)}
            onClose={() => setLanguageAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            {LANGUAGES.map((language) => (
              <MenuItem
                key={language}
                onClick={() => setLanguageAnchor(null)}
              >
                {language}
              </MenuItem>
            ))}
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
