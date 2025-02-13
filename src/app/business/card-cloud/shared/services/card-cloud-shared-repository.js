import {
  CardCloudCardByClientIdV2Adapter,
  CardCloudCardHoldersByCompanyAdapter,
  CardCloudCompaniesAdapter,
  CardCloudSubAccountInfoAdapter,
  CardCloudTransactionBetweenCardsV2Adapter,
  CardsListAdapterOfCardCloud
} from '../adapters'

import { API_SET_V2, axios } from '@/shared/interceptors'

export const getCardCloudCompanies = async () => {
  const { data } = await axios.get('/commerces/card-cloud-service')

  return CardCloudCompaniesAdapter(data)
}

export const getCardsBySubAccountId = async subAccountId => {
  const { data } = await axios.get(`/cardCloud/sub-account/${subAccountId}/cards`)

  return CardsListAdapterOfCardCloud(data)
}

export const newTransactionsOfCardCloud = async transaction => {
  const { data } = await axios.post(`/cardCloud/transfer`, transaction)

  return data
}

export const getCardHoldersByCompany = async companyId => {
  const { data } = await axios.get(`/company/users/card-cloud-owners/${companyId}`)

  return CardCloudCardHoldersByCompanyAdapter(data)
}

export const sendTransferBetweenCardsOfCardCloud = async transaction => {
  const { data } = await API_SET_V2.post(`/cardCloud/card/transfer`, transaction)

  return CardCloudTransactionBetweenCardsV2Adapter(data)
}

export const findCardByClientIdOfCardCloud = async searchData => {
  const { data } = await API_SET_V2.get(`/cardCloud/card/client-id/${searchData?.clientId}`)

  return CardCloudCardByClientIdV2Adapter(data)
}

export const uploadFundingCardsFileOfCardCloud = async cards => {
  const { data } = await axios.postForm(`/cardCloud/transfers-from-file`, cards)
  return CardCloudSubAccountInfoAdapter(data)
}

export const getCardCloudSubAccountInfo = async subAccountId => {
  const { data } = await axios.get(`commerce/${subAccountId}/sub-account`)

  return CardCloudSubAccountInfoAdapter(data)
}
