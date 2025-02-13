import { faker } from '@faker-js/faker'

export const SpeiAdminCostCentersMock = [...Array(5)].map((_, index) => ({
  id: faker.string.numeric(6),
  name: faker.company.name(),
  active: faker.datatype.boolean({ probability: 0.8 }),
  companies: faker.string.numeric(2)
}))
