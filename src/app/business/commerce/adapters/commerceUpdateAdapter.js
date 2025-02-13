export const CommerceUpdateAdapter = (resume, stepUpdate) => {
  const {
    id,
    idUser,
    services,
    fiscalTypePerson,
    fiscalName,
    rfc,
    commercialName,
    employeesNumber,
    branchesNumber,
    tpvsNumber,
    apiRequired,
    cardsNumber,
    cardsUse,
    customCardsRequired,
    files,
    step
  } = resume

  return {
    commerceId: id,
    fiscalPersonType: fiscalTypePerson,
    fiscalName,
    tradeName: commercialName,
    rfc,
    employees: employeesNumber,
    branchOffices: branchesNumber,
    pointSaleTerminal: tpvsNumber,
    paymentApi: apiRequired ? 1 : 0,
    registerStep: stepUpdate ?? step,
    services
  }
}
