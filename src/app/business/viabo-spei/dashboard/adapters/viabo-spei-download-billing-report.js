export const ViaboSpeiDownloadBillingReport = (values, speiAccount) => ({
  account: speiAccount?.account?.number,
  month: values?.month + 1,
  year: values?.year
})
