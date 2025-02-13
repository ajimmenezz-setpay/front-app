export const NewCommerceAdapter = commerce => {
  const { name, lastName, phone, email, password, confirmPassword } = commerce

  return {
    name,
    lastname: lastName,
    phone,
    email,
    password,
    confirmPassword
  }
}
