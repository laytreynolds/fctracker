import React from "react"
import App from "./App"

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material"
import { BrowserRouter } from 'react-router-dom'

export default function Theme() {
    const [darkMode, setDarkMode] = React.useState(false);
    const theme = React.useMemo(
      () => createTheme({ palette: { mode: darkMode ? "dark" : "light" } }),
      [darkMode]
    );
  
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <App darkMode={darkMode} setDarkMode={setDarkMode} />
        </BrowserRouter>
      </ThemeProvider>
    );
  }