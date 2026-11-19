import { createTheme } from "@mui/material/styles";

// stockSculpt brand theme — primary #2c3e50 (dark slate, the same color
// as the previous Tailwind primary and the invoice PDF brand color),
// Poppins body font (loaded from Google Fonts in index.css).
//
// Dark mode note: primary.main is a lighter slate tint (#8fb0c7) in dark
// mode instead of the literal #2c3e50. About 25 headings and links across
// the app use the primary color as text, and #2c3e50 on the dark
// background (#121212) is near-unreadable (~1.7:1 contrast). The lighter
// tint is the same brand hue, readable on dark surfaces, and the dark
// navy itself stays on the navbar, footer and sidebar, which use
// hardcoded colors independent of the theme.
const createStockSculptTheme = (mode = "light") =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "dark" ? "#8fb0c7" : "#2c3e50",
      },
    },
    typography: {
      fontFamily: "'Poppins', sans-serif",
    },
    components: {
      // MUI Menu (used by Select dropdowns) locks page scroll by default
      // and compensates with body padding, which shifts the layout.
      // Menus are short-lived overlays, so disabling the scroll lock
      // is safe here.
      MuiMenu: {
        defaultProps: {
          disableScrollLock: true,
        },
      },
    },
  });

export default createStockSculptTheme;
