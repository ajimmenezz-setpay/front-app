import PropTypes from 'prop-types'

import { Dialog, DialogContent, Popover, useMediaQuery, useTheme } from '@mui/material'

import { DateRangePicker } from './DateRangePicker'

export const PickerModal = ({ modalProps, customProps, ...dateRangePickerProps }) => {
  const theme = useTheme()
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'))

  if (isMobileView) {
    const { open, onClose } = modalProps
    return (
      <Dialog fullWidth maxWidth={'md'} open={open} onClose={onClose}>
        <DialogContent dividers={scroll === 'paper'} sx={{ px: 0, pt: 0 }}>
          <DateRangePicker {...dateRangePickerProps} customProps={customProps} footerRequired />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Popover {...modalProps}>
      <DateRangePicker {...dateRangePickerProps} customProps={customProps} footerRequired />
    </Popover>
  )
}

PickerModal.propTypes = {
  customProps: PropTypes.any,
  modalProps: PropTypes.shape({
    onClose: PropTypes.any,
    open: PropTypes.any
  })
}
