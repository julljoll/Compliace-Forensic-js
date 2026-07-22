'use client';

import { createTheme } from '@mui/material/styles';

// ─── SHA256.US Cyber-Legal Blueprint Design System ───
// Paleta definitiva: Oliva oscuro profundo (#524000) + Terminal Green + Technical Yellow
// Fondo principal del CMS: #0D1117 (negro técnico profundo)
// Sidebar/Brand: #121412
// Acento primario: #FECF06 (Amarillo técnico/oro)
// Acento secundario: #00FF41 (Verde terminal / Matrix)

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0D1117',  // Negro técnico profundo para área de contenido
      paper: '#161B22',    // Paper ligeramente más claro que default
    },
    primary: {
      main: '#FECF06',       // Amarillo técnico / Oro jurídico
      light: '#FFE052',
      dark: '#C7A100',
      contrastText: '#000000',
    },
    secondary: {
      main: '#00FF41',       // Verde terminal / Matrix
      light: '#52FF80',
      dark: '#00B82E',
      contrastText: '#000000',
    },
    info: {
      main: '#9DFF00',       // Lima / Chartreuse Neon — alertas críticas
      contrastText: '#000000',
    },
    warning: {
      main: '#FF9500',       // Naranja técnico
      contrastText: '#000000',
    },
    error: {
      main: '#FF3B30',       // Rojo crítico
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#00FF41',
      contrastText: '#000000',
    },
    text: {
      primary: '#E6EDF3',    // Blanco técnico suavizado (no full white)
      secondary: '#8B949E',  // Gris técnico medio
      disabled: '#484F58',
    },
    divider: 'rgba(254, 207, 6, 0.15)', // Separador amarillo tenue
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
      backgroundColor: 'rgba(254, 207, 6, 0.1)',
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
      backgroundColor: 'rgba(254, 207, 6, 0.08)',
      borderLeft: '3px solid #FECF06',
      paddingLeft: '8px',
      marginTop: '6px',
      marginBottom: '6px',
    },
    h5: {
      color: '#E6EDF3',
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.45,
    },
    h6: {
      color: '#E6EDF3',
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.45,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
    caption: {
      color: '#8B949E',
      fontSize: '0.75rem',
    },
    overline: {
      color: '#FECF06',
      fontSize: '0.65rem',
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
  },

  shape: {
    borderRadius: 8,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0D1117',
          color: '#E6EDF3',
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
            backgroundColor: 'rgba(254, 207, 6, 0.18)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'rgba(254, 207, 6, 0.35)',
          },
        },
        '::selection': {
          backgroundColor: 'rgba(254, 207, 6, 0.25)',
          color: '#FFFFFF',
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#161B22',
          backgroundImage: 'none',
          border: '1px solid rgba(48, 54, 61, 0.8)',
          borderRadius: '8px',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            borderColor: 'rgba(254, 207, 6, 0.3)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#161B22',
          backgroundImage: 'none',
          border: '1px solid rgba(48, 54, 61, 0.8)',
          borderRadius: '8px',
        },
        elevation1: {
          boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
        },
        elevation2: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: '6px',
          textTransform: 'none',
          fontWeight: 600,
          fontFamily: '"Ubuntu", sans-serif',
          fontSize: '0.875rem',
          padding: '6px 16px',
          transition: 'all 0.15s ease',
          '&.MuiButton-containedPrimary': {
            backgroundColor: '#FECF06',
            color: '#000000',
            '&:hover': {
              backgroundColor: '#FFE052',
              boxShadow: '0 0 0 3px rgba(254, 207, 6, 0.2)',
            },
          },
          '&.MuiButton-containedSecondary': {
            backgroundColor: '#00FF41',
            color: '#000000',
            '&:hover': {
              backgroundColor: '#52FF80',
              boxShadow: '0 0 0 3px rgba(0, 255, 65, 0.2)',
            },
          },
          '&.MuiButton-outlinedPrimary': {
            borderColor: 'rgba(254, 207, 6, 0.5)',
            color: '#FECF06',
            '&:hover': {
              borderColor: '#FECF06',
              backgroundColor: 'rgba(254, 207, 6, 0.06)',
            },
          },
          '&.MuiButton-outlinedSecondary': {
            borderColor: 'rgba(0, 255, 65, 0.4)',
            color: '#00FF41',
            '&:hover': {
              borderColor: '#00FF41',
              backgroundColor: 'rgba(0, 255, 65, 0.06)',
            },
          },
          '&.MuiButton-text': {
            color: '#8B949E',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.05)',
              color: '#E6EDF3',
            },
          },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          transition: 'all 0.15s ease',
        },
        sizeMedium: {
          padding: '6px',
        },
        sizeSmall: {
          padding: '4px',
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          fontWeight: 600,
          fontSize: '0.7rem',
          height: '22px',
        },
        colorPrimary: {
          backgroundColor: 'rgba(254, 207, 6, 0.12)',
          color: '#FECF06',
          border: '1px solid rgba(254, 207, 6, 0.25)',
        },
        colorSecondary: {
          backgroundColor: 'rgba(0, 255, 65, 0.1)',
          color: '#00FF41',
          border: '1px solid rgba(0, 255, 65, 0.2)',
        },
        colorSuccess: {
          backgroundColor: 'rgba(0, 255, 65, 0.1)',
          color: '#00FF41',
          border: '1px solid rgba(0, 255, 65, 0.2)',
        },
        colorWarning: {
          backgroundColor: 'rgba(255, 149, 0, 0.1)',
          color: '#FF9500',
          border: '1px solid rgba(255, 149, 0, 0.2)',
        },
        colorError: {
          backgroundColor: 'rgba(255, 59, 48, 0.1)',
          color: '#FF3B30',
          border: '1px solid rgba(255, 59, 48, 0.2)',
        },
        colorInfo: {
          backgroundColor: 'rgba(157, 255, 0, 0.1)',
          color: '#9DFF00',
          border: '1px solid rgba(157, 255, 0, 0.2)',
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(22, 27, 34, 0.8)',
            fontSize: '0.875rem',
            '& fieldset': {
              borderColor: 'rgba(48, 54, 61, 0.8)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(254, 207, 6, 0.35)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FECF06',
              borderWidth: '1px',
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.875rem',
            color: '#8B949E',
            '&.Mui-focused': {
              color: '#FECF06',
            },
          },
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
        },
        icon: {
          color: '#8B949E',
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(48, 54, 61, 0.8)',
          color: '#E6EDF3',
          fontSize: '0.875rem',
          padding: '10px 14px',
        },
        head: {
          backgroundColor: 'rgba(22, 27, 34, 0.9)',
          color: '#FECF06',
          fontWeight: 700,
          fontFamily: '"Ubuntu", monospace',
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          borderBottom: '1px solid rgba(254, 207, 6, 0.2)',
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(254, 207, 6, 0.06)',
            '&:hover': {
              backgroundColor: 'rgba(254, 207, 6, 0.09)',
            },
          },
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#161B22',
          border: '1px solid rgba(254, 207, 6, 0.25)',
          borderRadius: '10px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: '#E6EDF3',
          fontWeight: 600,
          fontSize: '1rem',
          borderBottom: '1px solid rgba(48, 54, 61, 0.8)',
          paddingBottom: '12px',
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(48, 54, 61, 0.8)',
          minHeight: '42px',
        },
        indicator: {
          backgroundColor: '#FECF06',
          height: '2px',
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          minHeight: '42px',
          color: '#8B949E',
          padding: '0 16px',
          '&.Mui-selected': {
            color: '#FECF06',
            fontWeight: 600,
          },
        },
      },
    },

    MuiStepper: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          padding: '8px 0',
        },
      },
    },

    MuiStepLabel: {
      styleOverrides: {
        label: {
          color: '#8B949E',
          fontSize: '0.8rem',
          '&.Mui-active': {
            color: '#FECF06',
            fontWeight: 600,
          },
          '&.Mui-completed': {
            color: '#00FF41',
            fontWeight: 500,
          },
        },
      },
    },

    MuiStepIcon: {
      styleOverrides: {
        root: {
          color: 'rgba(48, 54, 61, 0.9)',
          '&.Mui-active': {
            color: '#FECF06',
          },
          '&.Mui-completed': {
            color: '#00FF41',
          },
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(48, 54, 61, 0.6)',
          borderRadius: '4px',
          height: '6px',
          '& .MuiLinearProgress-bar': {
            backgroundColor: '#FECF06',
          },
          '&.MuiLinearProgress-colorSecondary .MuiLinearProgress-bar': {
            backgroundColor: '#00FF41',
          },
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          fontSize: '0.875rem',
          border: '1px solid rgba(255,255,255,0.1)',
          '&.MuiAlert-standardSuccess': {
            backgroundColor: 'rgba(0, 255, 65, 0.08)',
            borderColor: 'rgba(0, 255, 65, 0.25)',
            color: '#00FF41',
          },
          '&.MuiAlert-standardWarning': {
            backgroundColor: 'rgba(255, 149, 0, 0.08)',
            borderColor: 'rgba(255, 149, 0, 0.25)',
            color: '#FF9500',
          },
          '&.MuiAlert-standardError': {
            backgroundColor: 'rgba(255, 59, 48, 0.08)',
            borderColor: 'rgba(255, 59, 48, 0.25)',
            color: '#FF3B30',
          },
          '&.MuiAlert-standardInfo': {
            backgroundColor: 'rgba(254, 207, 6, 0.08)',
            borderColor: 'rgba(254, 207, 6, 0.25)',
            color: '#FECF06',
          },
        },
      },
    },

    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          '&.Mui-checked': {
            color: '#00FF41',
            '& + .MuiSwitch-track': {
              backgroundColor: 'rgba(0, 255, 65, 0.3)',
              opacity: 1,
            },
          },
        },
        track: {
          backgroundColor: 'rgba(48, 54, 61, 0.8)',
          opacity: 1,
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#161B22',
          color: '#E6EDF3',
          border: '1px solid rgba(48, 54, 61, 0.8)',
          fontSize: '0.75rem',
          borderRadius: '6px',
        },
        arrow: {
          color: '#161B22',
        },
      },
    },

    MuiBreadcrumbs: {
      styleOverrides: {
        separator: {
          color: '#484F58',
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(48, 54, 61, 0.8)',
        },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#161B22',
          border: '1px solid rgba(48, 54, 61, 0.8)',
          borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          color: '#E6EDF3',
          '&:hover': {
            backgroundColor: 'rgba(254, 207, 6, 0.06)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(254, 207, 6, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(254, 207, 6, 0.12)',
            },
          },
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          '&:hover': {
            backgroundColor: 'rgba(254, 207, 6, 0.05)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(254, 207, 6, 0.1)',
            borderLeft: '3px solid #FECF06',
          },
        },
      },
    },

    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: '#161B22',
          border: '1px solid rgba(48, 54, 61, 0.8)',
          borderRadius: '6px !important',
          '&:before': { display: 'none' },
          '&.Mui-expanded': {
            borderColor: 'rgba(254, 207, 6, 0.25)',
          },
        },
      },
    },

    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          '&.Mui-expanded': {
            borderBottom: '1px solid rgba(48, 54, 61, 0.8)',
          },
        },
        expandIconWrapper: {
          color: '#8B949E',
          '&.Mui-expanded': {
            color: '#FECF06',
          },
        },
      },
    },

    MuiBadge: {
      styleOverrides: {
        badge: {
          fontSize: '0.6rem',
          minWidth: '16px',
          height: '16px',
          padding: '0 4px',
        },
        colorPrimary: {
          backgroundColor: '#FECF06',
          color: '#000000',
        },
        colorError: {
          backgroundColor: '#FF3B30',
          color: '#FFFFFF',
        },
      },
    },
  },
});
