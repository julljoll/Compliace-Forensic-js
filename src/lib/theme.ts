'use client';

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#524000', // Deep dark tone (Oliva oscuro profundo)
      paper: '#121412',   // Technical environment dark paper
    },
    primary: {
      main: '#FECF06',       // Technical Yellow / Gold
      light: '#FFE052',
      dark: '#C7A100',
      contrastText: '#000000',
    },
    secondary: {
      main: '#00FF41',       // Terminal Green / Matrix Green
      light: '#52FF80',
      dark: '#00B82E',
      contrastText: '#000000',
    },
    info: {
      main: '#9DFF00',       // Lime / Chartreuse Neon
      contrastText: '#000000',
    },
    warning: {
      main: '#FF9500',       // Technical Orange
      contrastText: '#000000',
    },
    error: {
      main: '#FF3B30',       // Critical Red
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#00FF41',
      contrastText: '#000000',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#AEAEB2',
      disabled: '#48484A',
    },
    divider: 'rgba(254, 207, 6, 0.2)', // Thin technical yellow separator
  },
  typography: {
    fontFamily: '"Ubuntu", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      color: '#00FF41',
      fontFamily: '"Ubuntu", monospace',
      fontWeight: 700,
      letterSpacing: '-0.025em',
      fontSize: '1.875rem',
      lineHeight: 1.25,
    },
    h2: {
      color: '#FECF06',
      fontFamily: '"Ubuntu", monospace',
      fontWeight: 600,
      letterSpacing: '-0.02em',
      fontSize: '1.5rem',
      lineHeight: 1.3,
    },
    h3: {
      color: '#FECF06',
      fontFamily: '"Ubuntu", monospace',
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
      backgroundColor: 'rgba(254, 207, 6, 0.18)',
      borderLeft: '3px solid #FECF06',
      paddingLeft: '8px',
      marginTop: '8px',
      marginBottom: '8px',
    },
    h4: {
      color: '#FECF06',
      fontFamily: '"Ubuntu", monospace',
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4,
      backgroundColor: 'rgba(254, 207, 6, 0.18)',
      borderLeft: '3px solid #FECF06',
      paddingLeft: '8px',
      marginTop: '6px',
      marginBottom: '6px',
    },
    h5: {
      color: '#FFFFFF',
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.45,
    },
    h6: {
      color: '#FFFFFF',
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.45,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#524000',
          color: '#FFFFFF',
          minHeight: '100vh',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(254, 207, 6, 0.2)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'rgba(254, 207, 6, 0.4)',
          },
        },
        '::selection': {
          backgroundColor: 'rgba(254, 207, 6, 0.3)',
          color: '#FFFFFF',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#121412',
          backgroundImage: 'none',
          border: '1px solid rgba(254, 207, 6, 0.2)',
          borderRadius: '8px',
          transition: 'border-color 0.2s ease, background-color 0.2s ease',
          '&:hover': {
            borderColor: 'rgba(254, 207, 6, 0.45)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#121412',
          backgroundImage: 'none',
          border: '1px solid rgba(254, 207, 6, 0.2)',
          borderRadius: '8px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          fontFamily: '"Ubuntu", sans-serif',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
          '&.MuiButton-containedPrimary': {
            backgroundColor: '#FECF06',
            color: '#000000',
            '&:hover': {
              backgroundColor: '#FFE052',
            },
          },
          '&.MuiButton-containedSecondary': {
            backgroundColor: '#00FF41',
            color: '#000000',
            '&:hover': {
              backgroundColor: '#52FF80',
            },
          },
          '&.MuiButton-outlinedPrimary': {
            borderColor: '#FECF06',
            color: '#FECF06',
            '&:hover': {
              borderColor: '#FFE052',
              backgroundColor: 'rgba(254, 207, 6, 0.08)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          fontWeight: 500,
          fontSize: '0.75rem',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            '& fieldset': {
              borderColor: 'rgba(254, 207, 6, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(254, 207, 6, 0.45)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FECF06',
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(254, 207, 6, 0.15)',
          color: '#FFFFFF',
        },
        head: {
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          color: '#FECF06',
          fontWeight: 600,
          fontFamily: '"Ubuntu", monospace',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#121412',
          border: '1px solid rgba(254, 207, 6, 0.35)',
          borderRadius: '12px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.8)',
        },
      },
    },
  },
});
