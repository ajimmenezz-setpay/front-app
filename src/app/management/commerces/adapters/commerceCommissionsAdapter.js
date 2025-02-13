export const CommerceCommissionsAdapter = (commissions, commerceId) => ({
  commerceId,
  speiInCarnet: commissions?.speiInCarnet,
  speiOutCarnet: commissions?.speiOutCarnet,
  speiInMasterCard: commissions?.speiInMasterCard,
  speiOutMasterCard: commissions?.speiOutMasterCard,
  pay: commissions?.viaboPay,
  sharedTerminal: commissions?.cloud
})
