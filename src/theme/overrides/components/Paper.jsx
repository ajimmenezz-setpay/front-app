export default function Paper(theme) {
  return {
    MuiPaper: {
      defaultProps: {
        elevation: 0
      },

      variants: [
        {
          props: { variant: 'outlined' }
        }
      ],

      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    }
  }
}
