import { Box, Typography } from '@mui/material';

export const FormLabelTypography = ({ required, children, ...props }) => (
  <Typography variant="subtitle1" {...props}>
    {children}
    {required && (
      <Box component="span" color="error.main" ml={0.5}>
        *
      </Box>
    )}
  </Typography>
);
