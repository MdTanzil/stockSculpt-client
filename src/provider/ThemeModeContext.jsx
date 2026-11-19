import { createContext } from "react";

// Kept in its own file so ThemeModeProvider only exports a component
// (the react-refresh lint rule warns otherwise).
export const ThemeModeContext = createContext({
  mode: "light",
  toggleMode: () => {},
});
