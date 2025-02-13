import PropTypes from 'prop-types'

import { Unstable_Grid2 as Grid2 } from '@mui/material'
import { isSameMonth } from 'date-fns'

import { Month } from './Month'

import { MARKERS } from '../Constants/markers'

export const SingleCalender = ({
  firstMonth,
  secondMonth,
  handleSetSingleMonth,
  commonProps,
  locale,
  hideOutsideMonthDays
}) => {
  const canNavigateBack = !isSameMonth(firstMonth, commonProps.minDate)
  const canNavigateForward = !isSameMonth(firstMonth, commonProps.maxDate)

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
          setMonth={handleSetSingleMonth}
          navState={[canNavigateBack, canNavigateForward]}
          marker={MARKERS.SINGLE_MONTH}
          locale={locale}
          hideOutsideMonthDays={hideOutsideMonthDays}
        />
      </Grid2>
    </Grid2>
  )
}

SingleCalender.propTypes = {
  commonProps: PropTypes.any,
  firstMonth: PropTypes.any,
  handleSetSingleMonth: PropTypes.any,
  hideOutsideMonthDays: PropTypes.any,
  locale: PropTypes.any,
  secondMonth: PropTypes.any
}
