import PropTypes from 'prop-types'

import {
  FormLabel,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'

import { RightPanel } from '@/app/shared/components'
import { Scrollbar } from '@/shared/components/scroll'

const BalanceDrawer = ({ open, onClose, card, dateRange }) => (
  <RightPanel
    open={open}
    handleClose={onClose}
    titleElement={
      <Stack spacing={0.5}>
        <Typography variant="h6" gutterBottom>
          {`Balance del periodo seleccionado`}
        </Typography>
        {dateRange && (
          <Typography variant="subtitle2" gutterBottom textTransform={'capitalize'}>
            {dateRange}
          </Typography>
        )}
      </Stack>
    }
  >
    <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
      <Stack spacing={1} pt={2}>
        <Stack alignItems={'center'}>
          <Stack direction={'row'} spacing={1}>
            <Typography variant="h2" color={card?.balanceMovements?.includes('-') ? 'error' : 'success.main'}>
              {card?.balanceMovements}
            </Typography>
            <Typography variant="caption">MXN</Typography>
          </Stack>

          <Stack direction={'row'} alignItems={'center'} spacing={1}>
            <Typography variant="h6" color={'success.main'}>
              {card?.income}
            </Typography>
            <FormLabel sx={{ fontSize: 24 }}> / </FormLabel>
            <Typography variant="h6" color={'error'}>
              -{card?.expenses}
            </Typography>
          </Stack>
        </Stack>
        <Stack>
          <Stack flex={1} sx={{ backgroundColor: theme => theme.palette.background.neutral }}></Stack>
          <TableContainer sx={{ minWidth: 200 }}>
            <Table>
              <TableHead
                sx={{
                  borderBottom: theme => `solid 1px ${theme.palette.divider}`
                }}
              >
                <TableRow>
                  <TableCell align="left">
                    <Typography variant="h6">Gastos</Typography>
                  </TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow
                  sx={{
                    borderBottom: theme => `solid 1px ${theme.palette.divider}`
                  }}
                >
                  <TableCell align="left">
                    <Typography variant="subtitle2">Comprobado con Factura</Typography>
                  </TableCell>

                  <TableCell align="right">{card?.expensesWithInvoice}</TableCell>
                </TableRow>
                <TableRow
                  sx={{
                    borderBottom: theme => `solid 1px ${theme.palette.divider}`
                  }}
                >
                  <TableCell align="left">
                    <Typography variant="subtitle2">Comprobado sin Factura</Typography>
                  </TableCell>

                  <TableCell align="right">{card?.expensesWithoutInvoice}</TableCell>
                </TableRow>
                <TableRow
                  sx={{
                    borderBottom: theme => `solid 1px ${theme.palette.divider}`
                  }}
                >
                  <TableCell align="left">
                    <Typography variant="subtitle2">Sin comprobar</Typography>
                  </TableCell>

                  <TableCell align="right">{card?.expensesWithoutChecked}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={1} />

                  <TableCell align="right" width={120}>
                    <Typography variant="subtitle1">{card?.totalExpensesOtherCharges}</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Stack>
    </Scrollbar>
  </RightPanel>
)

BalanceDrawer.propTypes = {
  card: PropTypes.shape({
    balanceMovements: PropTypes.any,
    expenses: PropTypes.any,
    expensesWithInvoice: PropTypes.any,
    expensesWithoutChecked: PropTypes.any,
    expensesWithoutInvoice: PropTypes.any,
    income: PropTypes.any,
    totalExpensesOtherCharges: PropTypes.any
  }),
  dateRange: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool
}

export default BalanceDrawer
