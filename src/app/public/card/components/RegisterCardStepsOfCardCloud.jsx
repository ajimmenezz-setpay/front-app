import { lazy, useState } from 'react'

import { Paper, Stack, Step, StepLabel, Stepper } from '@mui/material'
import { AnimatePresence } from 'framer-motion'

import { ColorlibConnector, ColorStepIconRegisterCard } from './StepStyles'

import { Lodable } from '@/shared/components/lodables'

const steps = ['Validar Tarjeta', 'Crear Usuario']

const ValidateCardFormOfCardCloud = Lodable(lazy(() => import('./ValidateCardFormOfCardCloud')))
const RegisterCardHolderFormOfCardCloud = Lodable(lazy(() => import('./RegisterCardHolderFormOfCardCloud')))

const RegisterCardStepsOfCardCloud = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [cardData, setCardData] = useState(null)

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  const handleSuccessValidate = data => {
    setCardData(data)
    handleNext()
  }

  return (
    <Stack flexGrow={1}>
      <Stack flex={1} justifyContent={'center'} gap={4}>
        <Paper variant="outlined" sx={{ p: 3, backgroundColor: 'inherit' }}>
          <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel StepIconComponent={ColorStepIconRegisterCard}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>
        <AnimatePresence>
          {activeStep === 0 && <ValidateCardFormOfCardCloud onSuccess={handleSuccessValidate} />}
          {activeStep === 1 && (
            <RegisterCardHolderFormOfCardCloud
              cardData={cardData}
              handleReset={() => {
                setCardData(null)
                handleReset()
              }}
            />
          )}
        </AnimatePresence>
      </Stack>
    </Stack>
  )
}

export default RegisterCardStepsOfCardCloud
