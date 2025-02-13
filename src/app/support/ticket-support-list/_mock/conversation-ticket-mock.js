import { faker } from '@faker-js/faker'
import { format } from 'date-fns'

export const MessagesTicketMock = [...Array(20)].map((_, index) => ({
  id: faker.string.numeric(6),
  name: faker.person.fullName(),
  message: faker.lorem.paragraph({ min: 3, max: 6 }),
  createDate: format(faker.date.recent({ days: 30 }), 'yyyy-MM-dd HH:mm:ss'),
  my: faker.datatype.boolean({ probability: 0.4 }),
  localAttachment: faker.image.url(),
  photo: faker.internet.avatar()
}))

export const ConversationTicketMock = {
  participants: [],
  messages: MessagesTicketMock
}
