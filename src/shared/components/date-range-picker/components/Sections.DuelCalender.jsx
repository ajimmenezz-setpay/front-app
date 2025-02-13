import PropTypes from 'prop-types'

import { Divider, Unstable_Grid2 as Grid2 } from '@mui/material'
import { isSameMonth } from 'date-fns'

import { Month } from './Month'

import { MARKERS } from '../Constants/markers'

export const DuelCalender = ({
  firstMonth,
  secondMonth,
  handleSetFirstMonth,
  handleSetSecondMonth,
  canNavigateCloser,
  commonProps,
  locale,
  hideOutsideMonthDays
}) => {
  const canNavigateBack = !isSameMonth(firstMonth, commonProps.minDate)
  const canNavigateForward = !isSameMonth(secondMonth, commonProps.maxDate)

  return (
    <Grid2
      xs={12}
      container
      direction={{
        xs: 'column',
        md: 'row'
      }}
      justifyContent="center"
    >
      <Grid2 xs="auto" container direction={'column'}>
        <Month
          {...commonProps}
          currentDate={firstMonth}
          otherDate={secondMonth}
          setMonth={handleSetFirstMonth}
          navState={[canNavigateBack, canNavigateCloser]}
          marker={MARKERS.FIRST_MONTH}
          locale={locale}
          hideOutsideMonthDays={hideOutsideMonthDays}
        />
      </Grid2>

      <Grid2 xs="auto">
        <Divider orientation="vertical" />
      </Grid2>

      <Grid2 xs="auto" container direction={'column'}>
        <Month
          {...commonProps}
          currentDate={secondMonth}
          otherDate={firstMonth}
          setMonth={handleSetSecondMonth}
          navState={[canNavigateCloser, canNavigateForward]}
          marker={MARKERS.SECOND_MONTH}
          locale={locale}
          hideOutsideMonthDays={hideOutsideMonthDays}
        />
      </Grid2>
    </Grid2>
  )
}

DuelCalender.propTypes = {
  canNavigateCloser: PropTypes.any,
  commonProps: PropTypes.any,
  firstMonth: PropTypes.any,
  handleSetFirstMonth: PropTypes.any,
  handleSetSecondMonth: PropTypes.any,
  hideOutsideMonthDays: PropTypes.any,
  locale: PropTypes.any,
  secondMonth: PropTypes.any
}
