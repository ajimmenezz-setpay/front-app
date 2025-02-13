import PropTypes from 'prop-types'

import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

export function SpeiLogo({ sx, color, invert = false }) {
  const theme = useTheme()

  let colorDefault = theme?.palette.mode === 'dark' ? 'white' : '#343084'
  if (invert) {
    colorDefault = theme?.palette.mode === 'dark' ? '#343084' : 'white'
  }
  return (
    <Box sx={{ display: 'flex', width: 50, height: 50, alignItems: 'center', ...sx }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{
          shapeRendering: 'geometricPrecision',
          textRendering: 'geometricPrecision',
          imageRendering: 'optimizeQuality',
          fillRule: 'evenodd',
          clipRule: 'evenodd'
        }}
        viewBox="-0.5 -0.5 300 101"
      >
        <path
          fill={colorDefault}
          d="M30.5-.5h26c16.59 2.934 25.59 12.934 27 30-9.346.266-18.68.433-28 .5C52 19.749 45 16.082 34.5 19c-3.624 2.161-4.79 5.328-3.5 9.5l1.5 1.5a932.36 932.36 0 0 0 29 8C86.27 47.043 92.437 63.21 80 86.5c-7.302 7.733-16.136 12.4-26.5 14h-24c-14.78-2.707-24.78-11.04-30-25v-10c9.06-.24 18.06-.24 27 0 4.081 13.034 12.414 17.534 25 13.5 6.083-4.77 6.416-9.77 1-15a149.15 149.15 0 0 0-29-10C3.518 46.884-2.315 33.717 6 14.5c6.454-7.97 14.621-12.97 24.5-15Z"
          style={{
            opacity: 0.982
          }}
        />
        <path
          fill={colorDefault}
          d="M89.5 1.5c20.003-.167 40.003 0 60 .5 10.575 1.698 17.742 7.53 21.5 17.5 5.704 20.298-1.13 34.131-20.5 41.5a209.473 209.473 0 0 1-31 1.5c.167 12.005 0 24.005-.5 36-4.92.654-9.92.988-15 1-5.25-.03-10.25-.696-15-2-.811-32.03-.645-64.03.5-96Zm31 19a41.601 41.601 0 0 1 17 2.5c4.249 4.546 5.082 9.713 2.5 15.5a6.977 6.977 0 0 1-3.5 2.5 61.53 61.53 0 0 1-17 1.5c-.297-7.42.036-14.754 1-22Z"
          style={{
            opacity: 0.989
          }}
        />
        <path
          fill={colorDefault}
          d="M299.5 2.5v37a181.219 181.219 0 0 1-15.5-21l-1 18c-3.744 1.126-7.577 1.293-11.5.5l-1.5-1.5a256.122 256.122 0 0 1 0-32l1.5-1.5a134.764 134.764 0 0 1 28 .5Z"
          style={{
            opacity: 0.985
          }}
        />
        <path
          fill="#fe9400"
          d="M257.5 22.5c-7.805-1.331-15.972-1.998-24.5-2l-24.5.5c16.172.169 32.172.669 48 1.5h-48v15c15.004-.167 30.004 0 45 .5 1.142 6.084 1.309 12.251.5 18.5l-1.5 1.5c-14.663.5-29.33.667-44 .5v17h3c14.828.831 29.828 1.331 45 1.5-62.663.833-62.663 1.333 0 1.5v17h-76c.167-30.668 0-61.335-.5-92-.5 31.332-.667 62.665-.5 94a1141.67 1141.67 0 0 1 0-95.5c26-.667 52-.667 78 0 1.327 6.932 1.327 13.765 0 20.5Z"
          style={{
            opacity: 1
          }}
        />
        <path
          fill={colorDefault}
          d="M90.5 2.5c19.003-.167 38.003 0 57 .5-18.664.5-37.33.667-56 .5.167 31.668 0 63.335-.5 95a4608.65 4608.65 0 0 1-.5-96Z"
          style={{
            opacity: 1
          }}
        />
        <path
          fill="#fea000"
          d="M257.5 22.5h-1a1141.995 1141.995 0 0 0-48-1.5l24.5-.5c8.528.002 16.695.669 24.5 2Z"
          style={{
            opacity: 1
          }}
        />
        <path
          fill={colorDefault}
          d="M299.5 55.5v42h-28v-40c3.606-.29 7.106.044 10.5 1l1 19a573.383 573.383 0 0 1 16.5-22Z"
          style={{
            opacity: 0.997
          }}
        />
        <path
          fill="#fe9900"
          d="M211.5 75.5c15.337-.167 30.67 0 46 .5a119.044 119.044 0 0 1 1 21.5h-79c-.167-31.335 0-62.668.5-94 .5 30.665.667 61.332.5 92h76v-17c-62.663-.167-62.663-.667 0-1.5a1003.152 1003.152 0 0 1-45-1.5Z"
          style={{
            opacity: 1
          }}
        />
      </svg>
    </Box>
  )
}

SpeiLogo.propTypes = {
  color: PropTypes.any,
  invert: PropTypes.bool,
  sx: PropTypes.any
}
