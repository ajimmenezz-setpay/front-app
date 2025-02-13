import { Card } from '@mui/material'
import { styled } from '@mui/material/styles'

import overlay from '@/shared/assets/img/overlay_2.jpg'

const HEIGHT = 230

export const CardStyled = styled(props => <Card {...props} />)(({ theme }) => ({
  height: HEIGHT - 16,
  color: theme.palette.common.white,
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  background: `linear-gradient(rgba(22, 28, 36, 0.8), rgba(22, 28, 36, 0.9)) center center / cover no-repeat, url(${overlay})`
}))

export default CardStyled
