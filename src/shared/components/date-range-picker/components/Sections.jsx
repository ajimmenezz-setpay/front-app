import { useMemo, useState } from 'react'

import PropTypes from 'prop-types'

import {
  alpha,
  Divider,
  FormControl,
  Unstable_Grid2 as Grid2,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useTheme
} from '@mui/material'
import { differenceInCalendarMonths } from 'date-fns'

import { DefinedRanges } from './Sections.DefinedRanges'
import { DuelCalender } from './Sections.DuelCalender'
import { Footer } from './Sections.Footer'
import { SingleCalender } from './Sections.SingleCalender'

export const Sections = props => {
  const theme = useTheme()
  const {
    dateRange,
    ranges,
    minDate,
    maxDate,
    firstMonth,
    secondMonth,
    handleSetFirstMonth,
    handleSetSecondMonth,
    handleSetSingleMonth,
    handleClickDefinedRange,
    helpers,
    handlers,
    locale,

    hideActionButtons = false,
    hideDefaultRanges = false,
    hideOutsideMonthDays,
    RangeSeparatorIcons,
    onCloseCallback,
    footerRequired
  } = props

  const { startDate, endDate } = dateRange
  const canNavigateCloser = differenceInCalendarMonths(secondMonth, firstMonth) >= 2
  const commonProps = {
    dateRange,
    minDate,
    maxDate,
    helpers,
    handlers
  }

  const [selectedRange, setSelectedRange] = useState('')
  const [selectedRangeObj, setSelectedRangeObj] = useState(undefined)

  const onChangeSelectedRange = e => {
    const selectedRange = ranges.find(range => range.label === e.target.value)

    if (selectedRange) {
      setSelectedRange(selectedRange.label)
      setSelectedRangeObj(selectedRange) // to use in this component
      handleClickDefinedRange(selectedRange) // to global state
    }
  }

  const isRangeSameDay = (sd1, ed1, sd2, ed2) =>
    sd1.getDate() === sd2.getDate() &&
    sd1.getMonth() === sd2.getMonth() &&
    sd1.getFullYear() === sd2.getFullYear() &&
    ed1.getDate() === ed2.getDate() &&
    ed1.getMonth() === ed2.getMonth() &&
    ed1.getFullYear() === ed2.getFullYear()

  useMemo(() => {
    if (selectedRangeObj && dateRange.startDate && dateRange.endDate) {
      const { startDate: sd1, endDate: ed1 } = dateRange
      const { startDate: sd2, endDate: ed2 } = selectedRangeObj

      if (sd1 && ed1 && sd2 && ed2) {
        if (isRangeSameDay(sd1, ed1, sd2, ed2)) {
          return
        }
        setSelectedRange('')
      }
    }
  }, [selectedRangeObj, dateRange])

  return (
    <Grid2
      container
      sx={{
        borderRadius: '16px',
        backgroundColor: theme.palette.background.paper,
        overflow: 'hidden'
      }}
    >
      <Grid2
        xs="auto"
        container
        direction={'column'}
        className="DRP-Defined-Ranges"
        display={{ xs: 'none', md: hideDefaultRanges ? 'none' : 'flex' }}
      >
        {/* Defined Ranges Selection ( MD+ ) */}
        <DefinedRanges selectedRange={dateRange} ranges={ranges} setRange={handleClickDefinedRange} />
      </Grid2>

      {/* Divider for Defined Ranges ( MD+ ) */}
      <Grid2 xs="auto" display={{ xs: 'none', md: hideDefaultRanges ? 'none' : 'block' }}>
        <Divider orientation="vertical" />
      </Grid2>

      <Grid2 xs container direction={'column'}>
        {/* Defined Ranges Selection ( MD- ) */}
        <Grid2
          display={{ xs: hideDefaultRanges ? 'none' : 'flex', md: 'none' }}
          gap={2}
          container
          height="auto"
          alignItems={'center'}
          p={2}
          sx={{ backgroundColor: alpha(theme.palette.grey[400], 0.1) }}
        >
          <Typography
            sx={{
              fontSize: '14px'
            }}
          >
            Selección Rápida
          </Typography>

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Seleccionar</InputLabel>
            <Select
              size="medium"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Seleccionar"
              value={selectedRange}
              onChange={onChangeSelectedRange}
              MenuProps={{
                disablePortal: true,
                PaperProps: {
                  sx: {
                    width: 'auto',
                    maxHeight: '224px',
                    boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px'
                  }
                }
              }}
            >
              {ranges.map(range => (
                <MenuItem key={range.label} value={range.label}>
                  <Typography
                    sx={{
                      fontSize: '14px'
                    }}
                  >
                    {range.label}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid2>

        {/* Divider for Defined Ranges ( MD- ) */}
        <Grid2 display={{ xs: 'block', md: 'none' }}>
          <Divider />
        </Grid2>

        {/* Dual Calender ( MD- ) */}
        <Grid2 container display={{ xs: 'flex', md: 'none' }}>
          <SingleCalender
            firstMonth={firstMonth}
            secondMonth={secondMonth}
            handleSetSingleMonth={handleSetSingleMonth}
            canNavigateCloser={canNavigateCloser}
            commonProps={commonProps}
            hideOutsideMonthDays={hideOutsideMonthDays}
            locale={locale}
          />
        </Grid2>

        {/* Dual Calender ( MD+ ) */}
        <Grid2 flex={1} display={{ xs: 'none', md: 'flex' }} container>
          <DuelCalender
            firstMonth={firstMonth}
            secondMonth={secondMonth}
            handleSetFirstMonth={handleSetFirstMonth}
            handleSetSecondMonth={handleSetSecondMonth}
            canNavigateCloser={canNavigateCloser}
            commonProps={commonProps}
            hideOutsideMonthDays={hideOutsideMonthDays}
            locale={locale}
          />
        </Grid2>

        {/* Footer With Divider Section (ALL) */}
        {footerRequired ? (
          <>
            {/* Divider for Footer ( All ) */}
            <Grid2 display={hideActionButtons ? 'none' : 'block'}>
              <Divider />
            </Grid2>

            {/* Footer Section (ALL) */}
            <Grid2
              display={hideActionButtons ? 'none' : 'flex'}
              xs="auto"
              container
              alignItems={{
                xs: 'normal',
                md: 'center'
              }}
              justifyContent={{
                xs: 'center',
                md: 'flex-end'
              }}
              direction={{
                xs: 'column',
                md: 'row'
              }}
              p="16px"
              gap={'16px'}
            >
              <Footer
                startDate={startDate}
                endDate={endDate}
                locale={locale}
                onCloseCallback={onCloseCallback}
                onSubmit={handlers.handleClickSubmit}
                RangeSeparatorIcons={RangeSeparatorIcons}
              />
            </Grid2>
          </>
        ) : null}
      </Grid2>
    </Grid2>
  )
}

Sections.propTypes = {
  RangeSeparatorIcons: PropTypes.any,
  dateRange: PropTypes.shape({
    endDate: PropTypes.any,
    startDate: PropTypes.any
  }),
  firstMonth: PropTypes.any,
  footerRequired: PropTypes.any,
  handleClickDefinedRange: PropTypes.func,
  handleSetFirstMonth: PropTypes.any,
  handleSetSecondMonth: PropTypes.any,
  handleSetSingleMonth: PropTypes.any,
  handlers: PropTypes.shape({
    handleClickSubmit: PropTypes.any
  }),
  helpers: PropTypes.any,
  hideActionButtons: PropTypes.bool,
  hideDefaultRanges: PropTypes.bool,
  hideOutsideMonthDays: PropTypes.any,
  locale: PropTypes.any,
  maxDate: PropTypes.any,
  minDate: PropTypes.any,
  onCloseCallback: PropTypes.any,
  ranges: PropTypes.any,
  secondMonth: PropTypes.any
}
