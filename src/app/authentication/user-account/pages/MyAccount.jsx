import { memo } from 'react'

import { Tab, Tabs } from '@mui/material'
import { BsPersonBoundingBox } from 'react-icons/bs'

import GeneralUserInfo from '../components/GeneralUserInfo'

import { Page } from '@/shared/components/containers'
import { ContainerPage } from '@/shared/components/containers/ContainerPage'
import { HeaderPage } from '@/shared/components/layout'
import { useTabs } from '@/shared/hooks'

const TABS = [{ value: 'general', label: 'Información General', icon: <BsPersonBoundingBox fontSize={24} /> }]

export const MyAccount = memo(() => {
  const tabs = useTabs('general')
  return (
    <Page title="Mi Cuenta">
      <ContainerPage maxWidth={'lg'} sx={{ pb: 3 }}>
        <HeaderPage name={'Mi Cuenta'} links={[]} />
        <Tabs value={tabs.currentTab} onChange={tabs.onChangeTab} sx={{ mb: { xs: 3, md: 5 } }}>
          {TABS.map(tab => (
            <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>

        {tabs.currentTab === 'general' && <GeneralUserInfo />}
      </ContainerPage>
    </Page>
  )
})
