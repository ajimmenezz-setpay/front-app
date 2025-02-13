import PropTypes from 'prop-types'

import { Button, Unstable_Grid2 as Grid2, styled } from '@mui/material'

const CancelButtonStyled = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontSize: 13,
  fontWeight: 400,
  borderRadius: '8px',
  marginRight: '8px',
  padding: '0 16px',
  height: '36px',
  color: theme.palette.grey[600],
  '&:hover': {
    backgroundColor: theme.palette.grey[100]
  }
}))

const ApplyButtonStyled = styled(Button)({
  fontSize: 13,
  fontWeight: 400,
  borderRadius: '8px',
  textTransform: 'none',
  height: '36px',
  padding: '0 16px'
})

export const Actions = ({ onCloseCallback, onSubmit }) => (
  <>
    <Grid2>
      <CancelButtonStyled disableRipple disableElevation variant="text" onClick={onCloseCallback}>
        Cancelar
      </CancelButtonStyled>
    </Grid2>

    <Grid2>
      <ApplyButtonStyled
        disableRipple
        disableElevation
        type="submit"
        variant="contained"
        color="primary"
        onClick={onSubmit}
      >
        Aplicar Rango
      </ApplyButtonStyled>
    </Grid2>
  </>
)

Actions.propTypes = {
  onCloseCallback: PropTypes.any,
  onSubmit: PropTypes.any
}
