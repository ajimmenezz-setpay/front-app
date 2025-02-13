// ----------------------------------------------------------------------

export default function Dialog(theme) {
  return {
    MuiDialog: {
      styleOverrides: {
        paper: {
          boxShadow: theme.customShadows.dialog,
          '&.MuiPaper-rounded': {
            borderRadius: Number(theme.shape.borderRadius) * 2
          },
          '&.MuiDialog-paperFullScreen': {
            borderRadius: 0,
            backgroundColor: theme.palette.background.default
          },
          '&.MuiDialog-paper .MuiDialogActions-root': {
            padding: theme.spacing(3)
          },
          '@media (max-width: 600px)': {
            margin: theme.spacing(2)
            // margin: 0
          },
          '@media (max-width: 663.95px)': {
            '&.MuiDialog-paperWidthSm.MuiDialog-paperScrollBody': {
              maxWidth: 'calc(100% - 32px)'
            }
          }
        },
        paperFullWidth: {
          width: '100%'
        }
      }
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: theme.spacing(3, 3, 0)
        }
      }
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          borderTop: 0,
          borderBottom: 0,
          padding: theme.spacing(3)
        }
      }
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          '& > :not(:first-of-type)': {
            marginLeft: theme.spacing(1.5)
          }
        }
      }
    }
  }
}
