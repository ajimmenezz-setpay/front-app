import { useEffect, useState } from 'react'

import { Typography } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'

const TypewriterTypography = ({ text, variant, loop, ...props }) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText(prevText => prevText + text[currentIndex])
        setCurrentIndex(prevIndex => prevIndex + 1)
      } else if (loop) {
        // Reset the display text and index to restart the loop
        setDisplayText('')
        setCurrentIndex(0)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [currentIndex, text, loop])

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ minHeight: '15px' }}>
        <Typography variant={variant} {...props}>
          {displayText}
        </Typography>
      </motion.div>
    </AnimatePresence>
  )
}

export default TypewriterTypography
