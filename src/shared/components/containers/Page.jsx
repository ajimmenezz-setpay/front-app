import { forwardRef } from 'react'

import PropTypes from 'prop-types'

import { Box } from '@mui/material'
import { Helmet } from 'react-helmet-async'

export const Page = forwardRef(({ children, title = '', meta, ...other }, ref) => (
  <>
    <Helmet>
      <title>{`${title} | SET`}</title>
      {meta}
    </Helmet>

    <Box height={1} ref={ref} {...other}>
      {children}
    </Box>
  </>
))

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  meta: PropTypes.node
}
