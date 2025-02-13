import PropTypes from 'prop-types'

import { KeyboardDoubleArrowDown, KeyboardDoubleArrowRight } from '@mui/icons-material'
import { Divider, Unstable_Grid2 as Grid2, Typography, styled, useTheme } from '@mui/material'
import { format } from 'date-fns'

import { Actions } from './Actions'

const PreviewDateTypoStyled = styled(Typography)(({ theme }) => ({
  position: 'relative',
  top: '1px',
  minWidth: '130px',
  fontSize: 14,
  lineHeight: '14px',
  color: theme.palette.text.secondary
}))

const PreviewDateMessageTypoStyled = styled(Typography)(({ theme }) => ({
  position: 'relative',
  top: '1px',
  minWidth: '130px',
  fontSize: 14,
  lineHeight: '14px',
  color: theme.palette.grey[500]
}))

export const Footer = ({ startDate, endDate, locale, onCloseCallback, onSubmit, RangeSeparatorIcons }) => {
  const theme = useTheme()
  const previewDate = date => format(date, 'dd MMMM yyyy', { locale })

  const IconXs = RangeSeparatorIcons?.xs || KeyboardDoubleArrowDown
  const IconMd = RangeSeparatorIcons?.md || KeyboardDoubleArrowRight

  return (
    <>
      <Grid2
        xs
        container
        gap={'8px'}
        direction={{
          xs: 'column',
          md: 'row'
        }}
        justifyContent="flex-start"
        alignItems={'center'}
      >
        {startDate ? (
          <PreviewDateTypoStyled
            textAlign={{
              xs: 'center',
              md: 'left'
            }}
          >
            {previewDate(startDate)}
          </PreviewDateTypoStyled>
        ) : (
          <PreviewDateMessageTypoStyled
            textAlign={{
              xs: 'center',
              md: 'left'
            }}
          >
            Fecha Inicial
          </PreviewDateMessageTypoStyled>
        )}

        <IconXs
          fontSize="small"
          sx={{
            fill: theme.palette.grey[400],
            display: {
              xs: 'block',
              md: 'none'
            }
          }}
        />

        <IconMd
          fontSize="small"
          sx={{
            fill: theme.palette.grey[400],
            display: {
              xs: 'none',
              md: 'block'
            }
          }}
        />

        {endDate ? (
          <PreviewDateTypoStyled
            textAlign={{
              xs: 'center',
              md: 'left'
            }}
          >
            {previewDate(endDate)}
          </PreviewDateTypoStyled>
        ) : (
          <PreviewDateMessageTypoStyled
            textAlign={{
              xs: 'center',
              md: 'left'
            }}
          >
            Fecha Final
          </PreviewDateMessageTypoStyled>
        )}
      </Grid2>

      <Grid2
        display={{
          xs: 'block',
          md: 'none'
        }}
      >
        <Divider orientation="horizontal" />
      </Grid2>

      <Grid2 xs="auto" container justifyContent={'flex-end'}>
        <Actions onCloseCallback={onCloseCallback} onSubmit={onSubmit} />
      </Grid2>
    </>
  )
}

Footer.propTypes = {
  RangeSeparatorIcons: PropTypes.shape({
    md: PropTypes.any,
    xs: PropTypes.any
  }),
  endDate: PropTypes.any,
  locale: PropTypes.any,
  onCloseCallback: PropTypes.any,
  onSubmit: PropTypes.any,
  startDate: PropTypes.any
}
