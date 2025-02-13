import { useState } from 'react'

import {
  addMonths,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  lastDayOfMonth,
  max,
  min
} from 'date-fns'

import { AVAILABLE_MAX_DATE, AVAILABLE_MIN_DATE } from '../Constants'
import { MARKERS } from '../Constants/markers'
import { getDefaultRanges } from '../defaults'
import { getValidatedMonths, parseOptionalDate } from '../utils'

export const useDateRangePicker = props => {
  const today = new Date()

  const {
    onChange: onChangeCallback,
    onSubmit: onSubmitCallback,
    initialDateRange,
    minDate,
    maxDate,
    definedRanges = getDefaultRanges(new Date(), props.locale),
    locale
  } = props

  // !Assign starting states
  const minValidDate = parseOptionalDate(minDate, AVAILABLE_MIN_DATE)
  const maxValidDate = parseOptionalDate(maxDate, AVAILABLE_MAX_DATE)

  const [initialFirstMonth, initialSecondMonth] = getValidatedMonths(initialDateRange || {}, minValidDate, maxValidDate)
  const [dateRange, setDateRange] = useState({
    ...initialDateRange
  })
  const [hoverDay, setHoverDay] = useState()
  const [firstMonth, setFirstMonth] = useState(initialFirstMonth || today)
  const [secondMonth, setSecondMonth] = useState(initialSecondMonth || addMonths(firstMonth, 1))

  const { startDate, endDate } = dateRange

  // handlers
  const handleSetFirstMonth = date => {
    if (isBefore(date, secondMonth)) {
      if (isAfter(date, minValidDate)) {
        setFirstMonth(date) // desired output
      } else {
        setFirstMonth(lastDayOfMonth(minValidDate))
      }
    } else {
      if (isBefore(addMonths(date, +1), maxValidDate)) {
        setFirstMonth(date)
        setSecondMonth(addMonths(date, 1))
      } else {
        setSecondMonth(maxValidDate)
        setFirstMonth(addMonths(maxValidDate, -1))
      }
    }
  }

  const handleSetSecondMonth = date => {
    if (isAfter(date, firstMonth)) {
      if (isBefore(date, maxValidDate)) {
        setSecondMonth(date) // desired output
      } else {
        setSecondMonth(lastDayOfMonth(maxValidDate))
      }
    } else {
      if (isAfter(addMonths(date, -1), minValidDate)) {
        setSecondMonth(date)
        setFirstMonth(addMonths(date, -1))
      } else {
        setFirstMonth(minValidDate)
        setSecondMonth(addMonths(minValidDate, +1))
      }
    }
  }

  const handleSetSingleMonth = date => {
    if (isAfter(date, minValidDate) && isBefore(date, maxValidDate)) {
      setFirstMonth(date) // desired output
    } else if (isBefore(date, minValidDate) || isSameDay(date, minValidDate)) {
      setFirstMonth(minValidDate)
    } else if (isAfter(date, maxValidDate) || isSameDay(date, maxValidDate)) {
      setFirstMonth(maxValidDate)
    }
  }

  const handleClickDefinedRange = range => {
    let { startDate: newStart, endDate: newEnd } = range

    if (newStart && newEnd) {
      range.startDate = newStart = max([newStart, minValidDate])
      range.endDate = newEnd = min([newEnd, maxValidDate])

      setDateRange(range)
      onChangeCallback && onChangeCallback(range) // OUTPUT to the user (SUCCESSFUL SELECTION)

      setFirstMonth(newStart)
      setSecondMonth(isSameMonth(newStart, newEnd) ? addMonths(newStart, 1) : newEnd)
    } else {
      setDateRange({})
      onChangeCallback && onChangeCallback({}) // OUTPUT to the user (UNSUCCESSFUL SELECTION)

      setFirstMonth(today)
      setSecondMonth(addMonths(firstMonth, 1))
    }
  }

  const handleClickDateNumber = day => {
    if (startDate && !endDate && !isBefore(day, startDate)) {
      // * check for a valid End Date
      const newRange = { startDate, endDate: day }
      onChangeCallback && onChangeCallback(newRange)
      setDateRange(newRange)
    } else {
      // * check for a valid Start Date
      setDateRange({ startDate: day, endDate: undefined })
    }
    setHoverDay(day)
  }

  const handleClickSubmit = () => {
    const { startDate, endDate } = dateRange
    if (onSubmitCallback && startDate && endDate) {
      onSubmitCallback(dateRange)
    }
    // handleSetCalenderNum(0);
  }

  const handleClickNavIcon = (marker, action) => {
    if (marker === MARKERS.SINGLE_MONTH) {
      setFirstMonth(addMonths(firstMonth, action))
      setSecondMonth(addMonths(secondMonth, action))
      return
    }
    if (marker === MARKERS.FIRST_MONTH) {
      const firstNew = addMonths(firstMonth, action)
      if (isBefore(firstNew, secondMonth)) setFirstMonth(firstNew)
    } else {
      const secondNew = addMonths(secondMonth, action)
      if (isBefore(firstMonth, secondNew)) setSecondMonth(secondNew)
    }
  }

  const handleHoverDateNumber = date => {
    if (startDate && !endDate) {
      if (!hoverDay || !isSameDay(date, hoverDay)) {
        setHoverDay(date)
      }
    }
  }

  // helpers
  const isInHoverRange = day =>
    startDate &&
    !endDate &&
    hoverDay &&
    isAfter(hoverDay, startDate) &&
    isWithinInterval(day, { start: startDate, end: hoverDay })

  const helpers = {
    isInHoverRange
  }

  const handlers = {
    handleClickDateNumber,
    handleClickSubmit,
    handleClickNavIcon,
    handleHoverDateNumber
  }

  return {
    dateRange,
    ranges: definedRanges,
    minDate: minValidDate,
    maxDate: maxValidDate,
    firstMonth,
    secondMonth,
    handleSetFirstMonth,
    handleSetSecondMonth,
    handleSetSingleMonth,
    handleClickDefinedRange,
    helpers,
    handlers,
    locale
  }
}
