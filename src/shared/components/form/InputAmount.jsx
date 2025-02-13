import { Input, Stack, Typography } from '@mui/material'

export function InputAmount({
  autoWidth,
  amount,
  onBlur,
  onChange,
  onClick,
  step = 0,
  min = 0,
  max = 0,
  sx,
  ...other
}) {
  return (
    <Stack direction="row" justifyContent="center" alignItems={'center'} spacing={1} sx={sx}>
      <Typography variant="h5">$</Typography>
      <Input
        disableUnderline
        value={amount}
        onChange={onChange}
        onClick={onClick}
        size={'small'}
        onBlur={onBlur}
        inputProps={{ step, min, max, type: 'number' }}
        sx={{
          typography: 'h3',
          '& input': {
            p: 0,
            textAlign: 'center',
            width: autoWidth,
            '&[type=number]': {
              MozAppearance: 'textfield',
              '&::-webkit-outer-spin-button': {
                margin: 0,
                WebkitAppearance: 'none'
              },
              '&::-webkit-inner-spin-button': {
                margin: 0,
                WebkitAppearance: 'none'
              }
            }
          }
        }}
        {...other}
      />
    </Stack>
  )
}
