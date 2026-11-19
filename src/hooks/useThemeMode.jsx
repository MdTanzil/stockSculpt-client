import { useContext } from "react";
import { ThemeModeContext } from "../provider/ThemeModeContext";

const useThemeMode = () => {
  return useContext(ThemeModeContext);
};

export default useThemeMode;
