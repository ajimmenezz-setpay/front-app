import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, IconButton, InputBase, MenuItem, Select, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'

import { monthOptions } from '@/shared/utils'
import { useResponsive } from '@/theme/hooks'

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3)
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    border: 'none',
    outline: 'none'
    // Use the system font instead of the default Roboto font.
  }
}))

export function CardFilterMovements({ setCurrentMonth, currentMonth, isLoading }) {
  const startYear = 2020
  const currentYear = new Date().getFullYear()
  const isDesktop = useResponsive('up', 'lg')

  const yearOptions = Array.from({ length: currentYear - startYear + 1 }, (_, index) => startYear + index).reverse()

  const isFetching = isLoading

  const handlePreviousMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth)
      newMonth.setMonth(newMonth.getMonth() - 1)
      return newMonth
    })
  }

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth)
      newMonth.setMonth(newMonth.getMonth() + 1)
      return newMonth
    })
  }

  const isCurrentMonth = () => {
    const currentDate = new Date()
    return (
      currentMonth.getMonth() === currentDate.getMonth() && currentMonth.getFullYear() === currentDate.getFullYear()
    )
  }

  const isFutureMonth = (monthIndex, year) => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()

    return year > currentYear || (year === currentYear && monthIndex > currentMonth)
  }

  const handleMonthChange = event => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(event.target.value)
    setCurrentMonth(newMonth)
  }

  const handleYearChange = event => {
    const newMonth = new Date(currentMonth)
    newMonth.setFullYear(event.target.value)
    setCurrentMonth(newMonth)
  }

  const menuProps = {
    PaperProps: {
      style: {
        maxHeight: 200,
        overflowY: 'auto'
      }
    }
  }

  return (
    <Stack spacing={2} direction={'row'} justifyContent="space-between" sx={{ py: 2.5, px: 3 }}>
      {isDesktop ? (
        <LoadingButton
          loading={isFetching}
          variant="outlined"
          startIcon={<KeyboardArrowLeft />}
          onClick={handlePreviousMonth}
        >
          anterior
        </LoadingButton>
      ) : (
        <IconButton disabled={isFetching} variant="outlined" onClick={handlePreviousMonth}>
          <KeyboardArrowLeft />
        </IconButton>
      )}

      <Box display="flex" alignItems="center" justifyContent={'center'} spacing={1} gap={1}>
        <Select
          size={'small'}
          value={currentMonth.getMonth()}
          onChange={handleMonthChange}
          disabled={isFetching}
          input={<BootstrapInput />}
        >
          {monthOptions.map((month, index) => {
            const year = currentMonth.getFullYear()
            if (!isFutureMonth(index, year)) {
              return (
                <MenuItem key={index} value={index} disabled={isFutureMonth(index, year)}>
                  {month}
                </MenuItem>
              )
            }
            return null
          })}
        </Select>
        <Select
          size={'small'}
          value={currentMonth.getFullYear()}
          onChange={handleYearChange}
          input={<BootstrapInput />}
          MenuProps={menuProps}
          disabled={isFetching}
        >
          {yearOptions.map(year => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {isDesktop ? (
        <LoadingButton
          loading={isFetching}
          variant="outlined"
          endIcon={<KeyboardArrowRight />}
          disabled={isCurrentMonth()}
          onClick={handleNextMonth}
        >
          siguiente
        </LoadingButton>
      ) : (
        <IconButton disabled={isFetching} variant="outlined" onClick={handleNextMonth}>
          <KeyboardArrowRight />
        </IconButton>
      )}
    </Stack>
  )
}
