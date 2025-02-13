import { faker } from '@faker-js/faker'

import { _mock } from '@/app/shared/_mock'

export const ThirdAccountsMock = [...Array(100)].map((_, index) => ({
  id: _mock.id(index),
  name: faker.person.fullName(),
  clabe: faker.string.numeric(18),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  bank: _mock.bank.name(index),
  rfc: faker.string.nanoid(13),
  alias: faker.person.middleName(),
  status: faker.datatype.boolean({ probability: 0.6 })
}))
