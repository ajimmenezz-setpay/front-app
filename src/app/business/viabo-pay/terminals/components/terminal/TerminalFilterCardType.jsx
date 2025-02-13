import { memo } from 'react'

import PropTypes from 'prop-types'

import { Checkbox, FormControl, ListItemText, MenuItem, OutlinedInput, Select } from '@mui/material'

import { getNameCardsTypes } from '@/app/shared/services'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

const CARD_TYPES = getNameCardsTypes()

const TerminalFilterCardType = ({ cardType, handleChangeCardType, isLoading }) => (
  <FormControl sx={{ minWidth: 240 }} disabled={!!isLoading}>
    <Select
      fullWidth
      multiple
      displayEmpty
      disabled={!!isLoading}
      size="small"
      value={cardType}
      onChange={handleChangeCardType}
      input={<OutlinedInput />}
      renderValue={selected => {
        if (selected.length === 0) {
          return <>Tarjeta</>
        }

        return selected.join(', ')
      }}
      MenuProps={MenuProps}
      inputProps={{ 'aria-label': 'Without label' }}
    >
      <MenuItem disabled value="">
        <em> Seleccionar Tarjeta</em>
      </MenuItem>
      {CARD_TYPES.map(option => (
        <MenuItem
          key={option}
          value={option}
          sx={{
            mx: 1,
            my: 0.5,
            p: 0,
            borderRadius: 0.75,
            typography: 'body2',
            textTransform: 'capitalize',
            fontWeight: theme =>
              cardType.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium
          }}
        >
          <Checkbox checked={cardType.indexOf(option) > -1} />
          <ListItemText primary={option} />
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)

export default memo(TerminalFilterCardType)

TerminalFilterCardType.propTypes = {
  cardType: PropTypes.array,
  handleChangeCardType: PropTypes.func,
  isLoading: PropTypes.any
}
