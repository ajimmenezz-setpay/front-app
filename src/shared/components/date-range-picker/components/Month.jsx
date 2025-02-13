import PropTypes from 'prop-types'

import { Unstable_Grid2 as Grid2, Typography, alpha, useTheme } from '@mui/material'
import { format, getDate, isSameMonth, isToday, isWithinInterval } from 'date-fns'

import { Day } from './Day'
import { MonthHeader } from './Month.Header'

import { chunks, getDaysInMonth, inDateRange, isEndOfRange, isRangeSameDay, isStartOfRange } from '../utils'

export const Month = props => {
  const theme = useTheme()
  const {
    helpers,
    handlers,
    currentDate,
    otherDate,
    dateRange,
    marker,
    setMonth,
    minDate,
    maxDate,
    locale,
    hideOutsideMonthDays
  } = props

  const weekStartsOn = locale?.options?.weekStartsOn || 0
  const WEEK_DAYS = Array.from({ length: 7 }, (_, index) =>
    typeof locale !== 'undefined'
      ? locale.localize?.day((index + weekStartsOn) % 7, {
          width: 'short',
          context: 'standalone'
        })
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]
  )
  const [back, forward] = props.navState
  return (
    <>
      <Grid2
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{
          height: '55px',
          backgroundColor: alpha(theme.palette.grey[400], 0.1)
        }}
      >
        <MonthHeader
          minDate={minDate}
          maxDate={maxDate}
          marker={marker}
          currentDate={currentDate}
          otherDate={otherDate}
          setDate={setMonth}
          nextDisabled={!forward}
          prevDisabled={!back}
          onClickPrevious={() => handlers.handleClickNavIcon(marker, -1)}
          onClickNext={() => handlers.handleClickNavIcon(marker, 1)}
          locale={locale}
        />
      </Grid2>

      <Grid2
        container
        justifyContent="center"
        sx={{
          margin: '16px 24px 0 24px'
        }}
      >
        {WEEK_DAYS.map((day, index) => (
          <Grid2 key={index} container width="36px" justifyContent={'center'}>
            <Typography
              color="textSecondary"
              key={index}
              sx={{
                fontSize: '12px'
              }}
            >
              {day}
            </Typography>
          </Grid2>
        ))}
      </Grid2>

      <Grid2
        container
        direction="column"
        sx={{
          margin: '24px'
        }}
      >
        {chunks(getDaysInMonth(currentDate, locale), 7).map((week, idx) => (
          <Grid2 key={idx} container direction="row" justifyContent="center">
            {week.map(day => {
              const isStart = isStartOfRange(dateRange, day)
              const isEnd = isEndOfRange(dateRange, day)
              const isRangeOneDay = isRangeSameDay(dateRange)
              const highlighted = inDateRange(dateRange, day) || helpers.isInHoverRange(day)

              return (
                <Day
                  key={format(day, 'dd-MM-yyyy')}
                  filled={isStart || isEnd}
                  outlined={isToday(day)}
                  highlighted={highlighted && !isRangeOneDay}
                  disabled={
                    !isSameMonth(currentDate, day) ||
                    !(
                      isWithinInterval(day, { start: minDate, end: maxDate }) ||
                      isStartOfRange(
                        {
                          startDate: minDate,
                          endDate: maxDate
                        },
                        day
                      )
                    )
                  }
                  hidden={!isSameMonth(currentDate, day)}
                  hideOutsideMonthDays={hideOutsideMonthDays}
                  startOfRange={isStart && !isRangeOneDay}
                  endOfRange={isEnd && !isRangeOneDay}
                  onClick={() => handlers.handleClickDateNumber(day)}
                  onHover={() => handlers.handleHoverDateNumber(day)}
                  value={getDate(day)}
                />
              )
            })}
          </Grid2>
        ))}
      </Grid2>
    </>
  )
}

Month.propTypes = {
  currentDate: PropTypes.any,
  dateRange: PropTypes.any,
  handlers: PropTypes.shape({
    handleClickDateNumber: PropTypes.func,
    handleClickNavIcon: PropTypes.func,
    handleHoverDateNumber: PropTypes.func
  }),
  helpers: PropTypes.shape({
    isInHoverRange: PropTypes.func
  }),
  hideOutsideMonthDays: PropTypes.any,
  locale: PropTypes.shape({
    localize: PropTypes.shape({
      day: PropTypes.func
    }),
    options: PropTypes.shape({
      weekStartsOn: PropTypes.number
    })
  }),
  marker: PropTypes.any,
  maxDate: PropTypes.any,
  minDate: PropTypes.any,
  navState: PropTypes.any,
  otherDate: PropTypes.any,
  setMonth: PropTypes.any
}
