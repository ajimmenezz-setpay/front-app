import { alpha } from '@mui/material'

export default function Button(theme) {
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          borderColor: alpha('#CFDBD5', 0.7),
          borderRadius: Number(theme.shape.borderRadius),
          boxShadow: 'none'
        },
        sizeLarge: {
          height: 42
        },
        // contained
        containedInherit: {
          color: theme.palette.grey[800],
          boxShadow: theme.customShadows.z8,
          '&:hover': {
            backgroundColor: theme.palette.grey[400]
          }
        },
        containedPrimary: {
          boxShadow: theme.palette.mode === 'dark' ? theme.customShadows.secondary : theme.customShadows.primary
        },
        containedSecondary: {
          color: `${theme.palette.common.white}!important`,
          boxShadow: theme.palette.mode === 'dark' ? theme.customShadows.primary : theme.customShadows.secondary
        },
        containedInfo: {
          boxShadow: theme.customShadows.info
        },
        containedSuccess: {
          boxShadow: theme.customShadows.success
        },
        containedWarning: {
          boxShadow: theme.customShadows.warning
        },
        containedError: {
          boxShadow: theme.customShadows.error
        },
        // outlined
        outlinedInherit: {
          // border: `1px solid ${theme.palette.grey[500_32]}`,
          '&:hover': {
            backgroundColor: theme.palette.action.hover
          }
        },
        textInherit: {
          '&:hover': {
            backgroundColor: theme.palette.action.hover
          }
        }
      }
    }
  }
}
