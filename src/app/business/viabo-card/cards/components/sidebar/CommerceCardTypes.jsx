import PropTypes from 'prop-types'

import { Box } from '@mui/material'
import { getAvatarColor } from '@theme/utils'
import { motion } from 'framer-motion'

import { useCommerceDetailsCard } from '@/app/business/viabo-card/cards/store'
import { Label } from '@/shared/components/form'
import { RequestLoadingComponent } from '@/shared/components/loadings'
import { ErrorRequestPage } from '@/shared/components/notifications'

export function CommerceCardTypes({ cardTypes, isLoading, isError, refetch }) {
  const setCardTypeSelected = useCommerceDetailsCard(state => state.setCardTypeSelected)
  const cardTypeSelected = useCommerceDetailsCard(state => state.cardTypeSelected)

  const handleChangeCardType = cardType => {
    setCardTypeSelected(cardType?.id)
  }

  return (
    <Box display="flex">
      {isLoading && <RequestLoadingComponent />}
      {isError && !isLoading && (
        <ErrorRequestPage errorMessage={'No existen tipos de tarjetas para este comercio'} handleButton={refetch} />
      )}
      {!isLoading &&
        !isError &&
        cardTypes?.map(cardType => {
          const selected = cardTypeSelected === cardType?.id
          return (
            <Label
              key={cardType?.id}
              variant={selected ? 'ghost' : 'filled'}
              color={getAvatarColor(cardType?.name || 'inherit')}
              sx={{
                textTransform: 'uppercase',
                marginRight: 1,
                marginBottom: 2,
                cursor: 'pointer',
                border: selected ? 3 : 0,
                borderColor: selected ? theme => theme.palette.primary.main : 'inherit'
              }}
            >
              <motion.div
                key={cardType?.id}
                onClick={() => handleChangeCardType(cardType)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.8 }}
              >
                {cardType?.name}
              </motion.div>
            </Label>
          )
        })}
    </Box>
  )
}

CommerceCardTypes.propTypes = {
  cardTypes: PropTypes.array,
  isError: PropTypes.any,
  isLoading: PropTypes.any,
  refetch: PropTypes.any
}
