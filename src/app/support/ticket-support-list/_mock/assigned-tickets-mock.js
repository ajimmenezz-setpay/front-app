import { faker } from '@faker-js/faker'
import { format } from 'date-fns'

export const AssignedTicketsMock = [...Array(5)].map((_, index) => ({
  id: faker.string.numeric(6),
  attends: faker.person.fullName(),
  cause: faker.word.words(3),
  causeColor: faker.color.rgb({ casing: 'upper' }),
  description: faker.lorem.sentence({ min: 3, max: 6 }),
  status: faker.helpers.arrayElement(['Nuevo', 'Problema', 'Resuelto']),
  date: format(faker.date.recent({ days: 30 }), 'yyyy-MM-dd HH:mm:ss')
}))
