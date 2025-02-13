import { faker } from '@faker-js/faker'

export const SpeiAdminCompaniesMock = [...Array(5)].map((_, index) => ({
  id: faker.string.numeric(6),
  name: faker.company.name(),
  active: faker.datatype.boolean({ probability: 0.8 }),
  rfc: faker.string.alphanumeric(13),
  balance: faker.string.numeric(5),
  stpAccount: faker.string.numeric(18)
}))
