import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2e7d32",
      light: "#60ad5e",
      dark: "#005005",
    },
    secondary: {
      main: "#ffb74d",
    },
    background: {
      default: "#fcfaf6",
      paper: "#fffefa",
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily:
      "'Pretendard', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: 15,
    body1: {
      fontSize: "1.05rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.98rem",
      lineHeight: 1.55,
    },
    h3: {
      fontWeight: 700,
      fontSize: "2.4rem",
    },
    h4: {
      fontWeight: 700,
      fontSize: "2rem",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.45rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.2rem",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      fontSize: "1.05rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 18,
        },
      },
    },
  },
});

export default theme;
