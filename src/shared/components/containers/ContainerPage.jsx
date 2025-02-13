import { Container } from '@mui/material'
import { motion } from 'framer-motion'

import { MotionContainer } from '@/shared/components/animate'

export function ContainerPage({ children, sx, ...others }) {
  return (
    <Container component={MotionContainer} maxWidth={false} sx={{ ...sx, pb: 12 }} {...others}>
      <motion.div exit={{ opacity: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        {children}
      </motion.div>
    </Container>
  )
}
