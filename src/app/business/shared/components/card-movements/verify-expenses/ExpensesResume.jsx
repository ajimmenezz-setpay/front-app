import { useMemo } from 'react'

import PropTypes from 'prop-types'

import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled
} from '@mui/material'

import { Scrollbar } from '@/shared/components/scroll'
import { fCurrency } from '@/shared/utils'

const RowResultStyle = styled(TableRow)(({ theme }) => ({
  '& td': {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5)
  }
}))

const ExpensesResume = ({ movements = [] }) => {
  const total = useMemo(
    () =>
      movements?.reduce((accumulator, currentObject) => {
        const amountValue = currentObject?.amount ? currentObject?.amount : 0

        if (!isNaN(amountValue)) {
          return accumulator + amountValue
        } else {
          return accumulator
        }
      }, 0),
    [movements]
  )

  return (
    <>
      <Scrollbar sx={{ maxHeight: 400 }}>
        <TableContainer sx={{ minWidth: 200 }}>
          <Table>
            <TableHead
              sx={{
                borderBottom: theme => `solid 1px ${theme.palette.divider}`
              }}
            >
              <TableRow>
                <TableCell width={40}>#</TableCell>
                <TableCell sx={{ minWidth: 150 }} align="left">
                  Movimiento
                </TableCell>
                <TableCell align="left">Fecha</TableCell>
                <TableCell align="right">Monto</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {movements?.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    borderBottom: theme => `solid 1px ${theme.palette.divider}`
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell align="left">
                    <Box sx={{ maxWidth: 200 }}>
                      <Typography variant="subtitle2">{row?.description}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">{row?.date}</Typography>
                  </TableCell>
                  <TableCell align="right">{fCurrency(row?.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
      <Stack justifyContent={'flex-end'} direction={'row'}>
        <Stack direction={'row'} spacing={2} px={2}>
          <Typography variant="h6">Total</Typography>
          <Typography variant="h6">{fCurrency(total)}</Typography>
        </Stack>
      </Stack>
    </>
  )
}

ExpensesResume.propTypes = {
  movements: PropTypes.array
}

export default ExpensesResume
