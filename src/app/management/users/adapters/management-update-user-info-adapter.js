export const ManagementUpdateUserInfoAdapter = (info, user) => ({
  userId: user?.id,
  name: info?.userName,
  lastName: info?.userLastName,
  email: info?.userEmail,
  phone: info?.userPhone
})
