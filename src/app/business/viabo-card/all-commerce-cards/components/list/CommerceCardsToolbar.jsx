import PropTypes from 'prop-types'

import { AssignmentIndRounded } from '@mui/icons-material'
import { Button, Checkbox, Stack, Toolbar, Typography } from '@mui/material'
import { toast } from 'react-toastify'

import { useCommerceCards } from '@/app/business/viabo-card/all-commerce-cards/store'

export function CommerceCardsToolbar({ cards }) {
  const cardsSelected = useCommerceCards(state => state.cards)
  const setAllCards = useCommerceCards(state => state.setAllCards)
  const resetCards = useCommerceCards(state => state.resetCards)
  const setOpenAssignCards = useCommerceCards(state => state.setOpenAssign)

  const numSelected = cardsSelected?.length || 0
  const rowCount = cards?.length || 0

  const onSelectAllRows = checked => {
    if (checked) {
      setAllCards(cards)
      return
    }
    resetCards()
  }

  const handleValidateCards = () => {
    const someWithoutCVV = cardsSelected.some(card => card?.cvv === '') && cardsSelected?.length > 1
    const someAssigned = cardsSelected.some(card => card?.assignUser?.id !== '')

    const allEmptyCVV = cardsSelected.every(card => card?.cvv === '') && cardsSelected?.length > 1

    if (allEmptyCVV) {
      toast.warn('Las tarjetas seleccionadas no tiene cvv , debe asignar una por una')
    } else if (someWithoutCVV) {
      toast.warn('Existe al menos una tarjeta seleccionada que no tiene cvv')
    } else if (someAssigned) {
      toast.warn('Existe al menos una tarjeta seleccionada que ya esta asignada')
    } else {
      setOpenAssignCards(true)
    }
  }

  return (
    <>
      <Toolbar
        sx={theme => ({
          position: 'sticky',
          borderRadius: 1,
          py: 4,
          top: 0,
          boxShadow: theme.customShadows.z8,
          backgroundColor: theme.palette.info.lighter,
          color: 'white'
        })}
      >
        <Stack
          flexDirection={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          sx={{ width: 1 }}
          gap={2}
          alignItems={'center'}
        >
          <Stack flexDirection={'row'} gap={1} alignItems={'center'}>
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={event => onSelectAllRows(event.target.checked)}
              color={'success'}
            />
            <Typography color={'success.main'} variant={'subtitle1'}>
              {numSelected === 1 ? `${numSelected} Tarjeta` : `${numSelected} Tarjetas`}
            </Typography>
          </Stack>

          <Stack flexDirection={'row'} gap={2} justifyContent="space-between">
            <Button
              startIcon={<AssignmentIndRounded />}
              variant={'outlined'}
              color={'info'}
              onClick={handleValidateCards}
            >
              Asignar
            </Button>
          </Stack>
        </Stack>
      </Toolbar>
    </>
  )
}

CommerceCardsToolbar.propTypes = {
  cards: PropTypes.array
}
