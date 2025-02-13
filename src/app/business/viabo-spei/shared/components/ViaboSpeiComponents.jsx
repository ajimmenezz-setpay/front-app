import { LoadingButton } from '@mui/lab'
import { Button, Card, alpha, styled } from '@mui/material'

export const borderColorViaboSpeiStyle = alpha('#CFDBD5', 0.7)

export const CardViaboSpeiStyle = styled(Card)(({ theme }) => ({
  borderRadius: Number(theme.shape.borderRadius),
  boxShadow: 'none',
  backgroundColor: 'inherit'
}))

export const ButtonViaboSpei = styled(Button)(({ theme }) => ({
  borderRadius: Number(theme.shape.borderRadius),
  boxShadow: 'none'
}))

export const LoadingButtonViaboSpei = styled(LoadingButton)(({ theme }) => ({
  borderRadius: Number(theme.shape.borderRadius),
  boxShadow: 'none'
}))
