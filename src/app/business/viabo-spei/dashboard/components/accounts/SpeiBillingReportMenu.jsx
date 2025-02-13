import React, { useState } from 'react'

import { DownloadTwoTone } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { MenuItem, Stack } from '@mui/material'
import { useFormik } from 'formik'
import { FaFileInvoice } from 'react-icons/fa6'
import * as Yup from 'yup'

import { ViaboSpeiDownloadBillingReport } from '../../adapters'
import { useGenerateSpeiBillingReport } from '../../hooks'

import { StyledMenu } from '@/shared/components/containers'
import { FormLabelTypography, FormProvider, RFSimpleSelect } from '@/shared/components/form'
import { monthOptions } from '@/shared/utils'

const menuProps = {
  PaperProps: {
    style: {
      maxHeight: 200,
      overflowY: 'auto'
    }
  }
}

const currentYear = new Date().getFullYear()
const currentMonth = new Date().getMonth()
const yearsToAdd = 0
const yearsBack = 10

const yearOptions = Array.from(
  { length: yearsToAdd + yearsBack + 1 }, // +1 para incluir el año actual
  (_, index) => currentYear - yearsBack + index
)

export const SpeiBillingReportMenu = ({ speiAccount }) => {
  const { mutate, isLoading } = useGenerateSpeiBillingReport()

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const CardSchema = Yup.object().shape({
    month: Yup.string().trim().required('Es necesario el mes'),
    year: Yup.string().trim().required('Es necesario el año')
  })

  const formik = useFormik({
    initialValues: {
      year: currentYear,
      month: currentMonth
    },
    enableReinitialize: true,
    validationSchema: CardSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const data = ViaboSpeiDownloadBillingReport(values, speiAccount)
      mutate(data, {
        onSuccess: () => {
          handleClose()
          setSubmitting(false)
          resetForm()
        },
        onError: () => {
          handleClose()
          setSubmitting(false)
          resetForm()
        }
      })
    }
  })

  const { isSubmitting } = formik

  const loading = isLoading || isSubmitting

  return (
    <Stack>
      <LoadingButton
        loading={loading}
        variant="outlined"
        size="large"
        disabled={loading}
        sx={{ color: 'text.primary', whiteSpace: 'nowrap' }}
        onClick={handleClick}
        aria-controls={open ? 'card-funding-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        startIcon={<FaFileInvoice style={{ fontSize: 18 }} />}
      >
        Estado de Cuenta
      </LoadingButton>
      <StyledMenu
        sx={theme => ({
          '& .MuiPaper-root': {
            minWidth: 300
          },
          [theme.breakpoints.down('sm')]: {
            '& .MuiPaper-root': {
              width: '100%'
            }
          }
        })}
        open={Boolean(open)}
        anchorEl={anchorEl}
        onClose={() => {
          if (loading) return
          handleClose()
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <FormProvider formik={formik}>
          <Stack p={3} gap={2}>
            <Stack gap={1}>
              <FormLabelTypography required fontWeight={'bold'}>
                Mes
              </FormLabelTypography>
              <RFSimpleSelect MenuProps={menuProps} labelId="month-select-label" name={'month'} disabled={loading}>
                {monthOptions.map((month, index) => (
                  <MenuItem key={index} value={index}>
                    {month}
                  </MenuItem>
                ))}
              </RFSimpleSelect>
            </Stack>

            <Stack gap={1}>
              <FormLabelTypography required fontWeight={'bold'}>
                Año
              </FormLabelTypography>
              <RFSimpleSelect MenuProps={menuProps} labelId="year-select-label" name={'year'} disabled={loading}>
                {yearOptions.map(year => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </RFSimpleSelect>
            </Stack>
            <Stack sx={{ pt: 2 }}>
              <LoadingButton
                loading={loading}
                endIcon={<DownloadTwoTone />}
                type="submit"
                size="large"
                variant="contained"
                sx={{ fontWeight: 'bold' }}
              >
                Generar
              </LoadingButton>
            </Stack>
          </Stack>
        </FormProvider>
      </StyledMenu>
    </Stack>
  )
}
