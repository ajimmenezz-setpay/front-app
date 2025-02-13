import { useEffect, useMemo, useRef, useState } from 'react'

import PropTypes from 'prop-types'

import { CalendarMonth } from '@mui/icons-material'
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown'
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight'
import { IconButton, Stack, TextField, useTheme } from '@mui/material'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

import { PickerModal } from '../date-range-picker'

import { getDateRange, isFunction } from '@/shared/utils'

export const InputDateRange = ({ startDate, endDate, onChange, onSubmit, options }) => {
  const theme = useTheme()
  const initialDateRange = useMemo(() => getDateRange(), [])

  const [dateRange, setDateRange] = useState({})

  const ref = useRef(null)

  useEffect(() => {
    setDateRange({
      startDate: startDate || new Date(),
      endDate: endDate || new Date()
    })
  }, [startDate, endDate])

  const startDateFormat = useMemo(
    () =>
      dateRange?.startDate
        ? format(dateRange?.startDate, 'dd MMMM yyyy', { locale: es })
        : format(new Date(), 'dd MMMM yyyy', { locale: es }),
    [dateRange]
  )
  const endDateFormat = useMemo(
    () =>
      dateRange?.endDate
        ? format(dateRange?.endDate, 'dd MMMM yyyy', { locale: es })
        : format(new Date(), 'dd MMMM yyyy', { locale: es }),
    [dateRange?.endDate]
  )

  const formatDate = `${startDateFormat} - ${endDateFormat}`

  const [anchorEl, setAnchorEl] = useState(null)
  const handleClick = event => {
    setAnchorEl(ref.current)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)

  const handleSetDateRangeOnChange = dateRange => {
    setDateRange(dateRange)
    isFunction(onChange) && onChange(dateRange)
  }
  const handleSetDateRangeOnSubmit = dateRange => {
    setDateRange(dateRange)
    handleClose()
    isFunction(onSubmit) && onSubmit(dateRange)
  }

  return (
    <>
      <Stack flex={1} width={1} direction={'row'} spacing={0.5} ref={ref}>
        <IconButton onClick={handleClick} size="small">
          <CalendarMonth />
        </IconButton>
        <Stack flex={1}>
          <TextField
            placeholder="Fecha inicial - Fecha final"
            value={formatDate}
            fullWidth
            type="text"
            variant="outlined"
            size="small"
            onClick={handleClick}
            InputProps={{ readOnly: true }}
          />
        </Stack>
      </Stack>
      <PickerModal
        hideOutsideMonthDays={false}
        initialDateRange={{
          startDate,
          endDate
        }}
        definedRanges={initialDateRange}
        locale={es}
        onChange={range => handleSetDateRangeOnChange(range)}
        customProps={{
          onSubmit: range => handleSetDateRangeOnSubmit(range),
          onCloseCallback: handleClose,
          RangeSeparatorIcons: {
            xs: ArrowCircleDownIcon,
            md: ArrowCircleRightIcon
          }
        }}
        modalProps={{
          open,
          anchorEl,
          onClose: handleClose,
          slotProps: {
            paper: {
              sx: {
                borderRadius: '16px',
                boxShadow: 'rgba(0, 0, 0, 0.21) 0px 0px 4px'
              }
            }
          },

          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left'
          }
        }}
        {...options}
      />
    </>
  )
}

InputDateRange.propTypes = {
  endDate: PropTypes.any,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  startDate: PropTypes.any
}
