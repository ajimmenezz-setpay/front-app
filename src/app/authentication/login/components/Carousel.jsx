import { useRef, useState } from 'react'

import { Box, useTheme } from '@mui/material'
import { alpha, styled } from '@mui/material/styles'
import Slider from 'react-slick'

import INTEGRATION from '@/shared/assets/img/integracion-tecnologica.png'
import PAY from '@/shared/assets/img/movil-pay.png'
import { CarouselDots } from '@/shared/components/carousel'
import { Image } from '@/shared/components/images'

const OverlayStyle = styled('div')(({ theme }) => ({
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 8,
  position: 'absolute',
  backgroundColor: alpha(theme.palette.grey[900], 0.3)
}))

const _appFeatured = [INTEGRATION, PAY]

export function Carousel() {
  const theme = useTheme()
  const carouselRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(theme.direction === 'rtl' ? _appFeatured.length - 1 : 0)

  // const settings = {
  //   dots: true,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  //   adaptiveHeight: true
  // }

  const settings = {
    speed: 800,
    dots: true,
    arrows: false,
    autoplay: true,
    infinite: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
    beforeChange: (current, next) => setCurrentIndex(next),
    ...CarouselDots({
      zIndex: 9,
      top: 24,
      bottom: 'auto',
      position: 'absolute'
    }),
    adaptiveHeight: true
  }

  const handlePrevious = () => {
    carouselRef.current.slickPrev()
  }

  const handleNext = () => {
    carouselRef.current.slickNext()
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: alpha(theme.palette.grey[900], 0.3)
      }}
    >
      <Slider ref={carouselRef} {...settings}>
        {_appFeatured.map((app, index) => (
          <Box key={index} sx={{ position: 'relative' }}>
            <Image ratio={'1/1'} src={app} />
          </Box>
        ))}
      </Slider>
    </Box>
  )
}
