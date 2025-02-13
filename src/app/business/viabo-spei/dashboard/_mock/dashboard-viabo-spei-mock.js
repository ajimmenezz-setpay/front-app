import { faker } from '@faker-js/faker'

export const SpeiCompaniesDashboardMock = [...Array(faker.number.int({ min: 5, max: 20 }))].map((_, index) => ({
  id: faker.string.numeric(6),
  name: faker.company.name(),
  balance: faker.number.float({ fractionDigits: 2, min: 100, max: 10000 }),
  bankAccount: faker.string.numeric(18)
}))

export const CostCentersDashboardMock = [...Array(faker.number.int({ min: 2, max: 10 }))].map((_, index) => ({
  id: faker.string.numeric(6),
  name: `Centro de Costos No.${index}`,
  companies: SpeiCompaniesDashboardMock
}))

export const SpeiConcentratorsDashboardMock = [...Array(1)].map((_, index) => ({
  id: faker.string.numeric(6),
  name: faker.company.name(),
  balance: faker.number.float({ fractionDigits: 2, min: 100, max: 200000 }),
  companiesBalance: faker.number.float({ fractionDigits: 2, min: 100, max: 50000 }),
  operationBalance: faker.number.float({ fractionDigits: 2, min: 100, max: 100000 }),
  companies: SpeiCompaniesDashboardMock,
  accountNumber: faker.string.numeric(18)
}))
