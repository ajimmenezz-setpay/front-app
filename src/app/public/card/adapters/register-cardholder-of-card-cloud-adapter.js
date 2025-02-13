export const RegisterCardHolderOfCardCloudAdapter = (userData, cardData) => {
  const user = {
    subAccount: cardData?.subaccount_id,
    card: cardData?.card_id,
    name: userData?.userName,
    lastname: userData?.userLastName,
    phone: userData?.userPhone,
    email: userData?.userEmail
  }
  return user
}
