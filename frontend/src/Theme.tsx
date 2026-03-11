import React from "react"
import App from "./App"
import ErrorBoundary from "@/components/ErrorBoundary"
import { AuthProvider } from "@/context/AuthContext"

import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import '@fontsource/inter/900.css';
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material"
import { BrowserRouter } from 'react-router-dom'

declare module '@mui/material/styles' {
  interface Palette {
    accent: Palette['primary'];
  }
  interface PaletteOptions {
    accent?: PaletteOptions['primary'];
  }
}

const colors = {
  bg: '#0a0a0b',
  surface: '#141416',
  border: '#232328',
  textPrimary: '#f0f0f2',
  textSecondary: '#8a8a96',
  accent: '#6c63ff',
  accentHover: '#7b73ff',
  green: '#4ade80',
  orange: '#fb923c',
  pink: '#f472b6',
  blue: '#60a5fa',
};

function buildTheme(mode: 'dark' | 'light') {
  if (mode === 'light') {
    return createTheme({
      palette: { mode: 'light' },
      typography: { fontFamily: '"Inter", sans-serif' },
    });
  }

  return createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: colors.bg,
        paper: colors.surface,
      },
      primary: {
        main: colors.accent,
        light: colors.accentHover,
      },
      secondary: {
        main: colors.pink,
      },
      accent: {
        main: colors.accent,
        light: colors.accentHover,
        dark: '#5a52d9',
        contrastText: '#fff',
      },
      success: { main: colors.green },
      warning: { main: colors.orange },
      info: { main: colors.blue },
      error: { main: '#ef4444' },
      text: {
        primary: colors.textPrimary,
        secondary: colors.textSecondary,
      },
      divider: colors.border,
    },

    typography: {
      fontFamily: '"Inter", sans-serif',
      h1: {
        fontWeight: 900,
        fontSize: 'clamp(3rem, 5vw, 5.5rem)',
        letterSpacing: '-0.03em',
        lineHeight: 1.05,
        color: colors.textPrimary,
      },
      h2: {
        fontWeight: 800,
        fontSize: 'clamp(2rem, 3.5vw, 3rem)',
        letterSpacing: '-0.02em',
        lineHeight: 1.15,
        color: colors.textPrimary,
      },
      h3: {
        fontWeight: 800,
        fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
        letterSpacing: '-0.015em',
        lineHeight: 1.2,
        color: colors.textPrimary,
      },
      h4: {
        fontWeight: 700,
        fontSize: '1.75rem',
        letterSpacing: '-0.01em',
        color: colors.textPrimary,
      },
      h5: {
        fontWeight: 700,
        fontSize: '1.375rem',
        letterSpacing: '-0.01em',
        color: colors.textPrimary,
      },
      h6: {
        fontWeight: 600,
        fontSize: '1.125rem',
        color: colors.textPrimary,
      },
      body1: {
        fontSize: '1.125rem',
        lineHeight: 1.6,
        color: colors.textPrimary,
      },
      body2: {
        fontSize: '0.975rem',
        lineHeight: 1.6,
        color: colors.textSecondary,
      },
      subtitle1: {
        fontSize: '1rem',
        color: colors.textSecondary,
      },
      subtitle2: {
        fontSize: '0.875rem',
        color: colors.textSecondary,
      },
      overline: {
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: colors.textSecondary,
      },
      button: {
        fontWeight: 600,
        textTransform: 'none',
        letterSpacing: '0.01em',
      },
    },

    shape: {
      borderRadius: 12,
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: colors.bg,
            scrollBehavior: 'smooth',
          },
          '::-webkit-scrollbar': {
            width: '6px',
          },
          '::-webkit-scrollbar-track': {
            background: colors.bg,
          },
          '::-webkit-scrollbar-thumb': {
            background: colors.border,
            borderRadius: '3px',
          },
          '::-webkit-scrollbar-thumb:hover': {
            background: colors.textSecondary,
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: '16px',
            backgroundImage: 'none',
            transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              borderColor: colors.accent,
              boxShadow: `0 8px 32px ${colors.accent}15`,
            },
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: colors.surface,
            backgroundImage: 'none',
            border: `1px solid ${colors.border}`,
          },
        },
      },

      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: `${colors.bg}cc`,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: `1px solid ${colors.border}`,
            boxShadow: 'none',
            backgroundImage: 'none',
          },
        },
      },

      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: colors.surface,
            borderRight: `1px solid ${colors.border}`,
            backgroundImage: 'none',
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 600,
            padding: '8px 20px',
            transition: 'all 0.2s ease',
          },
          contained: {
            backgroundColor: colors.accent,
            color: '#fff',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: colors.accentHover,
              boxShadow: `0 4px 16px ${colors.accent}40`,
              transform: 'translateY(-1px)',
            },
          },
          outlined: {
            borderColor: colors.border,
            color: colors.textPrimary,
            '&:hover': {
              borderColor: colors.accent,
              backgroundColor: `${colors.accent}10`,
              color: colors.accent,
            },
          },
          text: {
            color: colors.textSecondary,
            '&:hover': {
              backgroundColor: `${colors.accent}10`,
              color: colors.accent,
            },
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '100px',
            fontWeight: 500,
            border: `1px solid ${colors.border}`,
            transition: 'all 0.2s ease',
          },
          colorSuccess: {
            backgroundColor: `${colors.green}18`,
            color: colors.green,
            borderColor: `${colors.green}30`,
          },
          colorInfo: {
            backgroundColor: `${colors.blue}18`,
            color: colors.blue,
            borderColor: `${colors.blue}30`,
          },
          colorWarning: {
            backgroundColor: `${colors.orange}18`,
            color: colors.orange,
            borderColor: `${colors.orange}30`,
          },
          colorError: {
            backgroundColor: '#ef444418',
            color: '#ef4444',
            borderColor: '#ef444430',
          },
          colorPrimary: {
            backgroundColor: `${colors.accent}18`,
            color: colors.accent,
            borderColor: `${colors.accent}30`,
          },
        },
      },

      MuiTableContainer: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
          },
        },
      },

      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-head': {
              backgroundColor: `${colors.accent}0a`,
              color: colors.textSecondary,
              fontWeight: 600,
              fontSize: '0.75rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              borderBottom: `1px solid ${colors.border}`,
            },
          },
        },
      },

      MuiTableRow: {
        styleOverrides: {
          root: {
            transition: 'background-color 0.2s ease',
            '&:hover': {
              backgroundColor: `${colors.accent}08`,
            },
            '&:last-child td': {
              borderBottom: 0,
            },
          },
        },
      },

      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${colors.border}`,
            color: colors.textPrimary,
            fontSize: '0.925rem',
          },
        },
      },

      MuiTablePagination: {
        styleOverrides: {
          root: {
            borderTop: `1px solid ${colors.border}`,
            color: colors.textSecondary,
          },
        },
      },

      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: '16px',
            backgroundImage: 'none',
          },
        },
      },

      MuiDialogTitle: {
        styleOverrides: {
          root: {
            fontWeight: 700,
            fontSize: '1.25rem',
          },
        },
      },

      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              '& fieldset': {
                borderColor: colors.border,
                transition: 'border-color 0.2s ease',
              },
              '&:hover fieldset': {
                borderColor: colors.textSecondary,
              },
              '&.Mui-focused fieldset': {
                borderColor: colors.accent,
                borderWidth: '1px',
              },
            },
          },
        },
      },

      MuiSelect: {
        styleOverrides: {
          root: {
            borderRadius: '10px',
          },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: '10px',
            '& fieldset': {
              borderColor: colors.border,
            },
            '&:hover fieldset': {
              borderColor: `${colors.textSecondary} !important`,
            },
            '&.Mui-focused fieldset': {
              borderColor: `${colors.accent} !important`,
              borderWidth: '1px !important',
            },
          },
        },
      },

      MuiSwitch: {
        styleOverrides: {
          root: {
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: colors.accent,
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: colors.accent,
            },
          },
        },
      },

      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: '10px',
            margin: '2px 8px',
            transition: 'all 0.2s ease',
            '&.Mui-selected': {
              backgroundColor: `${colors.accent}15`,
              color: colors.accent,
              '& .MuiListItemIcon-root': {
                color: colors.accent,
              },
              '&:hover': {
                backgroundColor: `${colors.accent}22`,
              },
            },
            '&:hover': {
              backgroundColor: `${colors.accent}0a`,
            },
          },
        },
      },

      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: colors.border,
          },
        },
      },

      MuiCircularProgress: {
        styleOverrides: {
          root: {
            color: colors.accent,
          },
        },
      },

      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: `${colors.accent}15`,
              color: colors.accent,
            },
          },
        },
      },

      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            backgroundImage: 'none',
          },
        },
      },

      MuiMenuItem: {
        styleOverrides: {
          root: {
            transition: 'background-color 0.15s ease',
            '&:hover': {
              backgroundColor: `${colors.accent}10`,
            },
            '&.Mui-selected': {
              backgroundColor: `${colors.accent}18`,
              '&:hover': {
                backgroundColor: `${colors.accent}22`,
              },
            },
          },
        },
      },

      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: '10px',
          },
        },
      },

      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            color: colors.textPrimary,
            fontSize: '0.8rem',
          },
        },
      },
    },
  });
}

export default function Theme() {
  const [darkMode, setDarkMode] = React.useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) return savedMode === "true";
    return true;
  });

  React.useEffect(() => {
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  const theme = React.useMemo(
    () => buildTheme(darkMode ? "dark" : "light"),
    [darkMode]
  );

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AuthProvider>
            <App darkMode={darkMode} setDarkMode={setDarkMode} />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
