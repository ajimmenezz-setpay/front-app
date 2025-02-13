import { Apps, FormatListBulleted } from '@mui/icons-material'
import { Autocomplete, Skeleton, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material'

import { CardsActions } from './CardsActions'

import { useCardCloudSharedStore } from '../../shared/store'
import { useCardsOfCardCloudStore } from '../store'

import { useResponsive } from '@/theme/hooks'

const CardsHeaderOfCardCloud = ({ loading, companies, cardsQuery, view, handleChangeView }) => {
  const setCollapse = useCardsOfCardCloudStore(state => state.setCollapse)
  const isCollapse = useCardsOfCardCloudStore(state => state.isCollapse)
  const { setSelectedCompany } = useCardCloudSharedStore()
  const { selectedCompany } = useCardCloudSharedStore()

  const setSelectedCard = useCardsOfCardCloudStore(state => state.setSelectedCard)
  const isDesktop = useResponsive('up', 'md')
  const hasMoreThanOneCompany = companies?.length > 1

  const handleChangeCompany = (e, newValue) => {
    setSelectedCompany(newValue)
    setSelectedCard(null)
    isDesktop && isCollapse && setCollapse(false)
  }
  return (
    <>
      {loading && (
        <Stack flexGrow={1} gap={3} flexDirection={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }}>
          <Stack flexGrow={1}>
            <Skeleton
              variant="rounded"
              sx={{
                width: 1,
                minWidth: 100,
                height: 40,
                background: theme => (theme.palette.mode === 'dark' ? 'background.paper' : theme.palette.grey.A200)
              }}
            />
          </Stack>
          <Stack flex={1}>
            <Skeleton
              variant="rounded"
              sx={{
                width: 1,
                height: 40,
                background: theme => (theme.palette.mode === 'dark' ? 'background.paper' : theme.palette.grey.A200)
              }}
            />
          </Stack>
        </Stack>
      )}
      {!loading && (
        <Stack
          flexGrow={hasMoreThanOneCompany ? 1 : 0}
          gap={2}
          flexDirection={{ xs: 'column', md: 'row' }}
          alignItems={{ md: 'center' }}
        >
          {hasMoreThanOneCompany && (
            <Stack flexGrow={1}>
              <Autocomplete
                disableClearable
                options={companies || []}
                fullWidth
                size="small"
                value={selectedCompany}
                disabled={loading}
                onChange={handleChangeCompany}
                getOptionLabel={option => option?.label || ''}
                getOptionDisabled={option => option?.isDisabled}
                isOptionEqualToValue={(option, current) => option?.value === current?.value}
                renderInput={params => (
                  <TextField
                    {...params}
                    label={'Empresas'}
                    placeholder="Seleccionar"
                    InputProps={{
                      ...params.InputProps
                    }}
                  />
                )}
              />
            </Stack>
          )}
          <Stack flex={1} justifyContent={'flex-end'}>
            <CardsActions loading={loading} cardsQuery={cardsQuery} />
          </Stack>
          <Stack alignItems={{ xs: 'center', md: 'flex-end' }}>
            <ToggleButtonGroup
              size={'small'}
              color="primary"
              value={view}
              exclusive
              onChange={handleChangeView}
              aria-label="Platform"
            >
              <ToggleButton value="list">
                <FormatListBulleted />
              </ToggleButton>
              <ToggleButton value="details">
                <Apps />
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Stack>
      )}
    </>
  )
}

export default CardsHeaderOfCardCloud
