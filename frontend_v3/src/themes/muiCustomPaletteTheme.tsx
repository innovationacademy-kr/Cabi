import { createTheme } from "@mui/material/styles";

const muiCustomPaletteTheme = createTheme({
  typography: {
    fontFamily: ["EliceDigitalBaeum_Regular", "sans-serif"].join(","),
  },
  palette: {
    primary: {
      main: "#5657a5",
      // light: main값을 통해 계산됨
      // dark: main값을 통해 계산됨
      // contrastText: main값을 통해 계산됨
    },
    secondary: {
      main: "#6c757d",
    },
  },
});

export default muiCustomPaletteTheme;
