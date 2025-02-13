import { banksNames } from './banks'
import { firstName, fullName, lastName } from './name'

export const _mock = {
  id: index => `e99f09a7-dd88-49d5-b1c8-1daf80c2d7b${index + 1}`,

  name: {
    firstName: index => firstName[index],
    lastName: index => lastName[index],
    fullName: index => fullName[index]
  },
  bank: {
    name: index => banksNames[index]
  },
  image: {
    cover: index => `https://minimal-assets-api.vercel.app/assets/images/covers/cover_${index + 1}.jpg`,
    feed: index => `https://minimal-assets-api.vercel.app/assets/images/feeds/feed_${index + 1}.jpg`,
    product: index => `https://minimal-assets-api.vercel.app/assets/images/products/product_${index + 1}.jpg`,
    avatar: index => `https://minimal-assets-api.vercel.app/assets/images/avatars/avatar_${index + 1}.jpg`
  }
}
