import { useMemo, useState } from 'react'

import PropTypes from 'prop-types'

import { ArrowBackIos, GppGoodTwoTone, Lock } from '@mui/icons-material'
import {
  Alert,
  Box,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  styled
} from '@mui/material'

import { ViaboSpeiOutAdapter } from '@/app/business/viabo-spei/shared/adapters'
import { ButtonViaboSpei, LoadingButtonViaboSpei } from '@/app/business/viabo-spei/shared/components'
import { useCreateSpeiOut } from '@/app/business/viabo-spei/shared/hooks'
import { Scrollbar } from '@/shared/components/scroll'
import { fCurrency } from '@/shared/utils'

const RowResultStyle = styled(TableRow)(({ theme }) => ({
  '& td': {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5)
  }
}))

const SpeiOutResume = ({ data, onBack, setTransactionLoading, transactionLoading, onSuccess }) => {
  const { mutate, isLoading: isSending } = useCreateSpeiOut()
  const transactions = useMemo(() => data?.transactions || [], [data])

  const [googleCode, setGoogleCode] = useState('')

  const handleSubmit = () => {
    const { transactions, concept, origin, internal } = data
    const dataAdapted = ViaboSpeiOutAdapter(transactions, concept, googleCode, origin, internal)
    setTransactionLoading(true)
    mutate(dataAdapted, {
      onSuccess: data => {
        onSuccess(data)
      },
      onError: () => {
        setTransactionLoading(false)
      }
    })
  }

  const isLoading = isSending || transactionLoading

  return (
    <>
      <Scrollbar>
        {data?.insufficient && (
          <Alert sx={{ borderRadius: 0 }} severity={'warning'}>
            Saldo insuficiente para realizar la operación
          </Alert>
        )}
        <TableContainer sx={{ minWidth: 200 }}>
          <Table>
            <TableHead
              sx={{
                borderBottom: theme => `solid 1px ${theme.palette.divider}`
              }}
            >
              <TableRow>
                <TableCell width={40}>#</TableCell>
                <TableCell align="left">Movimiento</TableCell>
                <TableCell align="right">Monto</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {transactions?.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    borderBottom: theme => `solid 1px ${theme.palette.divider}`
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell align="left">
                    <Box sx={{ maxWidth: 200 }}>
                      <Typography variant="subtitle2" fontWeight={'bold'}>
                        {row?.account?.name}
                      </Typography>
                      <Typography variant="subtitle2">{row?.account?.bank?.name}</Typography>
                      <Typography variant="subtitle2">{row?.account?.clabe}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        {row?.concept}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">{fCurrency(row?.amount)}</TableCell>
                </TableRow>
              ))}

              <RowResultStyle>
                <TableCell colSpan={1} />
                <TableCell align="right">
                  <Stack flexDirection={'row'} gap={1} alignItems={'center'} justifyContent={'flex-end'}>
                    <Typography>Saldo disponible</Typography>
                  </Stack>
                </TableCell>
                <TableCell align="right" width={120}>
                  <Typography>{fCurrency(data?.balance)}</Typography>
                </TableCell>
              </RowResultStyle>

              <RowResultStyle>
                <TableCell colSpan={1} />
                <TableCell align="right">
                  <Typography variant="h6">Total a dispersar</Typography>
                </TableCell>
                <TableCell align="right" width={120}>
                  <Typography variant="h6" sx={{ color: 'error.main' }}>
                    {fCurrency(-data?.currentBalance)}
                  </Typography>
                </TableCell>
              </RowResultStyle>
              <RowResultStyle>
                <TableCell colSpan={1} />
                <TableCell align="right">
                  <Typography variant="subtitle2">Comisión por SPEI Out</Typography>
                </TableCell>
                <TableCell align="right" width={140}>
                  <Typography sx={{ color: 'error.main' }}>{fCurrency(-data?.commissions?.speiOut)}</Typography>
                </TableCell>
              </RowResultStyle>

              <RowResultStyle>
                <TableCell colSpan={1} />
                <TableCell align="right">
                  <Typography variant="subtitle2">Fee STP</Typography>
                </TableCell>
                <TableCell align="right" width={140}>
                  <Typography sx={{ color: 'error.main' }}>{fCurrency(-data?.commissions?.fee)}</Typography>
                </TableCell>
              </RowResultStyle>

              <RowResultStyle>
                <TableCell colSpan={1} />
                <TableCell align="right">
                  <Typography variant="subtitle2">Comisión por Operación Interna</Typography>
                </TableCell>
                <TableCell align="right" width={140}>
                  <Typography sx={{ color: 'error.main' }}>
                    {fCurrency(-data?.commissions?.internalTransferCompany)}
                  </Typography>
                </TableCell>
              </RowResultStyle>

              <RowResultStyle>
                <TableCell colSpan={1} />
                <TableCell align="right">
                  <Typography variant="subtitle1">Saldo actualizado</Typography>
                </TableCell>
                <TableCell align="right" width={140}>
                  <Typography>{fCurrency(data?.total)}</Typography>
                </TableCell>
              </RowResultStyle>
            </TableBody>
          </Table>
        </TableContainer>
        {!data?.insufficient && (
          <Stack spacing={1} p={3} justifyContent={'flex-end'} alignItems={'flex-end'}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Token de Google{' '}
              <Box component={'span'} color={'error.main'}>
                *
              </Box>
            </Typography>
            <TextField
              name={'googleCode'}
              type={'number'}
              size={'small'}
              placeholder={'000000'}
              required
              value={googleCode}
              onChange={e => setGoogleCode(e?.target?.value)}
              inputProps={{ pattern: '/^-?d+.?d*$/', min: '1' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                )
              }}
              disabled={isLoading}
            />
          </Stack>
        )}
      </Scrollbar>
      <Stack direction={{ md: 'row-reverse' }} sx={{ p: 3 }} gap={3}>
        <LoadingButtonViaboSpei
          size={'large'}
          onClick={handleSubmit}
          endIcon={<GppGoodTwoTone />}
          loading={isLoading}
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          disabled={!googleCode}
          sx={{ fontWeight: 'bold' }}
        >
          Enviar
        </LoadingButtonViaboSpei>

        {!isLoading && (
          <ButtonViaboSpei
            size={'large'}
            onClick={onBack}
            variant="outlined"
            color="inherit"
            fullWidth
            startIcon={<ArrowBackIos />}
          >
            Regresar
          </ButtonViaboSpei>
        )}
      </Stack>
    </>
  )
}

SpeiOutResume.propTypes = {
  data: PropTypes.shape({
    balance: PropTypes.any,
    commissions: PropTypes.shape({
      fee: PropTypes.any,
      internalTransferCompany: PropTypes.any,
      speiOut: PropTypes.any
    }),
    concept: PropTypes.any,
    currentBalance: PropTypes.any,
    insufficient: PropTypes.any,
    internal: PropTypes.any,
    origin: PropTypes.any,
    total: PropTypes.any,
    transactions: PropTypes.array
  }),
  onBack: PropTypes.func,
  onSuccess: PropTypes.func,
  setTransactionLoading: PropTypes.func,
  transactionLoading: PropTypes.any
}

export default SpeiOutResume
