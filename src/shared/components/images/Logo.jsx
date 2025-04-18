import PropTypes from 'prop-types'

import { Box, useTheme } from '@mui/material'

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object
}

export function Logo({ disabledLink = false, sx }) {
  const theme = useTheme()

  const TEXT_PRIMARY = theme.palette.text.primary
  const PRIMARY_MAIN = theme.palette.primary.main
  const PRIMARY_DARK = theme.palette.primary.dark
  const TEXT_SECONDARY = theme.palette.text.secondary

  return (
    <Box sx={{ width: 40, height: 40, ...sx }}>
      <svg
        width={'100%'}
        height={'100%'}
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        viewBox="40.9 40.9 470.9 204.7"
      >
        <style>{`.st1{fill:${PRIMARY_MAIN}}.st2{fill:${PRIMARY_DARK}}`}</style>
        <g className="layer">
          <g id="svg_1">
            <g id="svg_43">
              <path
                id="svg_44"
                d="M204.9 184.2c0 8.5-1.6 16.5-4.9 23.9-3.3 7.4-7.7 13.9-13.2 19.4-5.5 5.5-12 9.9-19.4 13.2-7.4 3.3-15.4 4.9-23.9 4.9H41.1v-10.4c0-4.2.8-8.1 2.4-11.9 1.6-3.8 3.8-7 6.5-9.8 2.8-2.8 6-4.9 9.8-6.5 3.8-1.6 7.7-2.4 11.9-2.4h71.8c5.7 0 10.6-2 14.5-5.9 4-4 5.9-8.8 5.9-14.5 0-5.7-2-10.6-5.9-14.5-4-4-8.8-5.9-14.5-5.9h-41c-7.3 0-14.2-1.2-20.8-3.6s-12.5-5.7-17.8-10.1c-5.3-4.4-9.9-9.5-13.7-15.4-3.8-5.9-6.4-12.5-8-19.6-1.6-7.5-1.7-15-.4-22.4 1.3-7.4 3.7-14.3 7.3-20.8 3.6-6.4 8.2-12.1 13.8-16.9 5.6-4.8 12-8.5 19.1-10.8V102c0 5.5 2.1 10.4 6.2 14.5 4.2 4.2 8.9 6.2 14.2 6.2h41c8.5 0 16.5 1.6 24 4.7 7.5 3.2 14 7.5 19.6 13.1 5.5 5.5 9.9 12.1 13.1 19.6 3.2 7.6 4.8 15.6 4.8 24.1z"
                className="st1"
              />
              <path
                id="svg_45"
                d="M361.6 204.7v2.1c0 5.3-1 10.4-3.1 15.1-2.1 4.7-4.9 8.9-8.5 12.3-3.6 3.5-7.7 6.2-12.5 8.3-4.7 2.1-9.8 3.1-15.1 3.1h-73.6c-4.2 0-8.1-.8-11.9-2.4-3.8-1.6-7.1-3.8-9.9-6.7-2.9-2.9-5.1-6.2-6.7-9.9-1.6-3.8-2.4-7.7-2.4-11.9v-51.1c0-5.3 1-10.4 3.1-15.1 2.1-4.7 4.8-8.9 8.3-12.3 3.5-3.5 7.6-6.2 12.3-8.3 4.7-2.1 9.8-3.1 15.1-3.1H341v2.1c0 5.3-1 10.4-3.1 15.1-2.1 4.7-4.9 8.9-8.5 12.3-3.6 3.5-7.7 6.2-12.5 8.3-4.7 2.1-9.8 3.1-15.1 3.1h-43v38.9h102.8v.1z"
                className="st1"
              />
              <path
                id="svg_46"
                d="M460.8 206.7c0 5.3-1 10.4-3.1 15.1-2.1 4.7-4.9 8.9-8.5 12.3-3.6 3.5-7.7 6.2-12.5 8.3-4.7 2.1-9.8 3.1-15.1 3.1h-1.8v-160h41v121.2z"
                className="st1"
              />
              <g id="svg_47">
                <path
                  id="svg_48"
                  d="M86.2 90.2V43.3c5.7-1.6 11.2-2.4 16.3-2.4h102.4V43c0 5.3-1 10.4-3 15.1-2 4.7-4.7 8.9-8.3 12.5-3.6 3.6-7.7 6.3-12.5 8.3-4.7 2-9.8 3-15.1 3h-63.5c-3.4 0-6.4.7-9.2 2.2-2.7 1.5-5.1 3.6-7.1 6.1z"
                  className="st2"
                />
                <path
                  id="svg_49"
                  d="M361.6 41v2c0 5.3-1 10.4-3.1 15.1-2.1 4.7-4.9 8.9-8.5 12.5-3.6 3.6-7.7 6.3-12.5 8.3-4.7 2-9.8 3-15.1 3h-63.5v39.2h-2.1c-8.3 0-16 2.2-23 6.7s-12.3 10.4-15.9 18v-66c0-5.3 1-10.4 3.1-15.1 2.1-4.7 4.8-8.9 8.3-12.3 3.5-3.5 7.6-6.2 12.3-8.3 4.7-2.1 9.8-3.1 15.1-3.1h104.9z"
                  className="st2"
                />
                <path
                  id="svg_50"
                  d="M511.8 41.3V43c0 5.3-1 10.4-3 15.1-2 4.7-4.7 8.9-8.3 12.5-3.6 3.6-7.7 6.4-12.5 8.5-4.7 2.1-9.8 3.1-15.1 3.1H368.5v-2.1c0-5.3 1-10.4 3.1-15.1 2.1-4.7 4.8-8.9 8.3-12.5 3.5-3.6 7.6-6.3 12.3-8.3 4.7-2 9.8-3 15.1-3h104.5v.1z"
                  className="st2"
                />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </Box>
  )
}
