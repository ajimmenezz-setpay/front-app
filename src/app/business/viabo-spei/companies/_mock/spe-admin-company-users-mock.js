import { faker } from '@faker-js/faker'

import { _mock } from '@/app/shared/_mock'
import { getCryptInfo } from '@/shared/utils'

export const SpeiAdminCompanyUsersMock = getCryptInfo(
  [...Array(5)].map((_, index) => ({
    id: _mock.id(index),
    name: faker.person.fullName(),
    status: faker.datatype.boolean({ probability: 0.8 })
  }))
)
