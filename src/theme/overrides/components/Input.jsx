// ----------------------------------------------------------------------

import { alpha } from '@mui/material'

export default function Input(theme) {
  return {
    MuiInputBase: {
      styleOverrides: {
        root: {
          // '& input:-webkit-autofill': {
          //   WebkitBoxShadow: `0 0 0px 1000px ${alpha(theme.palette.primary.main, 0.1)} inset`
          // },
          '&.Mui-disabled': {
            '& svg': { color: theme.palette.text.disabled }
          }
        },
        input: {
          '&::placeholder': {
            opacity: 1,
            color: theme.palette.text.disabled
          }
        }
      }
    },
    MuiInput: {
      styleOverrides: {
        underline: {
          '&:before': {
            borderBottomColor: theme.palette.grey[500_56]
          }
        },
        sizeMedium: {
          height: 42
        }
      }
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: theme.spacing(1),
          backgroundColor: theme.palette.grey[500_12],
          '&:hover': {
            backgroundColor: theme.palette.grey[500_16]
          },
          '&.Mui-focused': {
            backgroundColor: theme.palette.action.focus,
            boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`
          },
          '&.Mui-disabled': {
            backgroundColor: theme.palette.action.disabledBackground
          }
        },
        underline: {
          '&:before': {
            borderBottomColor: theme.palette.grey[500_56]
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: theme.spacing(1),
          '&.Mui-focused': {
            backgroundColor: theme.palette.background.neutral
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.grey[500_32]
          },
          '&.Mui-disabled': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.background.disabledBackground
            }
          }
        }
      }
    }
  }
}
