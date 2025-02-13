import PropTypes from 'prop-types'

import { Sections } from './components/Sections'
import { useDateRangePicker } from './hooks/useDateRangePicker'

export const DateRangePicker = props => {
  const { customProps, ...dateRangePickerProps } = props
  const onSubmit = customProps?.onSubmit

  const { ...computedProps } = useDateRangePicker({
    ...dateRangePickerProps,
    onSubmit
  })
  return <Sections {...dateRangePickerProps} {...computedProps} {...customProps} />
}

DateRangePicker.propTypes = {
  customProps: PropTypes.shape({
    onSubmit: PropTypes.any
  })
}
