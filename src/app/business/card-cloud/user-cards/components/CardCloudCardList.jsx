import { useRef } from 'react'

import { Box, Skeleton, Stack, styled } from '@mui/material'
import Slider from 'react-slick'

import { CardCloudUserCardItem } from './CardCloudUserCardItem'

import { useCardsOfCardCloudStore } from '../../cards/store'
import { useCardCloudSharedStore } from '../../shared/store'

import { CarouselDots } from '@/shared/components/carousel'
import CarouselArrows from '@/shared/components/carousel/CarouselArrows'

const HEIGHT = 276

const RootStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: Number(theme.shape.borderRadius) * 2,
  height: HEIGHT,
  '& .slick-list': {
    borderRadius: Number(theme.shape.borderRadius) * 2
  }
}))

const shadowStyle = {
  mx: 'auto',
  width: 'calc(100% - 16px)',
  borderRadius: 2,
  position: 'absolute',
  height: 200,
  zIndex: 8,
  bottom: 8,
  left: 0,
  right: 0,
  bgcolor: 'grey.500',
  opacity: 0.32
}

export const CardCloudCardList = ({ queryCards }) => {
  const { data, isLoading } = queryCards
  const carouselRef = useRef(null)
  const { setSelectedCard } = useCardsOfCardCloudStore()
  const setSelectedCompany = useCardCloudSharedStore(state => state.setSelectedCompany)
  const { selectedCard } = useCardsOfCardCloudStore()

  if (isLoading) {
    return (
      <Stack flex={1}>
        <Skeleton
          variant="rounded"
          width={'100%'}
          height={HEIGHT}
          sx={{
            width: 1,
            minWidth: '100%',
            height: HEIGHT,
            background: theme => (theme.palette.mode === 'dark' ? 'background.paper' : theme.palette.grey.A200)
          }}
        />
      </Stack>
    )
  }

  const settings = {
    dots: data?.length > 1,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    rtl: true,
    beforeChange: (current, next) => {
      const nextCard = data[next]
      const currentCard = data[current]

      if (selectedCard?.id === nextCard?.id) {
        setSelectedCard(currentCard)
        setSelectedCompany(currentCard?.company)
      } else {
        setSelectedCard(nextCard)
        setSelectedCompany(nextCard?.company)
      }
    },
    afterChange: current => {},
    ...CarouselDots({ position: 'absolute', right: 0, top: 220, color: 'white' })
  }

  const handlePrevious = () => {
    carouselRef.current?.slickPrev()
  }

  const handleNext = () => {
    carouselRef.current?.slickNext()
  }

  return (
    <RootStyle>
      <Box sx={{ position: 'relative', zIndex: 9 }}>
        {data?.length > 1 && (
          <CarouselArrows
            filled
            onPrevious={handlePrevious}
            onNext={handleNext}
            customIcon={'eva:arrow-ios-forward-fill'}
            sx={{
              '& .arrow': {
                mt: '-10px',
                boxShadow: theme => theme.customShadows.z24,
                '&.left': { left: -22 },
                '&.right': { right: -22 },
                '& button': {
                  width: 40,
                  height: 40,
                  borderRadius: '50%',

                  backgroundColor: theme => (theme.palette.mode === 'light' ? 'black' : 'white'),
                  color: theme => (theme.palette.mode === 'light' ? 'white' : 'black'),
                  display: data?.length > 1 ? 'block' : 'none'
                }
              }
            }}
          >
            <Slider ref={carouselRef} {...settings}>
              {data?.map((card, index) => (
                <CardCloudUserCardItem key={index} card={card} />
              ))}
            </Slider>
          </CarouselArrows>
        )}
        {data?.length === 1 && <CardCloudUserCardItem card={data?.[0]} />}
      </Box>

      <Box sx={{ ...shadowStyle }} />
      <Box
        sx={{
          ...shadowStyle,
          opacity: 0.16,
          bottom: 0,
          zIndex: 7,
          width: 'calc(100% - 40px)'
        }}
      />
    </RootStyle>
  )
}
