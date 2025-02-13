import PropTypes from 'prop-types'

import {
  Box,
  Unstable_Grid2 as Grid2,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  alpha,
  useTheme
} from '@mui/material'
import { isSameDay } from 'date-fns'

const isSameRange = (first, second) => {
  const { startDate: fStart, endDate: fEnd } = first
  const { startDate: sStart, endDate: sEnd } = second
  if (fStart && sStart && fEnd && sEnd) {
    return isSameDay(fStart, sStart) && isSameDay(fEnd, sEnd)
  }
  return false
}

export const DefinedRanges = ({ ranges, setRange, selectedRange }) => {
  const theme = useTheme()

  return (
    <>
      <Grid2 xs="auto">
        <Box
          height="54px"
          sx={{
            backgroundColor: alpha(theme.palette.grey[400], 0.1)
          }}
        ></Box>
      </Grid2>
      <Grid2 xs>
        <List
          sx={{
            pt: '10px'
          }}
        >
          {ranges.map((range, idx) => (
            <ListItem
              disablePadding
              key={idx}
              onClick={() => setRange(range)}
              sx={[
                isSameRange(range, selectedRange)
                  ? {
                      backgroundColor: alpha(theme.palette.grey[600], 0.1)
                    }
                  : {}
              ]}
            >
              <ListItemButton
                disableRipple
                dense
                sx={{
                  p: {
                    xs: '8px',
                    md: '12px'
                  },
                  height: '32px',
                  '.mui-tlelie-MuiListItemText-root': {
                    my: 0
                  }
                }}
              >
                <ListItemText
                  primaryTypographyProps={{
                    sx: [
                      isSameRange(range, selectedRange)
                        ? {
                            color: alpha(theme.palette.text.primary, 1)
                          }
                        : {
                            color: alpha(theme.palette.text.secondary, 1)
                          },
                      {
                        fontSize: 13,
                        fontWeight: 400
                      }
                    ]
                  }}
                >
                  {range.label}
                </ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Grid2>
    </>
  )
}

DefinedRanges.propTypes = {
  ranges: PropTypes.any,
  selectedRange: PropTypes.any,
  setRange: PropTypes.func
}
