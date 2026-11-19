/* eslint-disable react/prop-types */
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { useCallback, useEffect, useMemo, useState } from "react";
import createStockSculptTheme from "../theme";
import { ThemeModeContext } from "./ThemeModeContext";

const STORAGE_KEY = "stocksculpt-theme";

const readStoredMode = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "dark"
      ? "dark"
      : "light";
  } catch {
    return "light";
  }
};

/**
 * Holds the light/dark mode at the app root: initialized from
 * localStorage ("stocksculpt-theme", default "light"), persisted on
 * change, and passed to MUI's ThemeProvider. Also toggles a `dark` class
 * on <html> so non-MUI UI (SweetAlert2 dialogs, native scrollbars) can
 * restyle itself via the rules in index.css.
 */
const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState(readStoredMode);

  const toggleMode = useCallback(
    () => setMode((current) => (current === "light" ? "dark" : "light")),
    []
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Private browsing or blocked storage — the mode still works
      // for this session, it just won't be remembered.
    }
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);

  const theme = useMemo(() => createStockSculptTheme(mode), [mode]);
  const value = useMemo(() => ({ mode, toggleMode }), [mode, toggleMode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export default ThemeModeProvider;
