import { createTheme } from "@mui/material/styles";

// stockSculpt brand theme — primary #2c3e50 (dark slate, the same color
// as the previous Tailwind primary and the invoice PDF brand color),
// Poppins body font (loaded from Google Fonts in index.css), light mode.
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2c3e50",
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
  },
});

export default theme;
